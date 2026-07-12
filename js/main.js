/* ============================================================
   SPECTRUM NEURO HEALTH — main.js
   Tabs · Accordion · Mobile Menu · Scroll Animations · Nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav shadow ────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ──────────────────────────────────────── */
  const mobileMenu   = document.querySelector('.mobile-menu');
  const mobileToggle = document.querySelector('.nav__mobile-btn');
  const mobileClose  = document.querySelector('.mobile-menu__close');

  function openMobile()  { if (mobileMenu) { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeMobile() { if (mobileMenu) { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; } }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
  if (mobileClose)  mobileClose.addEventListener('click', closeMobile);
  if (mobileMenu)   mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMobile(); });

  /* ── Tab switching ────────────────────────────────────── */
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const btns   = tabGroup.querySelectorAll('.tabs__btn');
    const panels = tabGroup.querySelectorAll('.tab-panel');

    function activateTab(index) {
      btns.forEach((b, i) => {
        b.classList.toggle('active', i === index);
        b.setAttribute('aria-selected', i === index);
      });
      panels.forEach((p, i) => {
        p.classList.toggle('active', i === index);
      });
    }

    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => activateTab(i));
    });

    // Initialise first tab if none active
    if (!tabGroup.querySelector('.tabs__btn.active') && btns.length) activateTab(0);
  });

  /* ── Accordion ────────────────────────────────────────── */
  document.querySelectorAll('.accord-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accord-item');
      const wasOpen = item.classList.contains('open');

      // Close siblings in same accord group
      const group = item.closest('.accord');
      if (group) group.querySelectorAll('.accord-item').forEach(i => i.classList.remove('open'));

      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Scroll-reveal animations ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.anim').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.anim').forEach(el => el.classList.add('visible'));
  }

  /* ── Service carousel ─────────────────────────────────── */
  document.querySelectorAll('.service-carousel').forEach(carousel => {
    const track    = carousel.querySelector('.service-carousel__track');
    const slides   = Array.from(track.children);
    const prevBtn  = carousel.querySelector('.service-carousel__arrow--prev');
    const nextBtn  = carousel.querySelector('.service-carousel__arrow--next');
    const dotsWrap = carousel.querySelector('.service-carousel__dots');
    let index = 0;
    let perView = 1;

    const maxPerView = parseInt(carousel.dataset.perView, 10) || 2;
    function getPerView() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 900) return Math.min(2, maxPerView);
      return maxPerView;
    }

    function maxIndex() { return Math.max(0, slides.length - perView); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'service-carousel__dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => { index = i; update(); });
        dotsWrap.appendChild(dot);
      }
    }

    function update() {
      index = Math.min(Math.max(index, 0), maxIndex());
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;

      const dots = dotsWrap.querySelectorAll('.service-carousel__dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === index));

      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === maxIndex();
    }

    prevBtn.addEventListener('click', () => { index--; update(); });
    nextBtn.addEventListener('click', () => { index++; update(); });

    window.addEventListener('resize', () => {
      const newPerView = getPerView();
      if (newPerView !== perView) { perView = newPerView; buildDots(); }
      update();
    });

    perView = getPerView();
    buildDots();
    update();
  });

  /* ── URL-hash tab activation ─────────────────────────── */
  const hash = window.location.hash.slice(1);
  if (hash) {
    const target = document.querySelector(`.tabs__btn[data-tab="${hash}"]`);
    if (target) {
      target.click();
      setTimeout(() => target.closest('.tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }

  /* ── Smooth anchor scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

});
