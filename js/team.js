/* =========================================================
   ABANGANAN — team.js
   Tap a member card to open their full profile:
   photo / initials, name, role, what they build, and the
   Facebook contact link.
   ========================================================= */
(function () {
  'use strict';

  var modal, card, avatar, initialsEl, photoEl, nameEl, roleEl, descEl, fbEl;
  var lastFocused = null;

  var FB_PATH = 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z';
  var GH_PATH = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
  var GOOGLE_SVG =
    '<svg viewBox="0 0 18 18" width="15" height="15" aria-hidden="true">' +
    '<path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>' +
    '<path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>' +
    '<path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>' +
    '<path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>' +
    '</svg>';

  var fbEl, ghEl, ggEl;

  function buildModal() {
    if (document.getElementById('memberModal')) return;

    modal = document.createElement('div');
    modal.className = 'tech-modal member-modal';
    modal.id = 'memberModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="tech-modal-card member-modal-card" role="dialog" aria-modal="true" aria-labelledby="mmName">' +
        '<button type="button" class="tech-modal-close" aria-label="Close">&times;</button>' +
        '<div class="mm-avatar" id="mmAvatar">' +
          '<span class="mm-initials" id="mmInitials"></span>' +
          '<img class="mm-photo" id="mmPhoto" alt="" />' +
          '<span class="avatar-ring" aria-hidden="true"></span>' +
        '</div>' +
        '<h3 id="mmName"></h3>' +
        '<span class="team-role" id="mmRole"></span>' +
        '<p id="mmDesc"></p>' +
        '<div class="team-socials">' +
          '<a class="team-social-link fb" id="mmFb" target="_blank" rel="noopener" title="Facebook">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + FB_PATH + '"/></svg>' +
          '</a>' +
          '<a class="team-social-link gh" id="mmGh" target="_blank" rel="noopener" title="GitHub">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + GH_PATH + '"/></svg>' +
          '</a>' +
          '<a class="team-social-link gg" id="mmGg" target="_blank" rel="noopener" title="Google">' +
            GOOGLE_SVG +
          '</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    card       = modal.querySelector('.member-modal-card');
    avatar     = modal.querySelector('#mmAvatar');
    initialsEl = modal.querySelector('#mmInitials');
    photoEl    = modal.querySelector('#mmPhoto');
    nameEl     = modal.querySelector('#mmName');
    roleEl     = modal.querySelector('#mmRole');
    descEl     = modal.querySelector('#mmDesc');
    fbEl       = modal.querySelector('#mmFb');
    ghEl       = modal.querySelector('#mmGh');
    ggEl       = modal.querySelector('#mmGg');

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    modal.querySelector('.tech-modal-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
  }

  function open(data, trigger) {
    if (!modal) buildModal();
    lastFocused = trigger || null;

    card.style.setProperty('--c1', data.c1);
    card.style.setProperty('--c2', data.c2);
    avatar.style.setProperty('--c1', data.c1);
    avatar.style.setProperty('--c2', data.c2);

    initialsEl.textContent = data.initials;
    if (data.photo) {
      photoEl.src = data.photo;
      photoEl.alt = data.name;
      photoEl.style.display = '';
      photoEl.onerror = function () { photoEl.style.display = 'none'; };
    } else {
      photoEl.removeAttribute('src');
      photoEl.style.display = 'none';
    }

    nameEl.textContent = data.name;
    roleEl.textContent = data.role;
    descEl.textContent = data.desc;
    fbEl.href = data.fb;
    fbEl.setAttribute('aria-label', data.name + ' on Facebook');
    ghEl.href = data.gh;
    ghEl.setAttribute('aria-label', data.name + ' on GitHub');
    ggEl.href = data.gg;
    ggEl.setAttribute('aria-label', data.name + ' on Google');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { modal.querySelector('.tech-modal-close').focus(); }, 60);
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function read(cardEl) {
    var photoEl2 = cardEl.querySelector('.avatar-photo');
    var initEl = cardEl.querySelector('.avatar-initials');
    var fb = cardEl.querySelector('.team-social-link.fb');
    var gh = cardEl.querySelector('.team-social-link.gh');
    var gg = cardEl.querySelector('.team-social-link.gg');
    var cs = getComputedStyle(cardEl);
    return {
      name: (cardEl.querySelector('h3') || {}).textContent || '',
      role: (cardEl.querySelector('.team-role') || {}).textContent || '',
      desc: (cardEl.querySelector('p') || {}).textContent || '',
      initials: initEl ? initEl.textContent : '',
      photo: photoEl2 ? photoEl2.getAttribute('src') : '',
      fb: fb ? fb.getAttribute('href') : '#',
      gh: gh ? gh.getAttribute('href') : '#',
      gg: gg ? gg.getAttribute('href') : '#',
      c1: cs.getPropertyValue('--c1').trim() || '#22d3ee',
      c2: cs.getPropertyValue('--c2').trim() || '#8b5cf6'
    };
  }

  function init() {
    var cards = document.querySelectorAll('.team-card');
    if (!cards.length) return;
    buildModal();

    cards.forEach(function (el) {
      el.classList.add('is-tappable');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');

      el.addEventListener('click', function (e) {
        if (e.target.closest('.team-social-link')) return;   /* let the social link work */
        open(read(el), el);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(read(el), el);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();