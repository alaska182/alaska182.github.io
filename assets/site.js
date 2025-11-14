document.addEventListener('DOMContentLoaded', () => {
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
});

/* LIGHTBOX: apri le immagini della .gallery alla dimensione originale */
(function(){
  let overlay, imgEl, captionEl, prevBtn, nextBtn, closeBtn;
  let currentGallery = null;
  let images = [];
  let currentIndex = -1;

  function buildLightbox(){
    overlay = document.createElement('div'); overlay.className = 'lb-overlay'; overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = `
      <div class="lb-panel" role="dialog" aria-modal="true">
        <button class="lb-btn lb-prev" aria-label="Immagine precedente">&#x2039;</button>
        <img class="lb-image" src="" alt="">
        <button class="lb-btn lb-next" aria-label="Immagine successiva">&#x203A;</button>
        <button class="lb-close" aria-label="Chiudi">×</button>
      </div>
      <div class="lb-caption" aria-live="polite"></div>
    `;
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector('.lb-image');
    captionEl = overlay.querySelector('.lb-caption');
    prevBtn = overlay.querySelector('.lb-prev');
    nextBtn = overlay.querySelector('.lb-next');
    closeBtn = overlay.querySelector('.lb-close');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', onKey);
  }

  function onKey(e){
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  }

  function openLightbox(list, idx){
    images = list;
    currentIndex = idx;
    const src = images[idx].dataset.full || images[idx].src;
    const alt = images[idx].alt || '';
    imgEl.src = src;
    imgEl.alt = alt;
    captionEl.textContent = alt;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    imgEl.src = '';
    currentIndex = -1;
    document.body.classList.remove('no-scroll');
  }

  function showPrev(){
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(images, currentIndex);
  }
  function showNext(){
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(images, currentIndex);
  }

  function attachGalleryListeners(){
    document.querySelectorAll('.gallery').forEach(g => {
      const thumbs = Array.from(g.querySelectorAll('img'));
      thumbs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.setAttribute('tabindex', '0');
        img.addEventListener('click', (e) => {
          openLightbox(thumbs, i);
        });
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(thumbs, i); }
        });
      });
    });
  }

  // init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { buildLightbox(); attachGalleryListeners(); });
  } else {
    buildLightbox(); attachGalleryListeners();
  }
})();
