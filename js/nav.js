(function () {
  function initNav() {
    var isLoggedIn = localStorage.getItem('hal_cinema_logged_in') === 'true';
    var mypageLinks = document.querySelectorAll('.nav__mypage-link');
    var loginBtns = document.querySelectorAll('.nav__login-btn');
    var logoutBtns = document.querySelectorAll('.nav__logout-btn');

    mypageLinks.forEach(function (el) {
      el.style.display = isLoggedIn ? '' : 'none';
    });
    loginBtns.forEach(function (el) {
      el.style.display = isLoggedIn ? 'none' : '';
    });
    logoutBtns.forEach(function (el) {
      el.style.display = isLoggedIn ? '' : 'none';
      el.addEventListener('click', function () {
        localStorage.removeItem('hal_cinema_logged_in');
        localStorage.removeItem('hal_cinema_user');
        window.location.href = 'index.html';
      });
    });

    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      if (a.getAttribute('href') === page) {
        a.style.color = 'var(--gold-500)';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
