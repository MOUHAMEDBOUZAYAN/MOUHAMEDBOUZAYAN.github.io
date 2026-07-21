(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = window.scrollY;
  let ticking = false;
  const threshold = 6;
  const topOffset = 20;

  function showNavbar() {
    navbar.classList.remove('is-away');
    navbar.style.transform = '';
  }

  function hideNavbar() {
    navbar.classList.add('is-away');
    navbar.style.transform = 'translateY(-100%)';
  }

  function updateNavbar() {
    const y = window.scrollY;
    const delta = y - lastY;

    if (document.body.classList.contains('menu-open')) {
      lastY = y;
      ticking = false;
      return;
    }

    if (y <= topOffset) {
      showNavbar();
      navbar.classList.remove('is-scrolled');
    } else {
      navbar.classList.add('is-scrolled');
      if (delta > threshold) hideNavbar();
      else if (delta < -threshold) showNavbar();
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  updateNavbar();
})();
