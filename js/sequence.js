/* =========================================================
   ABANGANAN — sequence.js
   Step-by-step reveal of the activity flow.
   ========================================================= */
(function () {
  'use strict';

  function initSequence() {
    const nodes = document.querySelectorAll('.flow-node, .flow-terminal, .flow-arrow');
    if (!nodes.length) return;
  
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => { n.style.opacity = '1'; n.style.transform = 'none'; });
      return;
    }
  
    nodes.forEach((n) => {
      n.style.opacity = '0';
      n.style.transform = 'translateY(28px)';
      n.style.transition = 'opacity .75s cubic-bezier(.2,.7,.3,1), transform .75s cubic-bezier(.2,.7,.3,1)';
    });
  
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  
    nodes.forEach((n) => io.observe(n));
  }

  function init() { initSequence(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();