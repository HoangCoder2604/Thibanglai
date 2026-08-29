// ============================================================
// DASHBOARD LOGIC — Tích hợp quản lý học viên, thống kê & đăng xuất
// ============================================================

const Dashboard = (() => {
  let isInitialized = false;

  async function init() {
    if (isInitialized) {
      console.warn("⚠️ Dashboard.init() đã được gọi trước đó, bỏ qua lần gọi trùng lặp.");
      return;
    }
    isInitialized = true;

    const sb = window.supabaseClient || window.supabase;
    let user = null;
    let userId = null;

    if (sb) {
      try {
        const { data: authData } = await sb.auth.getUser();
        if (authData?.user) {
          user = authData.user;
          userId = user.id;
        }
      } catch (e) {
        console.warn("Không lấy được user từ Supabase auth:", e);
      }
    }

    if (!user && typeof Auth !== 'undefined' && typeof Auth.currentUser === 'function') {
      try {
        user = Auth.currentUser();
      } catch (e) {}
    }

    if (!user) {
      renderGuestState();
      return;
    }

    renderUserInfo(user);

    if (sb && userId) {
      await loadSupabaseExamStats(sb, userId);
    } else if (user.stats) {
      renderUserStats(user.stats);
    }
  }

  async function loadSupabaseExamStats(sb, userId) {
    const { data: results, error } = await sb
      .from('exam_results')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Lỗi tải thống kê từ Supabase:", error.message);
      return;
    }

    if (!results || results.length === 0) {
      renderUserStats({ exams: 0, passed: 0, failed: 0, rate: 0, totalCorrect: 0, accuracy: 0 });
      return;
    }

    const totalExams = results.length;
    const passedExams = results.filter(r => r.is_passed).length;
    const failedExams = totalExams - passedExams;
    const passRate = Math.round((passedExams / totalExams) * 100);

    let totalCorrect = 0;
    let totalQuestionsSum = 0;

    results.forEach(r => {
      totalCorrect += Number(r.score || 0);
      totalQuestionsSum += Number(r.total_questions || 0);
    });

    const accuracy = totalQuestionsSum > 0 ? Math.round((totalCorrect / totalQuestionsSum) * 100) : 0;

    renderUserStats({
      exams: totalExams,
      passed: passedExams,
      failed: failedExams,
      rate: passRate,
      totalCorrect: totalCorrect,
      accuracy: accuracy
    });
  }

  function renderUserInfo(user) {
    const nameEl = document.getElementById('dash-user-name');
    const emailEl = document.getElementById('dash-user-email');

    const displayName = user.user_metadata?.full_name || user.name || user.email?.split('@')[0] || 'Học viên';
    const displayEmail = user.email || user.user_metadata?.email || '';

    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = displayEmail;
  }

  function renderUserStats(stats) {
    const exams = stats?.exams || stats?.totalExams || 0;
    const passed = stats?.passed || stats?.passedExams || 0;
    const failed = stats?.failed || stats?.failedExams || (exams - passed);
    const rate = stats?.rate !== undefined ? stats.rate : (exams > 0 ? Math.round((passed / exams) * 100) : 0);
    const totalCorrect = stats?.totalCorrect || 0;
    const accuracy = stats?.accuracy || 0;

    const elExams = document.getElementById('stat-exams');
    const elPassed = document.getElementById('stat-passed');
    const elFailed = document.getElementById('stat-failed');
    const elRate = document.getElementById('stat-rate');
    const elCorrect = document.getElementById('stat-correct');
    const elAccuracy = document.getElementById('stat-accuracy');

    if (elExams) elExams.textContent = exams;
    if (elPassed) elPassed.textContent = passed;
    if (elFailed) elFailed.textContent = failed;
    if (elRate) elRate.textContent = rate + '%';
    if (elCorrect) elCorrect.textContent = totalCorrect;
    if (elAccuracy) elAccuracy.textContent = accuracy + '%';
  }

  function renderGuestState() {
    const nameEl = document.getElementById('dash-user-name');
    const emailEl = document.getElementById('dash-user-email');
    if (nameEl) nameEl.textContent = 'Khách (Chưa đăng nhập)';
    if (emailEl) emailEl.textContent = 'Vui lòng đăng nhập để xem thống kê';
    
    renderUserStats({ exams: 0, passed: 0, failed: 0, rate: 0, totalCorrect: 0, accuracy: 0 });
  }

  // **Bổ sung tính năng đăng xuất trực tiếp vào module Dashboard**
  async function logout() {
    const sb = window.supabaseClient || window.supabase;
    if (sb) {
      try {
        await sb.auth.signOut();
      } catch (e) {
        console.error("Lỗi khi đăng xuất Supabase:", e);
      }
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'auth.html';
  }

  return { init, logout };
})();

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});