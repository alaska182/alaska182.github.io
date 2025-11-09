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

    // ... eventuale logica preesistente ...
  }

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

  // Parallel page condition: if user navigated via header, scroll hero up on load
  try {
    const links = Array.from(document.querySelectorAll('#primary-nav a'));
    links.forEach(a => {
      a.addEventListener('click', () => {
        sessionStorage.setItem('ntp_parallel_nav', '1');
      });
    });
    const shouldLift = sessionStorage.getItem('ntp_parallel_nav') === '1';
    if (shouldLift) {
      sessionStorage.removeItem('ntp_parallel_nav');
      const heroEl = document.querySelector('.hero, .hero--internal');
      if (heroEl) {
        const offset = heroEl.getBoundingClientRect().height || window.innerHeight;
        setTimeout(() => {
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }, 60);
        heroEl.classList.add('hero--lift');
        setTimeout(() => heroEl.classList.remove('hero--lift'), 1200);
      }
    }
  } catch(_) {}
});
