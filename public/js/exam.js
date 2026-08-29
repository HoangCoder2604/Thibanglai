// ============================================================
// EXAM ENGINE (FULL UPDATED & FIXED SOURCE CODE)
// ============================================================

let currentLicense = null;
let examMode = 'exam'; // 'exam' hoặc 'practice'
let questions = [];
let currentQ = 0;
let answers = {};
let skipped = new Set();
let timerInterval = null;
let timeLeft = 0;
let examStartTime = null;

// Biến cờ khóa toàn cục ngăn chặn nộp bài trùng lặp nhiều lần
let isSubmittingExam = false;

// ── 1. Helper Functions ───────────────────────────────────────

function fmtTime(sec) {
  if (isNaN(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getCorrectAnswer(q) {
  if (q.correct !== undefined) return q.correct;
  if (q.answer !== undefined) return q.answer;
  return 0;
}

// ── 1.1 Supabase Integration ──────────────────────────────────

async function saveExamResultToSupabase(score, totalQuestions, licenseId, isPassed) {
  const sb = window.supabaseClient || (window.supabase && typeof window.supabase.from === 'function' ? window.supabase : null);
  
  if (!sb || typeof sb.auth?.getUser !== 'function') {
    console.warn("⚠️ Supabase Client chưa được khởi tạo đúng cách hoặc thiếu hàm auth!");
    return;
  }

  let userId = null;
  let userEmail = null;

  try {
    const { data: authData } = await sb.auth.getUser();
    if (authData?.user) {
      userId = authData.user.id;
      userEmail = authData.user.email;
    }
  } catch (err) {
    console.warn("Không thể lấy user từ sb.auth.getUser():", err.message);
  }

  if (!userId && typeof Auth !== 'undefined' && typeof Auth.currentUser === 'function') {
    try {
      const customUser = await Auth.currentUser();
      if (customUser) {
        userId = userId || customUser.id || customUser.uid || customUser.user_id;
        userEmail = userEmail || customUser.email;
      }
    } catch (err) {
      console.warn("Không thể lấy user từ Auth.currentUser():", err.message);
    }
  }

  if (!userId) {
    console.warn("⚠️ Không tìm thấy ID người dùng, bỏ qua lưu kết quả.");
    return;
  }

  if (typeof sb.from !== 'function') {
    console.error("❌ Lỗi: sb.from không phải là một hàm!");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const finalLicenseId = licenseId || window.currentLicense?.id || urlParams.get('license') || 'A1';

  const { error } = await sb.from('exam_results').insert([
    {
      user_id: userId,
      user_email: userEmail || 'unknown@domain.com',
      license_id: String(finalLicenseId),
      score: Number(score),
      total_questions: Number(totalQuestions),
      is_passed: Boolean(isPassed)
    }
  ]);

  if (error) {
    console.error("❌ Lỗi Supabase khi lưu kết quả:", error.message);
  } else {
    console.log("✅ Đã lưu kết quả thi thành công cho hạng:", finalLicenseId);
  }
}

// ── 2. Đề thi & Khởi tạo (Đã chuẩn hóa số lượng câu điểm liệt) ──

function generateQuestions(license) {
  if (!license) return [];
  
  let pool = [];
  if (typeof getQuestionsForLicense === 'function') {
    pool = getQuestionsForLicense(license.id);
  } else if (typeof QUESTIONS !== 'undefined') {
    pool = QUESTIONS;
  }

  if (!pool || pool.length === 0) return [];

  const criticals = pool.filter(q => q.critical).sort(() => Math.random() - 0.5);
  const normals   = pool.filter(q => !q.critical).sort(() => Math.random() - 0.5);
  const count     = license.questions || pool.length;

  // Cố định số lượng câu điểm liệt chuẩn: Hạng A1 lấy đúng 1 câu, các hạng khác lấy đúng 2 câu
  const targetCriticalCount = (license.id === 'A1') ? 1 : 2;
  const numCrit = Math.min(criticals.length, targetCriticalCount);
  
  let selected = [...criticals.slice(0, numCrit), ...normals.slice(0, count - numCrit)];

  if (selected.length < count && typeof QUESTIONS !== 'undefined') {
    const extra = QUESTIONS.filter(q => !selected.includes(q)).sort(() => Math.random() - 0.5);
    selected = [...selected, ...extra.slice(0, count - selected.length)];
  }

  return selected.sort(() => Math.random() - 0.5);
}

function startExam() {
  isSubmittingExam = false;

  const urlParams = new URLSearchParams(window.location.search);
  const urlLicenseId = urlParams.get('license');

  if (!currentLicense && urlLicenseId && typeof LICENSES !== 'undefined') {
    currentLicense = LICENSES.find(l => l.id === urlLicenseId);
  }

  if (!currentLicense) {
    if (typeof LICENSES !== 'undefined' && LICENSES.length > 0) {
      currentLicense = LICENSES[0];
    } else {
      alert('Chưa chọn hạng bằng lái!');
      return;
    }
  }

  questions = generateQuestions(currentLicense);
  if (!questions || questions.length === 0) {
    alert('Không tìm thấy dữ liệu câu hỏi!');
    return;
  }

  answers       = {};
  skipped       = new Set();
  currentQ      = 0;
  examStartTime = Date.now();

  const badge = document.getElementById('exam-badge');
  if (badge) {
    badge.textContent      = currentLicense.id;
    badge.style.background = currentLicense.color || 'var(--primary)';
  }

  const modeLabel = document.getElementById('exam-mode-label');
  if (modeLabel) modeLabel.textContent = examMode === 'exam' ? '🎯 Thi thử' : '📚 Luyện tập';

  const qTotal = document.getElementById('q-total');
  if (qTotal) qTotal.textContent = questions.length;

  const liveTotal = document.getElementById('live-total');
  if (liveTotal) liveTotal.textContent = questions.length;

  clearInterval(timerInterval);
  const timerEl = document.getElementById('timer');
  if (timerEl) {
    if (examMode === 'exam') {
      timeLeft = (currentLicense.time || 19) * 60;
      timerEl.style.display = '';
      timerEl.classList.remove('urgent');
      startTimer();
    } else {
      timerEl.textContent = '∞';
    }
  }

  buildQGrid();
  renderQuestion();
  showExamScreen();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restartExam() { 
  startExam(); 
}

function showExamScreen() {
  const setupScreen  = document.getElementById('setup-screen');
  const examScreen   = document.getElementById('exam-screen');
  const resultScreen = document.getElementById('result-screen');

  if (setupScreen)  setupScreen.style.display  = 'none';
  if (examScreen)   examScreen.style.display   = 'block';
  if (resultScreen) resultScreen.style.display = 'none';
}

// ── 3. Quản lý Thời Gian ──────────────────────────────────────

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    const timerEl = document.getElementById('timer');
    if (timerEl && timeLeft <= 60) timerEl.classList.add('urgent');
    
    if (timeLeft <= 0) { 
      clearInterval(timerInterval); 
      alert('⏰ Hết thời gian làm bài! Hệ thống tự động nộp bài.');
      submitExam(); 
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = fmtTime(timeLeft);
}

// ── 4. Lưới câu hỏi (Question Grid) ──────────────────────────

function buildQGrid() {
  const gridEl = document.getElementById('q-grid');
  if (!gridEl) return;
  
  gridEl.innerHTML = questions.map((_, i) =>
    `<div class="q-dot" id="qdot-${i}" onclick="jumpToQ(${i})">${i + 1}</div>`
  ).join('');
}

function updateQGrid() {
  questions.forEach((_, i) => {
    const dot = document.getElementById('qdot-' + i);
    if (!dot) return;
    dot.className = 'q-dot';
    if (i === currentQ)                     dot.classList.add('current');
    else if (answers[i] !== undefined) dot.classList.add('answered');
    else if (skipped.has(i))            dot.classList.add('skipped');
  });
}

// ── 5. Render nội dung câu hỏi ────────────────────────────────

function renderQuestion() {
  const q = questions[currentQ];
  if (!q) return;

  const card = document.getElementById('question-card');
  if (card) {
    card.classList.remove('fade-in', 'slide-in');
    void card.offsetWidth;
    card.classList.add('fade-in', 'slide-in');
  }

  const totalQuestions = questions.length;

  const qCurrent = document.getElementById('q-current');
  if (qCurrent) qCurrent.textContent = currentQ + 1;

  const qTotal = document.getElementById('q-total');
  if (qTotal) qTotal.textContent = totalQuestions;

  const critBadge = document.getElementById('q-critical-badge');
  if (critBadge) critBadge.style.display = q.critical ? '' : 'none';

  let rawText = q.text || q.question || '';
  let cleanText = rawText.replace(/^(Câu|Cau)\s*\d+([\s\.\:\-\/]+\d*)*/i, '').trim();

  const qText = document.getElementById('q-text');
  if (qText) {
    qText.textContent = `Câu ${currentQ + 1}/${totalQuestions}: ${cleanText}`;
  }

  const imgEl = document.getElementById('q-image');
  if (imgEl) {
    if (q.image) {
      imgEl.innerHTML = `<img src="${q.image}" alt="Hình câu hỏi" style="max-width:100%; border-radius:8px; margin-top:10px;">`;
      imgEl.style.display = 'block';
    } else {
      imgEl.innerHTML = '';
      imgEl.style.display = 'none';
    }
  }

  const keys = ['A', 'B', 'C', 'D'];
  const correctAns = getCorrectAnswer(q);
  const revealed   = examMode === 'practice' && answers[currentQ] !== undefined;
  const userAns    = answers[currentQ];

  const optionsContainer = document.getElementById('options-container');
  if (optionsContainer) {
    optionsContainer.innerHTML = (q.options || []).map((opt, i) => {
      let cls = 'option';
      if (answers[currentQ] === i && !revealed) cls += ' selected';
      if (revealed) {
        cls += i === correctAns ? ' correct' : (i === userAns ? ' wrong' : '');
        cls += ' disabled';
      }
      return `<div class="${cls}" onclick="selectOption(${i})">
        <div class="opt-key">${keys[i]}</div>
        <div class="opt-text">${opt}</div>
      </div>`;
    }).join('');
  }

  const explain = document.getElementById('q-explain');
  if (explain) {
    if (revealed) {
      explain.innerHTML = `<strong>💡 Giải thích:</strong> ${q.explain || q.explanation || 'Không có giải thích.'}`;
      explain.classList.add('show');
    } else {
      explain.classList.remove('show');
    }
  }

  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) btnPrev.disabled = currentQ === 0;

  const btnNext = document.getElementById('btn-next');
  if (btnNext) btnNext.textContent = currentQ === totalQuestions - 1 ? '📋 Nộp bài' : 'Câu tiếp →';

  updateQGrid();
  updateLiveScore();
  updateProgress();
}

// ── 6. Thao tác chọn & Điều hướng câu hỏi ─────────────────────

function selectOption(idx) {
  if (examMode === 'practice' && answers[currentQ] !== undefined) return;
  
  answers[currentQ] = idx;
  skipped.delete(currentQ);

  if (examMode === 'practice') {
    renderQuestion();
  } else {
    document.querySelectorAll('.option').forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
    });
    updateQGrid(); 
    updateLiveScore();
    updateProgress();
  }
}

function prevQuestion() { 
  if (currentQ > 0) { 
    currentQ--; 
    renderQuestion(); 
  } 
}

function nextQuestion() {
  if (currentQ === questions.length - 1) {
    confirmEndExam();
  } else { 
    currentQ++; 
    renderQuestion(); 
  }
}

function skipQuestion() {
  if (answers[currentQ] === undefined) skipped.add(currentQ);
  if (currentQ < questions.length - 1) { 
    currentQ++; 
    renderQuestion(); 
  }
}

function jumpToQ(i) { 
  currentQ = i; 
  renderQuestion(); 
}

// ── 7. Tiến độ & Điểm số Realtime ─────────────────────────────

function updateLiveScore() {
  // Chỉ tính điểm ngầm để phục vụ nộp bài, không bắt buộc phải render ra giao diện nếu đã ẩn
  let correct = 0;
  Object.entries(answers).forEach(([i, a]) => { 
    const q = questions[i];
    if (q && getCorrectAnswer(q) === a) correct++; 
  });

  const liveScore = document.getElementById('live-score');
  if (liveScore) {
    liveScore.innerHTML = `${correct}/<span id="live-total">${questions.length}</span>`;
  }

  const livePct = document.getElementById('live-pct');
  if (livePct) {
    const pct = questions.length > 0 ? Math.round(correct / questions.length * 100) : 0;
    livePct.textContent = pct + '%';
  }
}

function updateProgress() {
  const progressFill = document.getElementById('progress-fill');
  if (progressFill && questions.length > 0) {
    const pct = Object.keys(answers).length / questions.length * 100;
    progressFill.style.width = Math.max(2, pct) + '%';
  }
}

// ── 8. Xử lý Nộp bài & Kết quả ────────────────────────────────

function confirmEndExam() {
  if (isSubmittingExam) return;

  const rem = questions.length - Object.keys(answers).length;
  if (rem > 0 && examMode === 'exam') {
    if (!confirm(`Bạn còn ${rem} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`)) return;
  } else {
    if (!confirm('Bạn có chắc chắn muốn nộp bài thi?')) return;
  }
  submitExam();
}

function submitExam() {
  if (isSubmittingExam) return;
  isSubmittingExam = true;

  clearInterval(timerInterval);
  
  const elapsed = examStartTime ? Math.floor((Date.now() - examStartTime) / 1000) : 0;
  let correct = 0, wrong = 0, criticalFail = false;

  questions.forEach((q, i) => {
    const correctAns = getCorrectAnswer(q);
    const userAns = answers[i];

    if (userAns === correctAns) {
      correct++;
    } else { 
      wrong++; 
      if (q.critical) {
        criticalFail = true; 
      }
    }
  });

  const passScore = currentLicense?.pass || Math.ceil(questions.length * 0.85);
  const passed = correct >= passScore && !criticalFail;

  let resultMsg = passed ? "🎉 CHÚC MỪNG: BẠN ĐÃ ĐẬU!" : "😔 RẤT TIẾC: BẠN CHƯA ĐẬU!";
  resultMsg += `\n- Kết quả: ${correct}/${questions.length} câu đúng`;
  if (criticalFail) resultMsg += "\n- Lỗi: Bạn đã làm sai hoặc bỏ trống câu điểm liệt!";
  alert(resultMsg);

  try {
    if (typeof Auth !== 'undefined' && Auth && typeof Auth.updateStats === 'function') {
      Auth.updateStats({ passed, correct, total: questions.length });
    }
  } catch (err) {
    console.warn("Lưu thống kê thất bại:", err);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const activeLicenseId = currentLicense?.id || urlParams.get('license') || 'A1';

  saveExamResultToSupabase(correct, questions.length, activeLicenseId, passed);

  showResult({ correct, wrong, elapsed, passed, criticalFail });
}

// ── 9. Màn hình Xem lại Kết quả ───────────────────────────────

function showResult({ correct, wrong, elapsed, passed, criticalFail }) {
  const examScreen   = document.getElementById('exam-screen');
  const resultScreen = document.getElementById('result-screen');

  if (examScreen)  examScreen.style.display   = 'none';
  if (resultScreen) resultScreen.style.display = 'block';

  const passScore = currentLicense?.pass || Math.ceil(questions.length * 0.85);

  const resIcon = document.getElementById('result-icon');
  if (resIcon) resIcon.textContent = passed ? '🎉' : '😔';

  const rt = document.getElementById('result-title');
  if (rt) {
    rt.textContent = passed ? 'Chúc mừng! Bạn đã đậu!' : 'Tiếc quá! Bạn chưa đậu';
    rt.className   = 'result-title ' + (passed ? 'pass' : 'fail');
  }

  const resSub = document.getElementById('result-sub');
  if (resSub) {
    resSub.textContent = passed
      ? `Tuyệt vời! Bạn vượt qua ${currentLicense?.title || 'bài thi'} với ${correct}/${questions.length} câu đúng.`
      : criticalFail ? 'Bạn đã làm sai hoặc bỏ trống câu điểm liệt. Hãy chú ý ôn luyện các câu hỏi an toàn quan trọng!'
      : `Cần đạt tối thiểu ${passScore}/${questions.length} câu để vượt qua bài thi này. Cố lên!`;
  }

  const rsCorrect = document.getElementById('rs-correct');
  if (rsCorrect) rsCorrect.textContent = correct;

  const rsWrong = document.getElementById('rs-wrong');
  if (rsWrong) rsWrong.textContent = wrong;

  const rsTime = document.getElementById('rs-time');
  if (rsTime) rsTime.textContent = fmtTime(elapsed);

  const rsScoreBig = document.getElementById('rs-score-big') || document.getElementById('rs-score-display');
  if (rsScoreBig) rsScoreBig.textContent = `${correct}/${questions.length}`;

  const rsPassStatus = document.getElementById('rs-pass-status');
  if (rsPassStatus) {
    rsPassStatus.innerHTML = passed
      ? `<span style="color:var(--success, #2e7d32);font-weight:600;">✅ ĐẬU (Yêu cầu: ${passScore}/${questions.length})</span>`
      : `<span style="color:var(--danger, #d32f2f);font-weight:600;">❌ TRƯỢT (Yêu cầu: ${passScore}/${questions.length})</span>`;
  }

  renderReview('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderReview(filter) {
  const keys = ['A', 'B', 'C', 'D'];
  
  const html = questions.map((q, i) => {
    const userAns    = answers[i];
    const correctAns = getCorrectAnswer(q);
    const ok         = userAns === correctAns;

    if (filter === 'wrong' && ok) return '';
    if (filter === 'correct' && !ok) return '';

    let rawText = q.text || q.question || '';
    let cleanText = rawText.replace(/^(Câu|Cau)\s*\d+([\s\.\:\-\/]+\d*)*/i, '').trim();

    let ansHtml = userAns === undefined
      ? `<div class="ri-ans yours">⚠️ Chưa trả lời</div>`
      : !ok
        ? `<div class="ri-ans yours">❌ Bạn chọn: ${keys[userAns]}. ${q.options[userAns]}</div>
           <div class="ri-ans correct">✅ Đáp án đúng: ${keys[correctAns]}. ${q.options[correctAns]}</div>`
        : `<div class="ri-ans correct">✅ Bạn chọn đúng: ${keys[userAns]}. ${q.options[userAns]}</div>`;

    return `<div class="review-item ri-${ok ? 'correct' : 'wrong'}">
      <div class="ri-head">
        <span class="badge badge-${ok ? 'success' : 'danger'}">${ok ? '✅ Đúng' : '❌ Sai'}</span>
        <span style="font-size:.85rem;font-weight:600;color:var(--text-muted, #666);">Câu ${i + 1}${q.critical ? ' ⚠️ Câu điểm liệt' : ''}</span>
      </div>
      <div class="ri-q" style="margin-top:6px;font-weight:500;">${cleanText}</div>
      ${ansHtml}
      ${!ok ? `<div class="ri-explain" style="margin-top:6px;font-size:.85rem;color:#555;">💡 ${q.explain || q.explanation || 'Không có giải thích.'}</div>` : ''}
    </div>`;
  }).join('');

  const reviewList = document.getElementById('review-list');
  if (reviewList) {
    reviewList.innerHTML = html || '<p style="text-align:center;padding:24px;color:var(--text-muted, #666)">Không có dữ liệu câu hỏi.</p>';
  }

  document.querySelectorAll('.review-filters .btn').forEach(b => {
    b.className = 'btn btn-sm ' + (b.dataset.filter === filter ? 'btn-primary' : 'btn-ghost');
  });
}