/* =========================================================
   ABANGANAN — team.js
   Tap a member card to open their full profile: photo /
   initials, name, role, what they build, and extra details
   (school, department, course, hilig, motto).
   ========================================================= */
(function () {
  'use strict';

  var modal, card, avatar, initialsEl, photoEl, nameEl, roleEl, descEl;
  var schoolEl, deptEl, courseEl, hiligEl, mottoEl;
  var lastFocused = null;

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
        '<dl class="mm-details">' +
          '<div class="mm-row"><dt>School</dt><dd id="mmSchool"></dd></div>' +
          '<div class="mm-row"><dt>Department</dt><dd id="mmDept"></dd></div>' +
          '<div class="mm-row"><dt>Course</dt><dd id="mmCourse"></dd></div>' +
          '<div class="mm-row"><dt>Hilig</dt><dd id="mmHilig"></dd></div>' +
          '<div class="mm-row"><dt>Motto</dt><dd id="mmMotto"></dd></div>' +
        '</dl>' +
      '</div>';
    document.body.appendChild(modal);

    card       = modal.querySelector('.member-modal-card');
    avatar     = modal.querySelector('#mmAvatar');
    initialsEl = modal.querySelector('#mmInitials');
    photoEl    = modal.querySelector('#mmPhoto');
    nameEl     = modal.querySelector('#mmName');
    roleEl     = modal.querySelector('#mmRole');
    descEl     = modal.querySelector('#mmDesc');
    schoolEl   = modal.querySelector('#mmSchool');
    deptEl     = modal.querySelector('#mmDept');
    courseEl   = modal.querySelector('#mmCourse');
    hiligEl    = modal.querySelector('#mmHilig');
    mottoEl    = modal.querySelector('#mmMotto');

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
    schoolEl.textContent = data.school || '—';
    deptEl.textContent = data.department || '—';
    courseEl.textContent = data.course || '—';
    hiligEl.textContent = data.hilig || '—';
    mottoEl.textContent = data.motto ? ('"' + data.motto + '"') : '—';

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
      school: cardEl.dataset.school || '',
      department: cardEl.dataset.department || '',
      course: cardEl.dataset.course || '',
      hilig: cardEl.dataset.hilig || '',
      motto: cardEl.dataset.motto || '',
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