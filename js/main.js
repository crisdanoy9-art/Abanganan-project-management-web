/* =========================================================
   ABANGANAN — main.js
   Navigation, header transparency, smooth anchors, card tilt.
   Loaded on every page.
   ========================================================= */
(function () {
  'use strict';

  /* ---- mobile hamburger menu ---- */
function initNav() {
  const burger = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      links.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

  /* ---- header turns solid once you scroll past the photo ---- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- smooth scrolling for same-page anchors ---- */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.dataset.route) return;
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

  /* ---- 3D tilt on hover ---- */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const targets = document.querySelectorAll('.tilt, .team-card');

  targets.forEach((el) => {
    if (el.dataset.tiltInit) return;
    el.dataset.tiltInit = '1';
    let raf = null;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.setProperty('--mx', (x * 100) + '%');
      el.style.setProperty('--my', (y * 100) + '%');

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rx = (0.5 - y) * 9;
        const ry = (x - 0.5) * 9;
        el.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
      });
    });

    el.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
}

  /* ---- scroll cue jumps to the section below the hero ---- */
  function initScrollCue() {
    const cue = document.querySelector('.ph-scroll');
    const hero = document.querySelector('.page-hero');
    if (!cue || !hero) return;
    cue.style.cursor = 'pointer';
    cue.addEventListener('click', () => {
      const top = hero.getBoundingClientRect().bottom + window.scrollY - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  function init() {
    initNav();
    initNavScroll();
    initAnchors();
    initTilt();
    initScrollCue();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();