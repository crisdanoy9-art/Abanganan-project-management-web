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

  /* Scramble decoder animation (random letters and numbers forming the final text) */
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*&!?';

  function scrambleText(element, finalString, durationMs = 1250) {
    if (!element || !finalString) return Promise.resolve();
    const len = finalString.length;
    const startTime = performance.now();
    let lastUpdate = 0;

    return new Promise((resolve) => {
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const resolvedCount = Math.floor(progress * len);

        // Update random cipher characters every 45ms for crisp, readable decoding
        if (now - lastUpdate > 45 || progress >= 1) {
          lastUpdate = now;
          let output = '';
          for (let i = 0; i < len; i++) {
            if (finalString[i] === ' ') {
              output += ' ';
            } else if (i < resolvedCount) {
              output += finalString[i];
            } else {
              output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
          }
          element.textContent = output;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = finalString;
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* One-by-one expansion of the timeline bars without stretching text */
  function animateBars() {
    const bars = document.querySelectorAll('.g-bar');
    if (!bars.length) return;

    // Ensure all bars have .bar-text and store original text
    bars.forEach((bar) => {
      let textEl = bar.querySelector('.bar-text');
      if (!textEl) {
        const tip = bar.querySelector('.bar-tip');
        let textContent = '';
        bar.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textContent += node.textContent.trim();
            node.textContent = '';
          }
        });
        textEl = document.createElement('span');
        textEl.className = 'bar-text';
        textEl.textContent = textContent;
        if (tip) {
          bar.insertBefore(textEl, tip);
        } else {
          bar.appendChild(textEl);
        }
      }

      const original = textEl.dataset.originalText || textEl.textContent.trim();
      textEl.dataset.originalText = original;

      // Interactive scramble replay on hover
      bar.addEventListener('mouseenter', () => {
        if (!bar.dataset.isAnimating) {
          scrambleText(textEl, original, 700);
        }
      });
    });

    if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Set initial state: NO scaleX (so text NEVER stretches!)
    // Uses clip-path inset from right to left
    gsap.set(bars, {
      clipPath: 'inset(0 100% 0 0 round 10px)',
      opacity: 0,
      scaleX: 1
    });

    const run = () => {
      const tl = gsap.timeline();
      bars.forEach((bar, idx) => {
        const textEl = bar.querySelector('.bar-text');
        const targetText = textEl ? (textEl.dataset.originalText || textEl.textContent.trim()) : '';

        // Randomize initial text before the bar begins unfolding
        if (textEl && targetText) {
          textEl.textContent = targetText.replace(/[^ ]/g, () =>
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          );
        }

        // Each bar gracefully unfolds one-by-one with clear visibility
        tl.to(bar, {
          clipPath: 'inset(0 0% 0 0 round 10px)',
          opacity: 1,
          duration: 1.25,
          ease: 'power2.out',
          onStart: () => {
            bar.dataset.isAnimating = '1';
            if (textEl && targetText) {
              scrambleText(textEl, targetText, 1250);
            }
          },
          onComplete: () => {
            delete bar.dataset.isAnimating;
            bar.style.clipPath = 'none'; // Clear clip-path so tooltips display freely
          }
        }, idx === 0 ? 0 : '>-0.35'); // Next bar starts as the previous one is finishing
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