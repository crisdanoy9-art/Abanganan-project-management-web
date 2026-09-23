/* =========================================================
   ABANGANAN — animations.js
   Scroll reveal + the hero entrance animation (GSAP).
   Loaded on every page.
   ========================================================= */
(function () {
  'use strict';

  /* ---- fade-up on scroll ---- */
  let revealIO = null;
  function runReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    if (revealIO) revealIO.disconnect();

    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement ? entry.target.parentElement.children : []);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = Math.min(idx, 6) * 70 + 'ms';
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach((el) => revealIO.observe(el));
  }

  /* ---- hero entrance ---- */
  function heroEntrance() {
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.from('.nav', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });

    gsap.fromTo('.ph-img',
      { scale: 1.12, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' });

    const seq = [
      ['.ph-eyebrow', 0.10, 16, 0.50],
      ['.pill',       0.10, 16, 0.50],
      ['.ph-title',   0.20, 34, 0.80],
      ['.ph-sub',     0.32, 22, 0.62],
      ['.ph-tagline', 0.42, 20, 0.58],
      ['.ph-intro',   0.44, 20, 0.62]
    ];
    seq.forEach(function (s) {
      if (document.querySelector(s[0])) {
        gsap.from(s[0], { y: s[2], opacity: 0, duration: s[3], delay: s[1], ease: 'power3.out' });
      }
    });

    if (document.querySelector('.ph-divider')) {
      gsap.from('.ph-divider', { scaleX: 0, opacity: 0, duration: 0.65, delay: 0.56, ease: 'power3.out' });
    }
    if (document.querySelector('.hero-actions .btn')) {
      gsap.from('.hero-actions .btn', { y: 18, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.60, ease: 'power3.out' });
    }
    if (document.querySelector('.hero-stats .stat')) {
      gsap.from('.hero-stats .stat', { y: 18, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.68, ease: 'power3.out' });
    }
    if (document.querySelector('.ph-scroll')) {
      gsap.from('.ph-scroll', { opacity: 0, duration: 0.7, delay: 1.0, ease: 'power2.out' });
    }
  }

  function init() {
    runReveal();
    heroEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();