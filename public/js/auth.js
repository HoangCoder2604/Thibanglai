const SUPABASE_URL = 'https://nynuskahszqiydqkgmca.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bnVza2Foc3pxaXlkcWtnbWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjkyMTYsImV4cCI6MjEwMzE0NTIxNn0.Bk3LwrtSwFapxDrdyg0z0mAyx9N0qQCcpViAzQWdu54';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const Auth = (() => {
  const SESSION_KEY = 'tbl_session';

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    supabaseClient.auth.signOut();
  }

  // 1. Đăng ký tài khoản (Yêu cầu xác thực email)
  async function register({ name, email, password }) {
    try {
      // Lấy URL hiện tại để khi người dùng bấm vào link xác nhận trong email sẽ quay về đúng trang
      const redirectTo = window.location.origin + '/auth.html'; 

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { name, stats: { exams: 0, passed: 0, totalCorrect: 0, totalQ: 0 } }
        }
      });

      if (error) return { ok: false, msg: error.message };

      const user = data.user;
      if (!user) return { ok: false, msg: 'Không thể tạo tài khoản!' };

      // Nếu Supabase yêu cầu xác thực email, user.identities có thể trống hoặc session là null
      if (!data.session) {
        return { 
          ok: true, 
          needsVerification: true, 
          msg: 'Đăng ký thành công! Vui lòng kiểm tra hộp thư email của bạn để xác thực tài khoản trước khi đăng nhập.' 
        };
      }

      const safeUser = {
        id: user.id,
        name: name || 'Học viên',
        email: user.email,
        created_at: user.created_at,
        stats: { exams: 0, passed: 0, totalCorrect: 0, totalQ: 0 }
      };

      saveSession(safeUser);
      return { ok: true, user: safeUser };
    } catch (err) {
      return { ok: false, msg: 'Lỗi kết nối máy chủ!' };
    }
  }

  // 2. Đăng nhập (Kiểm tra xem mail đã được xác thực chưa)
  async function login({ email, password }) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          return { ok: false, msg: 'Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư!' };
        }
        return { ok: false, msg: 'Email hoặc mật khẩu không chính xác!' };
      }

      const user = data.user;
      const metadata = user.user_metadata || {};

      const safeUser = {
        id: user.id,
        name: metadata.name || metadata.full_name || 'Học viên',
        email: user.email,
        created_at: user.created_at,
        user_metadata: metadata,
        stats: metadata.stats || { exams: 0, passed: 0, totalCorrect: 0, totalQ: 0 }
      };

      saveSession(safeUser);
      return { ok: true, user: safeUser };
    } catch (err) {
      return { ok: false, msg: 'Lỗi kết nối máy chủ!' };
    }
  }

  // 3. Quên mật khẩu (Gửi yêu cầu reset về email)
  async function forgotPassword(email) {
    try {
      const redirectTo = window.location.origin + '/auth.html?reset=true';
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) return { ok: false, msg: error.message };
      return { ok: true, msg: 'Đã gửi liên kết đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra hộp thư!' };
    } catch (err) {
      return { ok: false, msg: 'Lỗi kết nối máy chủ!' };
    }
  }

  // 4. Cập nhật mật khẩu mới (Dùng khi người dùng bấm từ link trong email quên mật khẩu)
  async function updatePassword(newPassword) {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (error) return { ok: false, msg: error.message };
      return { ok: true, msg: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
    } catch (err) {
      return { ok: false, msg: 'Lỗi kết nối máy chủ!' };
    }
  }

  async function updateProfile({ name, full_name }) {
    try {
      const displayName = name || full_name;
      const { data, error } = await supabaseClient.auth.updateUser({
        data: { name: displayName, full_name: displayName }
      });

      if (error) return { ok: false, error };

      const session = getSession();
      if (session) {
        session.name = displayName;
        if (session.user_metadata) session.user_metadata.full_name = displayName;
        saveSession(session);
      }

      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  async function requireAuth() {
    const session = getSession();
    if (!session) {
      window.location.href = 'auth.html';
      return false;
    }
    return true;
  }

  function logout() {
    clearSession();
    window.location.href = 'auth.html';
  }

  function currentUser() {
    return getSession();
  }

  function renderHeaderUser() {
    const user = getSession();
    const container = document.getElementById('header-user-info');
    if (!container) return;

    if (user) {
      container.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-weight:600; color:var(--text, #333);">👤 ${user.name || user.email}</span>
          <button class="btn btn-outline btn-sm" onclick="Auth.logout()" style="cursor:pointer;">Đăng xuất</button>
        </div>
      `;
    } else {
      container.innerHTML = `<a href="auth.html" class="btn btn-primary btn-sm">Đăng nhập</a>`;
    }
  }

  return {
    register,
    login,
    forgotPassword,
    updatePassword,
    logout,
    currentUser,
    requireAuth,
    updateProfile,
    renderHeaderUser
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  Auth.renderHeaderUser();
});