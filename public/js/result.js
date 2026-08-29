// ============================================================
// HIỂN THỊ MÀN HÌNH KẾT QUẢ VÀ LƯU VÀO SUPABASE (DASHBOARD) - ĐÃ FIX LẤY ĐÚNG LICENSE ID
// ============================================================
async function showResult({ correct, wrong, elapsed, passed, criticalFail }) {
  // 1. Icon & title
  const resultIcon = document.getElementById('result-icon');
  if (resultIcon) resultIcon.textContent = passed ? '🎉' : '😔';

  const rt = document.getElementById('result-title');
  if (rt) {
    rt.textContent = passed ? 'Chúc mừng! Bạn đã đậu!' : 'Tiếc quá! Bạn chưa đậu';
    rt.className   = 'result-title ' + (passed ? 'pass' : 'fail');
  }
  
  const resultSub = document.getElementById('result-sub');
  if (resultSub) {
    resultSub.textContent = passed
      ? `Tuyệt vời! Bạn đã vượt qua bài thi ${currentLicense?.title || ''} với ${correct}/${questions.length} câu đúng.`
      : criticalFail
        ? 'Bạn đã trả lời sai câu điểm liệt. Hãy ôn luyện kỹ hơn về các quy định an toàn!'
        : `Bạn cần đúng tối thiểu ${currentLicense?.pass || 21} câu để đậu. Cố lên!`;
  }
 
  // 2. Stats
  const rsCorrect = document.getElementById('rs-correct');
  if (rsCorrect) rsCorrect.textContent = correct;

  const rsWrong = document.getElementById('rs-wrong');
  if (rsWrong) rsWrong.textContent = wrong;

  const em = Math.floor(elapsed / 60);
  const es = (elapsed % 60).toString().padStart(2, '0');
  const rsTime = document.getElementById('rs-time');
  if (rsTime) rsTime.textContent = em + ':' + es;
 
  // 3. Score display
  const scoreDisplay = document.getElementById('rs-score-display') || document.getElementById('rs-score-big');
  if (scoreDisplay) {
    scoreDisplay.textContent = correct + '/' + questions.length;
  }

  const passEl = document.getElementById('rs-pass-status');
  if (passEl) {
    const passReq = currentLicense?.pass || 21;
    passEl.innerHTML = passed
      ? `<span style="color:var(--success);font-weight:600;">✅ ĐẬU (cần ${passReq}/${questions.length})</span>`
      : `<span style="color:var(--danger);font-weight:600;">❌ TRƯỢT (cần ${passReq}/${questions.length})</span>`;
  }
 
  // 4. Lưu kết quả thi lên Supabase
  await saveExamResultToDatabase(correct, questions.length, passed);

  renderReview('all');
  if (typeof showScreen === 'function') {
    showScreen('result');
  } else {
    const examScreen = document.getElementById('exam-screen');
    const resultScreen = document.getElementById('result-screen');
    if (examScreen) examScreen.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'block';
  }
}

// Hàm phụ trợ thực hiện gửi dữ liệu lên bảng exam_results (Đồng bộ chuẩn license_id thực tế)
async function saveExamResultToDatabase(correctCount, totalCount, isPassed) {
  try {
    const sb = window.supabaseClient || window.supabase;
    if (!sb || typeof sb.from !== 'function') {
      console.warn("Chưa cấu hình Supabase Client hoặc thiếu hàm from.");
      return;
    }

    let userId = null;
    let userEmail = null;

    if (typeof sb.auth?.getUser === 'function') {
      try {
        const { data: authData } = await sb.auth.getUser();
        if (authData?.user) {
          userId = authData.user.id;
          userEmail = authData.user.email;
        }
      } catch (err) {
        console.warn("Không thể lấy user từ sb.auth.getUser():", err.message);
      }
    }

    if (!userId && typeof sb.auth?.getSession === 'function') {
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (session && session.user) {
          userId = session.user.id;
          userEmail = userEmail || session.user.email;
        }
      } catch (err) {
        console.warn("Không thể lấy session từ Supabase:", err.message);
      }
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
      console.log("Người dùng chưa đăng nhập, bỏ qua lưu thống kê lên Dashboard.");
      return;
    }

    // Lấy chính xác mã license hiện tại (A1, A2,...) từ window.currentLicense hoặc URL param
    const urlParams = new URLSearchParams(window.location.search);
    const licenseId = window.currentLicense?.id || urlParams.get('license') || 'A1';

    const { data, error } = await sb
      
      .insert([
        {
          user_id: userId,
          user_email: userEmail || 'unknown@domain.com',
          license_id: String(licenseId),
          score: Number(correctCount),
          total_questions: Number(totalCount),
          is_passed: Boolean(isPassed),
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("Lỗi Supabase khi lưu kết quả thi:", error.message);
    } else {
      console.log("Đã lưu kết quả thi thành công cho hạng:", licenseId, data);
    }
  } catch (err) {
    console.error("Lỗi ngoại lệ khi lưu kết quả thi:", err);
  }
}
 
// ============================================================
// RENDER REVIEW LIST
// ============================================================
function renderReview(filter) {
  const keys = ['A', 'B', 'C', 'D'];
  const list = document.getElementById('review-list');
  if (!list) return;
 
  const html = questions.map((q, i) => {
    const userAns   = answers[i];
    const correctAns = typeof getCorrectAnswer === 'function' ? getCorrectAnswer(q) : (q.correct !== undefined ? q.correct : 0);
    const isCorrect = userAns === correctAns;
 
    if (filter === 'wrong'   &&  isCorrect) return '';
    if (filter === 'correct' && !isCorrect) return '';
 
    let ansHtml = '';
    if (userAns === undefined) {
      ansHtml = `<div class="ri-answer yours">⚠️ Bỏ qua / Chưa trả lời</div>`;
    } else if (!isCorrect) {
      ansHtml = `
        <div class="ri-answer yours">❌ Bạn chọn: ${keys[userAns]}. ${q.options[userAns]}</div>
        <div class="ri-answer correct-ans">✅ Đáp án đúng: ${keys[correctAns]}. ${q.options[correctAns]}</div>`;
    } else {
      ansHtml = `<div class="ri-answer correct-ans">✅ ${keys[userAns]}. ${q.options[userAns]}</div>`;
    }
 
    const explainHtml = !isCorrect
      ? `<div style="margin-top:8px;font-size:0.82rem;color:var(--text-muted);background:var(--bg);padding:8px 10px;border-radius:8px;line-height:1.5;">💡 ${q.explain || q.explanation || 'Không có giải thích.'}</div>`
      : '';
 
    let rawText = q.text || q.question || '';
    let cleanText = rawText.replace(/^(Câu|Cau)\s*\d+([\s\.\:\-\/]+\d*)*/i, '').trim();

    return `
      <div class="review-item ri-${isCorrect ? 'correct' : 'wrong'}">
        <div class="ri-header">
          <span class="ri-badge ${isCorrect ? 'correct' : 'wrong'}">${isCorrect ? '✅ Đúng' : '❌ Sai'}</span>
          <span class="ri-qnum">Câu ${i + 1}${q.critical ? ' ⚠️ Điểm liệt' : ''}</span>
        </div>
        <div class="ri-question">${cleanText}</div>
        ${ansHtml}
        ${explainHtml}
      </div>`;
  }).join('');
 
  list.innerHTML = html ||
    '<p style="text-align:center;color:var(--text-muted);padding:24px;">Không có câu nào trong mục này.</p>';
 
  ['all', 'wrong', 'correct'].forEach(f => {
    const el = document.getElementById('rf-' + f);
    if (!el) return;
    el.className = 'btn ' + (f === filter ? 'btn-primary' : 'btn-ghost');
    el.style.fontSize = '0.82rem';
    el.style.padding  = '6px 14px';
  });
}
 
function filterReview(filter) {
  renderReview(filter);
}