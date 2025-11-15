(function(){
  // Se il DOM non è ancora pronto, attendi
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  function init(){
    // Seleziona tutte le immagini potenzialmente in gallerie
    const thumbs = Array.from(document.querySelectorAll('.poster-gallery img, .gallery img'));
    if (!thumbs.length) return;

    // Crea overlay lightbox se non esiste (usa classi già presenti nel CSS)
    let overlay = document.querySelector('.lb-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lb-overlay';
      overlay.innerHTML = `
        <div class="lb-panel" role="dialog" aria-modal="true">
          <button class="lb-btn lb-prev" aria-label="Previous">&lt;</button>
          <img class="lb-image" alt="">
          <button class="lb-btn lb-next" aria-label="Next">&gt;</button>
          <button class="lb-close" aria-label="Close">✕</button>
          <div class="lb-caption" aria-hidden="false"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const imgEl = overlay.querySelector('.lb-image');
    const captionEl = overlay.querySelector('.lb-caption');
    const btnPrev = overlay.querySelector('.lb-prev');
    const btnNext = overlay.querySelector('.lb-next');
    const btnClose = overlay.querySelector('.lb-close');

    function fitImage(){
      if (!imgEl) return;
      const margin = window.innerWidth < 560 ? 16 : 48;
      imgEl.style.maxWidth = (window.innerWidth - margin) + 'px';
      imgEl.style.maxHeight = (window.innerHeight - margin) + 'px';
      imgEl.style.objectFit = 'contain';
    }

    // Prepara array di sorgenti (usa data-full se presente, altrimenti src)
    const items = thumbs.map(t => ({
      thumb: t,
      full: t.getAttribute('data-full') || t.src,
      alt: t.alt || ''
    }));

    let current = 0;

    // Apri lightbox su click miniatura
    thumbs.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openAt(i);
      });
      // supporto a tasti per accessibilità
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          openAt(i);
        }
      });
      // rendi focusable se non lo è
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
    });

    function openAt(index){
      current = index;
      show(current);
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // focus sul close per accessibilità
      btnClose.focus();
      fitImage();
      window.addEventListener('resize', fitImage);
      window.addEventListener('keydown', onKey);
    }

    function close(){
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', fitImage);
    }

    function show(idx){
      const item = items[idx];
      imgEl.src = item.full;
      imgEl.alt = item.alt;
      // caption suppressed (do not show description)
      // captionEl.textContent = '';
      // Gestione visibilità pulsanti (se pochi elementi)
      btnPrev.style.display = items.length > 1 ? '' : 'none';
      btnNext.style.display = items.length > 1 ? '' : 'none';
    }

    btnPrev.addEventListener('click', () => { current = (current - 1 + items.length) % items.length; show(current); });
    btnNext.addEventListener('click', () => { current = (current + 1) % items.length; show(current); });
    btnClose.addEventListener('click', close);

    // chiudi cliccando fuori immagine
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Aggiorna dimensioni immagine al resize se il lightbox è aperto
    window.addEventListener('resize', () => { if (overlay && overlay.classList.contains('is-open')) fitImage(); });

    function onKey(e){
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') btnPrev.click();
      if (e.key === 'ArrowRight') btnNext.click();
    }

  }
})();
