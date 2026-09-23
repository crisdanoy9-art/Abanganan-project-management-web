/* =========================================================
   ABANGANAN — techstack.js
   Renders the "built with" tech marquee: real brand icons
   scrolling right-to-left, each one bordered, and a
   click-to-zoom card with a short description.
   Include this on any page that has a <div class="tech-marquee">.
   ========================================================= */
(function () {
  'use strict';

  var TECH = [
  {
    name: 'Next.js',
    hex: '#5b8def',
    desc: 'The React framework used to build Abanganan\'s pages, routing and server logic.',
    d: 'M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z'
  },
  {
    name: 'TypeScript',
    hex: '#3178C6',
    desc: 'Adds type safety on top of JavaScript so bugs are caught before they reach users.',
    d: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z'
  },
  {
    name: 'Tailwind CSS',
    hex: '#38BDF8',
    desc: 'Utility-first CSS framework used to style every screen quickly and consistently.',
    d: 'M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z'
  },
  {
    name: 'Supabase',
    hex: '#3ECF8E',
    desc: 'Provides the database, authentication and file storage behind every listing.',
    d: 'M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z'
  },
  {
    name: 'Mapbox',
    hex: '#000000',
    desc: 'Powers the map view and lets landlords pin the exact location of a room.',
    d: 'M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.696 14.943c-4.103 4.103-11.433 2.794-11.433 2.794S4.94 10.421 9.057 6.304c2.281-2.281 6.061-2.187 8.45.189s2.471 6.168.189 8.45zm-4.319-7.91-1.174 2.416-2.416 1.174 2.416 1.174 1.174 2.416 1.174-2.416 2.416-1.174-2.416-1.174-1.174-2.416z'
  },
  {
    name: 'Figma',
    hex: '#A259FF',
    desc: 'Used to design the wireframes and prototypes before any code was written.',
    viewBox: '0 0 38 57',
    svg: '<path fill="#1ABCFE" d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"/>' +
         '<path fill="#0ACF83" d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"/>' +
         '<path fill="#FF7262" d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"/>' +
         '<path fill="#F24E1E" d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"/>' +
         '<path fill="#A259FF" d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"/>'
  },
  {
    name: 'GitHub',
    hex: '#181717',
    desc: 'Hosts Abanganan\'s codebase and manages version control for the whole team.',
    d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
  },
  {
    name: 'Vercel',
    hex: '#000000',
    desc: 'Hosts and deploys the live Abanganan web application.',
    d: 'm12 1.608 12 20.784H0Z'
  }
  ];

  function iconSVG(d, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>';
  }

  /* some marks (Figma) are true multi-colour logos — those carry their
     own viewBox + ready-made <path fill="#..."> markup instead of a
     single currentColor path */
  function iconMarkup(t, size) {
    if (t.svg) {
      return '<svg viewBox="' + t.viewBox + '" width="' + size + '" height="' + size + '" ' +
        'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + t.svg + '</svg>';
    }
    return iconSVG(t.d, size);
  }

  function buildTile(t) {
    var tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'tech-tile';
    tile.style.setProperty('--c', t.hex);
    tile.setAttribute('aria-label', t.name);
    tile.innerHTML =
      '<span class="tt-icon-wrap">' + iconMarkup(t, 20) + '</span>' +
      '<span class="tt-name">' + t.name + '</span>';
    tile.addEventListener('click', function () { tile.blur(); openModal(t); });
    return tile;
  }

  function buildMarquees() {
    var mounts = document.querySelectorAll('.tech-marquee');
    if (!mounts.length) return;

    mounts.forEach(function (mount) {
      var track = document.createElement('div');
      track.className = 'tm-track';

      /* render the list twice back to back for a seamless loop */
      for (var pass = 0; pass < 2; pass++) {
        TECH.forEach(function (t) { track.appendChild(buildTile(t)); });
      }

      mount.innerHTML = '';
      mount.appendChild(track);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        track.style.animation = 'none';
      }
    });
  }

  /* ---- click-to-zoom modal, shared by every marquee on the page ---- */
  var modal, modalIcon, modalName, modalDesc, modalCard;

  function buildModal() {
    if (document.getElementById('techModal')) return;

    modal = document.createElement('div');
    modal.className = 'tech-modal';
    modal.id = 'techModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="tech-modal-card" role="dialog" aria-modal="true">' +
        '<button type="button" class="tech-modal-close" aria-label="Close">&times;</button>' +
        '<div class="tech-modal-icon" id="techModalIcon"></div>' +
        '<h3 id="techModalName"></h3>' +
        '<p id="techModalDesc"></p>' +
      '</div>';
    document.body.appendChild(modal);

    modalCard = modal.querySelector('.tech-modal-card');
    modalIcon = modal.querySelector('#techModalIcon');
    modalName = modal.querySelector('#techModalName');
    modalDesc = modal.querySelector('#techModalDesc');

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    modal.querySelector('.tech-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(t) {
    if (!modal) buildModal();
    modalCard.style.setProperty('--c', t.hex);
    modalIcon.innerHTML = iconMarkup(t, 40);
    modalName.textContent = t.name;
    modalDesc.textContent = t.desc;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function init() {
    buildMarquees();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();