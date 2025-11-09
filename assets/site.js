// /assets/sit.js
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('page-header');
  const hero = document.querySelector('.hero--internal');
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');

  const BP = 800; // breakpoint mobile

  function isMobile() {
    return window.innerWidth <= BP;
  }

  function syncScrolled() {
    if (!header || !hero) return;

    const heroHeight = hero.offsetHeight || 0;

    // Stato mobile: niente header bianco, hamburger sempre su sfondo trasparente
    if (isMobile()) {
      document.body.classList.add('is-mobile');
      header.classList.remove('scrolled');
      return;
    }

    // Stato desktop: header bianco dopo l'hero
    document.body.classList.remove('is-mobile');
    if (window.scrollY > heroHeight - 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  // Init + listeners
  syncScrolled();
  window.addEventListener('scroll', syncScrolled, { passive: true });
  window.addEventListener('resize', syncScrolled);

  // Drawer mobile
  if (btn) {
    function toggleMenu(force) {
      const willOpen = typeof force === 'boolean'
        ? force
        : !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    }
    btn.addEventListener('click', () => toggleMenu());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
    if (nav) nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') toggleMenu(false); });
  }
});
