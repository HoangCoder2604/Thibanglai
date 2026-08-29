// ============================================================
// UTILS & SUPABASE INITIALIZATION
// ============================================================
window.SUPABASE_URL = 'https://nynuskahszqiydqkgmca.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bnVza2Foc3pxaXlkcWtnbWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjkyMTYsImV4cCI6MjEwMzE0NTIxNn0.Bk3LwrtSwFapxDrdyg0z0mAyx9N0qQCcpViAzQWdu54';

// Khởi tạo Supabase Client an toàn v2 và gắn vào window
if (window.supabase && typeof window.supabase.createClient === 'function') {
  window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  window.supabase = window.supabaseClient; // Đồng bộ hóa toàn cục
}

function showScreen(name) {
  // Hỗ trợ cả 2 chuẩn định danh id màn hình trong ứng dụng
  let targetScreen = document.getElementById('screen-' + name) || document.getElementById(name + '-screen');
  if (!targetScreen) return;
  
  document.querySelectorAll('.screen, section[id$="-screen"]').forEach(s => s.classList.remove('active', 'show'));
  targetScreen.classList.add('active');
  targetScreen.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// HOME — RENDER LICENSE GRID
// ============================================================
function renderLicenseGrid() {
  const gridEl = document.getElementById('license-grid');
  if (!gridEl || typeof LICENSES === 'undefined') return;

  const diffLabels = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
  const diffClass  = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard' };

  gridEl.innerHTML = LICENSES.map(l => {
    const [dl, dc] = [diffLabels[l.difficulty] || 'Dễ', diffClass[l.difficulty] || 'diff-easy'];
    
    return `
      <div class="license-card ${l.cat}" onclick="selectLicense('${l.id}')">
        <div class="lc-header">
          <div class="lc-badge">${l.id}</div>
          <span class="lc-diff ${dc}">${dl}</span>
        </div>
        <div class="lc-title">${l.vehicle} ${l.title}</div>
        <div class="lc-desc">${l.desc}</div>
        <div class="lc-meta">
          <span>📝 ${l.questions} câu</span>
          <span>⏱ ${l.time} phút</span>
          <span>✅ Đậu: ${l.pass}/${l.questions}</span>
        </div>
        <button class="lc-btn" onclick="event.stopPropagation(); selectLicense('${l.id}');">Ôn tập ngay →</button>
      </div>
    `;
  }).join('');
}

// ============================================================
// SETUP & NAVIGATION
// ============================================================
function selectLicense(id) {
  const elTitle = document.getElementById('setup-title');
  if (!elTitle) {
    window.location.href = `exam.html?license=${id}`;
    return;
  }

  if (typeof LICENSES !== 'undefined') {
    window.currentLicense = LICENSES.find(l => l.id === id);
  }

  if (window.currentLicense) {
    const elDesc  = document.getElementById('setup-desc');
    const elNumQ  = document.getElementById('setup-num-q');
    const elTime  = document.getElementById('setup-time');
    const elPass  = document.getElementById('setup-pass');

    if (elTitle) elTitle.textContent = window.currentLicense.vehicle + ' ' + window.currentLicense.title;
    if (elDesc)  elDesc.textContent  = window.currentLicense.desc;
    if (elNumQ)  elNumQ.textContent  = window.currentLicense.questions;
    if (elTime)  elTime.textContent  = window.currentLicense.time;
    if (elPass)  elPass.textContent  = window.currentLicense.pass + '/' + window.currentLicense.questions;
  }

  if (typeof setMode === 'function') setMode('exam');
  showScreen('setup');
}

function setMode(mode) {
  window.examMode = mode;
  
  const modeExam = document.getElementById('mode-exam');
  const modePractice = document.getElementById('mode-practice');
  const modeDesc = document.getElementById('mode-desc');

  if (modeExam) modeExam.classList.toggle('active', mode === 'exam');
  if (modePractice) modePractice.classList.toggle('active', mode === 'practice');

  const descs = {
    exam:     'Thi thử: Giới hạn thời gian, không hiện đáp án ngay. Kết quả sau khi nộp bài.',
    practice: 'Luyện tập: Hiện đáp án và giải thích ngay sau khi chọn. Không giới hạn thời gian.'
  };

  if (modeDesc && descs[mode]) {
    modeDesc.textContent = descs[mode];
  }
}

// ============================================================
// INIT
// ============================================================
function init() {
  renderLicenseGrid();
  
  const hdrQuestions = document.getElementById('hdr-questions');
  if (hdrQuestions && typeof QUESTION_TEMPLATES !== 'undefined') {
    hdrQuestions.textContent = QUESTION_TEMPLATES.length + '+ câu hỏi';
  }
}

document.addEventListener('DOMContentLoaded', init);