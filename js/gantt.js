/* =========================================================
   ABANGANAN — gantt.js
   Tooltips, mobile swipe hint and the slow growth of the timeline bars.
   ========================================================= */
(function () {
  'use strict';

  function initGantt() {
    const shell = document.querySelector('.gantt-shell');
    const scroller = document.querySelector('.gantt-scroll');
    if (!shell || !scroller) return;
  
    const bars = document.querySelectorAll('.g-bar');
    bars.forEach((bar) => {
      const tip = bar.querySelector('.bar-tip');
      if (!tip) return;
      bar.addEventListener('mouseenter', () => {
        tip.style.left = '50%';
        tip.style.transform = 'translateX(-50%) translateY(0)';
        requestAnimationFrame(() => {
          const tipRect = tip.getBoundingClientRect();
          const shellRect = shell.getBoundingClientRect();
          if (tipRect.left < shellRect.left + 8) {
            const shift = shellRect.left + 8 - tipRect.left;
            tip.style.left = 'calc(50% + ' + shift + 'px)';
          } else if (tipRect.right > shellRect.right - 8) {
            const shift = tipRect.right - (shellRect.right - 8);
            tip.style.left = 'calc(50% - ' + shift + 'px)';
          }
        });
      });
    });
  
    if (window.innerWidth <= 720 && !shell.dataset.hintAdded) {
      shell.dataset.hintAdded = '1';
      const hint = document.createElement('div');
      hint.textContent = "← Swipe horizontally to view the full 12-week timeline →";
      hint.style.cssText = 'text-align:center;font-size:.68rem;letter-spacing:.1em;color:#93a4c0;margin-top:.9rem;opacity:.85;';
      shell.parentElement.insertBefore(hint, shell.nextSibling);
      let hidden = false;
      scroller.addEventListener('scroll', () => {
        if (hidden) return;
        hidden = true;
        hint.style.transition = 'opacity .6s ease';
        hint.style.opacity = '0';
      }, { passive: true, once: true });
    }
  
    if (window.matchMedia('(hover: none)').matches) {
      bars.forEach((bar) => {
        bar.addEventListener('click', (e) => {
          e.stopPropagation();
          const tip = bar.querySelector('.bar-tip');
          if (!tip) return;
          const isOpen = bar.dataset.tipOpen === '1';
          bars.forEach((b) => {
            b.dataset.tipOpen = '0';
            const t = b.querySelector('.bar-tip');
            if (t) t.style.opacity = '';
          });
          if (!isOpen) { bar.dataset.tipOpen = '1'; tip.style.opacity = '1'; }
        });
      });
      document.addEventListener('click', () => {
        bars.forEach((b) => {
          b.dataset.tipOpen = '0';
          const t = b.querySelector('.bar-tip');
          if (t) t.style.opacity = '';
        });
      });
    }
  }

  /* slow, one-by-one growth of the timeline bars */
  function animateBars() {
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bars = document.querySelectorAll('.g-bar');
    if (!bars.length) return;

    gsap.set(bars, { scaleX: 0, transformOrigin: 'left center', opacity: 0.25 });

    /* strictly one-by-one: each bar only starts growing once the bar
       before it has fully finished (a GSAP timeline with no position
       argument chains tweens end-to-end instead of overlapping them) */
    const run = () => {
      const tl = gsap.timeline();
      bars.forEach((bar) => {
        tl.to(bar, { scaleX: 1, opacity: 1, duration: 1.1, ease: 'power2.out' });
      });
    };

    const shell = document.querySelector('.gantt-shell');
    if (shell && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { run(); io.disconnect(); }
        });
      }, { threshold: 0.15 });
      io.observe(shell);
    } else {
      run();
    }
  }

  function init() { initGantt(); animateBars(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();