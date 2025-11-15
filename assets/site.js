document.addEventListener('DOMContentLoaded', () => {
  // Calcola e imposta la variabile --vh per gestire correttamente le altezze full-viewport su mobile
  function updateVh() {
    // --vh rappresenta 1vh reale del viewport (in px)
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  updateVh();
  // Aggiorna su resize / orientation change / visualViewport resize (su alcuni browser)
  window.addEventListener('resize', updateVh, {passive:true});
  window.addEventListener('orientationchange', updateVh, {passive:true});
  if (window.visualViewport && window.visualViewport.addEventListener) {
    window.visualViewport.addEventListener('resize', updateVh);
  }

  const header = document.getElementById('page-header');
  const hero = document.querySelector('.hero--internal');
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');

  function syncScrolled(){
    if (!header || !hero) return;
    const heroHeight = hero.offsetHeight || 0;
    if (window.scrollY > heroHeight - 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  syncScrolled();
  window.addEventListener('scroll', syncScrolled, {passive:true});
  window.addEventListener('resize', syncScrolled);

  if (btn) {
    function toggleMenu(force){
      const willOpen = typeof force === 'boolean' ? force : !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    }
    btn.addEventListener('click', () => toggleMenu());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
    if (nav) nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') toggleMenu(false); });
  }

  // Function to toggle mobile menu
  function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('menu-open');
  }

  // Event listener for hamburger menu
  document.querySelector('.hamburger').addEventListener('click', toggleMenu);
});

// NOTE: lightbox functionality removed from this file to avoid duplicate overlays.
// The gallery/lightbox is handled centrally in assets/gallery.js.
