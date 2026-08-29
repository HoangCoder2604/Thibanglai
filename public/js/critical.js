// ============================================================
// CRITICAL QUESTIONS — Logic trang ôn điểm liệt (Full Bộ Theo Hạng)
// ============================================================

let activeFilter   = 'all';
let viewMode       = 'browse';
let critQuestions  = [];
let critCurrent    = 0;
let critAnswers    = {};

// ── INIT ──────────────────────────────────────────────────────
// ── INIT ──────────────────────────────────────────────────────
async function initCriticalPage() {
  const sb = window.supabaseClient || window.supabase;
  let user = null;

  // 1. Kiểm tra session từ Supabase
  if (sb && typeof sb.auth?.getUser === 'function') {
    try {
      const { data } = await sb.auth.getUser();
      if (data?.user) user = data.user;
    } catch (e) {}
  }

  // 2. Fallback sang Auth cục bộ nếu Supabase chưa có
  if (!user && typeof Auth !== 'undefined') {
    if (typeof Auth.currentUser === 'function') {
      user = Auth.currentUser();
    } else if (typeof Auth.checkLogin === 'function' && Auth.checkLogin()) {
      user = true; // Đã đăng nhập theo cơ chế cũ
    }
  }

  // 3. Nếu vẫn chưa có user, chuyển hướng về trang đăng nhập
  if (!user) {
    alert('Vui lòng đăng nhập để sử dụng tính năng ôn câu điểm liệt!');
    window.location.href = 'auth.html';
    return;
  }

  // Nếu đã đăng nhập thành công thì tiếp tục khởi tạo giao diện
  renderFilterButtons();
  if (viewMode === 'browse') {
    renderBrowse();
  } else {
    initQuiz();
  }
}

// ── FILTER ────────────────────────────────────────────────────
function renderFilterButtons() {
  // Đảm bảo lấy đầy đủ danh sách các hạng bằng từ LICENSES
  const licensesList = typeof LICENSES !== 'undefined' ? LICENSES : [
    { id: 'A1', vehicle: '🏍️' },
    { id: 'A2', vehicle: '🏍️' },
    { id: 'B1', vehicle: '🚗' },
    { id: 'B2', vehicle: '🚗' },
    { id: 'C',  vehicle: '🚛' },
    { id: 'D',  vehicle: '🚌' }
  ];

  const filters = ['all', ...licensesList.map(l => l.id)];
  const labels  = { all: '🌐 Tất cả bộ câu hỏi' };
  licensesList.forEach(l => { 
    labels[l.id] = (l.vehicle || '') + ' Hạng ' + l.id; 
  });

  const filterWrap = document.getElementById('filter-wrap');
  if (!filterWrap) return;

  filterWrap.innerHTML = filters.map(f =>
    `<button class="btn btn-sm ${f === activeFilter ? 'btn-danger' : 'btn-ghost'}"
      id="filter-${f}" onclick="setFilter('${f}')">${labels[f]}</button>`
  ).join('');
}

function setFilter(f) {
  activeFilter = f;
  
  // Cập nhật trạng thái Active của các nút lọc
  const allBtns = document.querySelectorAll('#filter-wrap .btn');
  allBtns.forEach(btn => {
    btn.className = 'btn btn-sm btn-ghost';
  });
  const currentBtn = document.getElementById('filter-' + f);
  if (currentBtn) currentBtn.className = 'btn btn-sm btn-danger';

  if (viewMode === 'browse') {
    renderBrowse();
  } else {
    initQuiz();
  }
}

// Lọc câu hỏi chuẩn xác theo Tag hạng bằng
function getFiltered() {
  if (typeof CRITICAL_QUESTIONS === 'undefined' || !Array.isArray(CRITICAL_QUESTIONS)) {
    return [];
  }

  if (activeFilter === 'all') {
    // Trả về toàn bộ danh sách câu hỏi điểm liệt
    return CRITICAL_QUESTIONS;
  }
  
  // Lọc chính xác các câu hỏi thuộc hạng bằng được chọn (ví dụ: A1, B2, C...)
  return CRITICAL_QUESTIONS.filter(q => 
    q.tags && Array.isArray(q.tags) && (q.tags.includes(activeFilter) || q.tags.includes('all'))
  );
}

// ── VIEW MODE ─────────────────────────────────────────────────
function setViewMode(mode) {
  viewMode = mode;
  
  const btnBrowse = document.getElementById('btn-mode-browse');
  const btnQuiz   = document.getElementById('btn-mode-quiz');
  const browseEl  = document.getElementById('browse-mode');
  const quizEl    = document.getElementById('quiz-mode');

  if (btnBrowse) btnBrowse.className = 'btn ' + (mode === 'browse' ? 'btn-primary' : 'btn-ghost');
  if (btnQuiz)   btnQuiz.className   = 'btn ' + (mode === 'quiz'   ? 'btn-primary' : 'btn-ghost');
  
  if (browseEl)  browseEl.style.display = mode === 'browse' ? '' : 'none';
  if (quizEl)    quizEl.style.display   = mode === 'quiz'   ? '' : 'none';

  if (mode === 'browse') {
    renderBrowse();
  } else {
    initQuiz();
  }
}

// ── BROWSE MODE (XEM & HỌC) ──────────────────────────────────
function renderBrowse() {
  const keys = ['A', 'B', 'C', 'D'];
  const list = getFiltered();
  const container = document.getElementById('critical-list');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
        <div>Không tìm thấy câu hỏi điểm liệt phù hợp cho hạng này.</div>
      </div>`;
    return;
  }

  container.innerHTML = list.map((q, i) => `
    <div class="card card-pad fade-in" style="border-left:4px solid var(--danger); margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <span class="badge badge-danger">⚠️ Điểm liệt</span>
        <span style="font-size:.78rem;color:var(--text-muted);">
          Câu ${i + 1}/${list.length} &nbsp;·&nbsp; Áp dụng hạng: <strong>${Array.isArray(q.tags) ? q.tags.join(', ') : 'Tất cả'}</strong>
        </span>
      </div>

      <div style="font-size:1rem;font-weight:500;margin-bottom:16px;line-height:1.65;">
        ${q.text}
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        ${q.options.map((opt, oi) => {
          const isCorrect = oi === q.correct;
          return `
            <div style="
              padding:10px 14px;border-radius:9px;
              border:1.5px solid ${isCorrect ? 'var(--success)' : 'var(--border)'};
              background:${isCorrect ? 'var(--success-light)' : 'var(--white)'};
              display:flex;gap:10px;align-items:flex-start;">
              <div style="
                width:24px;height:24px;min-width:24px;border-radius:6px;
                background:${isCorrect ? 'var(--success)' : 'var(--bg)'};
                color:${isCorrect ? 'white' : 'var(--text-muted)'};
                display:flex;align-items:center;justify-content:center;
                font-size:.75rem;font-weight:700;">
                ${keys[oi]}
              </div>
              <div style="font-size:.88rem;padding-top:2px;
                ${isCorrect ? 'color:var(--success);font-weight:600;' : ''}">
                ${opt}${isCorrect ? ' &nbsp;✓' : ''}
              </div>
            </div>`;
        }).join('')}
      </div>

      <div style="background:#FFF9E6;border:1.5px solid #F59E0B;border-radius:10px;
                  padding:12px 14px;font-size:.84rem;color:#92400E;line-height:1.6;">
        <strong>💡 Giải thích mẹo nhớ:</strong> ${q.explain || 'Không có giải thích.'}
      </div>
    </div>
  `).join('');
}

// ── QUIZ MODE (LUYỆN TẬP) ────────────────────────────────────
function initQuiz() {
  const filteredList = getFiltered();
  // Trộn ngẫu nhiên danh sách câu hỏi điểm liệt khi luyện tập
  critQuestions = [...filteredList].sort(() => Math.random() - 0.5);
  critCurrent   = 0;
  critAnswers   = {};

  if (critQuestions.length === 0) {
    const txtEl = document.getElementById('crit-q-text');
    if (txtEl) txtEl.textContent = 'Không có câu hỏi điểm liệt nào cho hạng này.';
    document.getElementById('crit-options').innerHTML = '';
    document.getElementById('crit-q-grid').innerHTML   = '';
    return;
  }

  buildCritGrid();
  renderCritQ();
}

function buildCritGrid() {
  const gridEl = document.getElementById('crit-q-grid');
  if (!gridEl) return;
  gridEl.innerHTML = critQuestions.map((_, i) =>
    `<div class="q-dot" id="cqdot-${i}" onclick="critJump(${i})">${i + 1}</div>`
  ).join('');
}

function updateCritGrid() {
  critQuestions.forEach((_, i) => {
    const dot = document.getElementById('cqdot-' + i);
    if (!dot) return;
    dot.className = 'q-dot';
    if (i === critCurrent) {
      dot.classList.add('current');
    } else if (critAnswers[i] !== undefined) {
      dot.classList.add(critAnswers[i] === critQuestions[i].correct ? 'correct' : 'wrong');
    }
  });
}

function renderCritQ() {
  const q    = critQuestions[critCurrent];
  const keys = ['A', 'B', 'C', 'D'];

  if (!q) return;

  document.getElementById('crit-q-num').textContent   = critCurrent + 1;
  document.getElementById('crit-q-total').textContent = critQuestions.length;
  document.getElementById('crit-q-text').textContent  = q.text;

  const revealed = critAnswers[critCurrent] !== undefined;
  const userAns  = critAnswers[critCurrent];

  document.getElementById('crit-options').innerHTML = q.options.map((opt, i) => {
    let cls = 'option';
    if (!revealed && userAns === i) cls += ' selected';
    if (revealed) {
      cls += i === q.correct ? ' correct' : (i === userAns ? ' wrong' : '');
      cls += ' disabled';
    }
    return `
      <div class="${cls}" onclick="critSelect(${i})">
        <div class="opt-key">${keys[i]}</div>
        <div class="opt-text">${opt}</div>
      </div>`;
  }).join('');

  // Hiển thị giải thích sau khi trả lời
  const explain = document.getElementById('crit-explain');
  if (explain) {
    if (revealed) {
      explain.innerHTML = `<strong>💡 Giải thích:</strong> ${q.explain || 'Không có giải thích.'}`;
      explain.classList.add('show');
    } else {
      explain.classList.remove('show');
    }
  }

  // Điểm số Live
  let correct = 0;
  Object.entries(critAnswers).forEach(([i, a]) => {
    if (critQuestions[i]?.correct === a) correct++;
  });
  const done = Object.keys(critAnswers).length;
  const scoreLive = document.getElementById('crit-score-live');
  if (scoreLive) {
    scoreLive.textContent = done > 0 ? `✅ ${correct}/${done} câu đúng` : '';
  }

  // Nút chuyển câu
  const btnPrev = document.getElementById('crit-prev');
  const btnNext = document.getElementById('crit-next');
  if (btnPrev) btnPrev.disabled = critCurrent === 0;
  if (btnNext) {
    btnNext.textContent = critCurrent === critQuestions.length - 1 ? '🏁 Xem kết quả' : 'Câu tiếp →';
  }

  updateCritGrid();
}

// ── TƯƠNG TÁC NGƯỜI DÙNG ────────────────────────────────────
function critSelect(idx) {
  if (critAnswers[critCurrent] !== undefined) return; 
  critAnswers[critCurrent] = idx;
  renderCritQ();
}

function critPrev() {
  if (critCurrent > 0) { 
    critCurrent--; 
    renderCritQ(); 
  }
}

function critNext() {
  if (critCurrent === critQuestions.length - 1) {
    showCritResult();
  } else {
    critCurrent++;
    renderCritQ();
  }
}

function critJump(i) {
  critCurrent = i;
  renderCritQ();
}

// ── HIỂN THỊ KẾT QUẢ ──────────────────────────────────────────
function showCritResult() {
  let correct = 0;
  Object.entries(critAnswers).forEach(([i, a]) => {
    if (critQuestions[i]?.correct === a) correct++;
  });
  const total = critQuestions.length;
  const pct   = Math.round((correct / total) * 100);

  let msg = '', type = '';
  if (pct === 100) {
    msg  = `🎉 Hoàn hảo! Đúng ${correct}/${total} câu (${pct}%). Bạn đã nắm chắc điểm liệt!`;
    type = 'success';
  } else if (pct >= 80) {
    msg  = `👍 Khá tốt! Đúng ${correct}/${total} câu (${pct}%). Hãy ôn lại các câu làm sai nhé!`;
    type = 'warning';
  } else {
    msg  = `📚 Đúng ${correct}/${total} câu (${pct}%). Bạn trượt câu điểm liệt rồi, cần ôn tập kỹ lại!`;
    type = 'error';
  }

  if (typeof Toast !== 'undefined' && Toast[type]) {
    Toast[type](msg);
  } else {
    alert(msg);
  }

  updateCritGrid();
}

// ── KÍCH HOẠT TỰ ĐỘNG KHI TẢI TRANG ────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCriticalPage);
} else {
  initCriticalPage();
}