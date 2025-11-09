document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('page-header');
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');

  const BP = 800;

  // Funzione apertura/chiusura menu
  function toggleMenu(force) {
    const willOpen = typeof force === 'boolean'
      ? force
      : !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
  }

  // Attiva hamburger e chiusura con X
  if (btn) {
    btn.addEventListener('click', () => toggleMenu());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  // Chiude il menu al click su un link
  if (nav) {
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') toggleMenu(false);
    });
  }

  // === HERO PARALLEL PAGE CONDITION (revised) ===
try {
  const headerLinks = document.querySelectorAll('#primary-nav a');

  // Salva stato quando l’utente clicca un link del menu
  headerLinks.forEach(link => {
    link.addEventListener('click', () => {
      sessionStorage.setItem('ntp_parallel_nav', '1');
    });
  });

  // Se arriviamo da un click, anima l’hero
  if (sessionStorage.getItem('ntp_parallel_nav') === '1') {
    sessionStorage.removeItem('ntp_parallel_nav');

    window.addEventListener('load', () => {
      const heroEl = document.querySelector('.hero, .hero--internal');
      if (!heroEl) return;

      // Altezza dell’hero
      const offset = heroEl.offsetHeight;
      // Aggiunge classe per animazione e scrolla
      heroEl.classList.add('hero--lift');
      setTimeout(() => {
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }, 150);
      setTimeout(() => {
        heroEl.classList.remove('hero--lift');
      }, 1200);
    });
  }
} catch (err) {
  console.error('Parallel page animation error:', err);
}
