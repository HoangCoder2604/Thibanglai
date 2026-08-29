// ============================================================
// UI HELPERS
// ============================================================

// Toast notifications
const Toast = (() => {
  let wrap = null;
  function getWrap() {
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    return wrap;
  }
  function show(msg, type = '', duration = 3000) {
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    getWrap().appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; t.style.transition = 'all .3s'; setTimeout(() => t.remove(), 300); }, duration);
  }
  return { success: m => show(m, 'success'), error: m => show(m, 'error'), warning: m => show(m, 'warning'), info: m => show(m, '') };
})();

// Modal
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Render navbar user area
function renderNavUser() {
  const user = Auth.currentUser();
  const el = document.getElementById('nav-user-area');
  if (!el) return;
  if (user) {
    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    el.innerHTML = `
      <div class="nav-dropdown">
        <div class="nav-avatar" title="${user.name}">${initials}</div>
        <div class="nav-dropdown-menu">
          <div class="nav-dropdown-item" onclick="window.location.href='dashboard.html'">👤 Hồ sơ của tôi</div>
          <div class="nav-dropdown-item" onclick="window.location.href='critical.html'">⚠️ Câu điểm liệt</div>
          <hr style="border:none;border-top:1px solid var(--border);margin:4px 0;">
          <div class="nav-dropdown-item danger" onclick="Auth.logout()">🚪 Đăng xuất</div>
        </div>
      </div>`;
  } else {
    el.innerHTML = `<a href="auth.html" class="btn btn-primary btn-sm">Đăng nhập</a>`;
  }
}

// Difficulty label
function diffLabel(d) {
  const map = { easy: ['Dễ','diff-easy'], medium: ['Trung bình','diff-medium'], hard: ['Khó','diff-hard'] };
  return map[d] || ['',''];
}

// Format time mm:ss
function fmtTime(sec) {
  return `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;
}

// Shared navbar HTML (injected per page)
function injectNavbar(activePage) {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="navbar-inner">
      <a class="nav-logo" href="index.html">
        <div class="nav-logo-icon">🚗</div>
        <span>ThiBangLai.vn</span>
      </a>
      <div class="nav-links">
        <a href="index.html"     class="nav-link ${activePage==='home'?'active':''}">🏠 Trang chủ</a>
        <a href="critical.html"  class="nav-link ${activePage==='critical'?'active':''}">⚠️ Điểm liệt</a>
        <a href="dashboard.html" class="nav-link ${activePage==='dashboard'?'active':''}">📊 Của tôi</a>
      </div>
      <div class="nav-user" id="nav-user-area"></div>
    </div>`;
  renderNavUser();
}