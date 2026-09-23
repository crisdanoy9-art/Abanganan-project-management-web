/* =========================================================
   ABANGANAN — wbs.js
   Desktop/tablet: the 8-branch chart auto-shrinks (CSS scale)
   to fit the available width, so it never needs a sideways
   scroll. Mobile (<=1000px): stacked accordion, always full
   size, no scaling.
   ========================================================= */
(function () {
  'use strict';

  function isStacked() { return window.innerWidth <= 1000; }

  /* ---- shrink the chart to fit, instead of letting it overflow ---- */
  function fitWBS() {
    const scroller = document.querySelector('.wbs-scroll');
    const chart = document.querySelector('.wbs-chart');
    if (!scroller || !chart) return;

    if (isStacked()) {
      chart.style.transform = '';
      scroller.style.height = '';
      return;
    }

    /* reset first so we measure the true, unscaled size */
    chart.style.transform = 'none';

    const cs = getComputedStyle(scroller);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const availW = scroller.clientWidth - padL - padR;
    const naturalW = chart.offsetWidth;
    const naturalH = chart.offsetHeight;

    let scale = naturalW ? availW / naturalW : 1;
    if (!isFinite(scale) || scale <= 0) scale = 1;
    if (scale > 1) scale = 1;

    chart.style.transform = 'scale(' + scale + ')';
    /* the layout box keeps its full unscaled height — pin the
       wrapper to the scaled height so there's no leftover gap */
    scroller.style.height = Math.ceil(naturalH * scale) + 'px';
  }

  /* ---- slow top-to-bottom cascade: root -> trunk/spine -> each
     column's head, then its tasks trickling down one by one,
     columns overlapping slightly left to right ---- */
  function animateWBSReveal() {
    if (typeof gsap === 'undefined') return;

    const wrap = document.querySelector('.wbs-wrap');
    const root = document.querySelector('.wbs-root');
    const trunk = document.querySelector('.wbs-trunk');
    const spine = document.querySelector('.wbs-spine');
    const cols = Array.from(document.querySelectorAll('.wbs-col'));
    if (!wrap || !cols.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const heads = [];
    const subGroups = [];
    cols.forEach((col) => {
      heads.push(col.querySelector('.wbs-col-head'));
      subGroups.push(Array.from(col.querySelectorAll('.wbs-sub')));
    });

    if (reduceMotion) {
      /* skip straight to the finished state, no animation */
      if (root) gsap.set(root, { opacity: 1, y: 0 });
      if (trunk) gsap.set(trunk, { scaleY: 1 });
      if (spine) gsap.set(spine, { scaleX: 1 });
      heads.forEach((h) => h && gsap.set(h, { opacity: 1, y: 0 }));
      subGroups.forEach((subs) => gsap.set(subs, { opacity: 1, y: 0 }));
      return;
    }

    /* starting state */
    if (root) gsap.set(root, { opacity: 0, y: 26 });
    if (trunk) gsap.set(trunk, { scaleY: 0, transformOrigin: 'top center' });
    if (spine) gsap.set(spine, { scaleX: 0, transformOrigin: 'left center' });
    heads.forEach((h) => h && gsap.set(h, { opacity: 0, y: 22 }));
    subGroups.forEach((subs) => gsap.set(subs, { opacity: 0, y: 18 }));

    function run() {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (root) tl.to(root, { opacity: 1, y: 0, duration: 0.65 });
      if (trunk) tl.to(trunk, { scaleY: 1, duration: 0.4 }, '-=0.2');
      if (spine) tl.to(spine, { scaleX: 1, duration: 0.7 }, '-=0.15');

      cols.forEach((col, i) => {
        const head = heads[i];
        const subs = subGroups[i];
        const overlap = i === 0 ? '-=0.05' : '-=0.35';

        if (head) tl.to(head, { opacity: 1, y: 0, duration: 0.5 }, overlap);

        if (subs.length) {
          /* the tasks in this column trickle downward, one after
             another, slowly, before the next column starts */
          tl.to(subs, { opacity: 1, y: 0, duration: 0.45, stagger: 0.16 }, '-=0.15');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { run(); io.disconnect(); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -70px 0px' });
      io.observe(wrap);
    } else {
      run();
    }
  }

  function initWBS() {
    const cols = document.querySelectorAll('.wbs-col');
    if (!cols.length) return;

    cols.forEach(function (col, idx) {
      const head = col.querySelector('.wbs-col-head');
      if (!head) return;
      head.addEventListener('click', function () {
        if (!isStacked()) return;
        col.classList.toggle('open');
      });
      if (isStacked() && idx === 0) col.classList.add('open');
    });

    let rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (!isStacked()) {
          cols.forEach(function (c) { c.classList.remove('open'); });
        } else if (!document.querySelector('.wbs-col.open')) {
          cols[0].classList.add('open');
        }
        fitWBS();
      }, 150);
    });
  }

  function init() {
    initWBS();
    fitWBS();
    animateWBSReveal();
    /* re-fit once webfonts finish swapping in — text metrics can shift */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWBS).catch(function () {});
    }
    window.addEventListener('load', fitWBS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();