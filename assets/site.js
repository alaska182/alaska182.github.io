document.addEventListener('DOMContentLoaded', () => {
  // Calcola e imposta la variabile --vh per gestire correttamente le altezze full-viewport su mobile
  function updateVh() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  updateVh();
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

  // Hamburger menu toggle
  if (btn) {
    function toggleMenu(force){
      const willOpen = typeof force === 'boolean' ? force : !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
    if (nav) nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') toggleMenu(false); });
  }
});
