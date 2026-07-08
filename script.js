document.addEventListener('DOMContentLoaded', function () {

  // ── Configuration (single source of truth) ─────────────────────────────────
  // Update these values and the whole page follows. The static strings in
  // index.html (<title>, meta tags, JSON-LD, the visible release line) are a
  // no-JS fallback — keep them in sync with the dates below when they change.
  var CONFIG = {
    releaseDate: '2026-11-19T00:00:00Z',   // midnight UTC, Nov 19 2026
    revealDate:  '2023-12-05T00:00:00Z',   // GTA VI Trailer 1 reveal
    siteUrl:     'https://gta6.date/',
    trailers: {
      'trailer-button-1': 'QdBZY2fkU-0',
      'trailer-button-2': 'VQRLujxTm3c',
    },
    // Official pre-order destinations. Swap in exact/affiliate links anytime.
    preorder: [
      { name: 'PlayStation Store', url: 'https://www.playstation.com/en-us/games/grand-theft-auto-vi/' },
      { name: 'Xbox Store',        url: 'https://www.xbox.com/en-US/games/grand-theft-auto-vi' },
      { name: 'Rockstar Games',    url: 'https://www.rockstargames.com/VI' },
    ],
    event: {
      title:    'GTA VI Release',
      location: 'Worldwide',
      start:    '20261119T000000Z',        // ICS UTC format
      end:      '20261119T235959Z',
    },
  };

  var RELEASE_DATE = new Date(CONFIG.releaseDate).getTime();
  var REVEAL_DATE  = new Date(CONFIG.revealDate).getTime();

  // ── Passive event listener detection ──────────────────────────────────────
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; return true; }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  var eventOptions = supportsPassive ? { passive: true } : false;
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  var prefersReducedMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Constants ──────────────────────────────────────────────────────────────
  var MILESTONES = [365, 180, 100, 50, 30, 14, 7, 3, 1];
  var MILESTONE_MSG = {
    365: '🎮 One year to go!',
    180: '⏰ 6 months remaining!',
    100: '💯 100 days to go!',
     50: '🔥 50 days remaining!',
     30: '📅 One month to go!',
     14: '⚡ Two weeks remaining!',
      7: '🚀 One week to go!',
      3: '😱 Just 3 days left!',
      1: '🎊 Tomorrow is the day!',
  };

  function pad(n) { return n.toString().padStart(2, '0'); }

  function formatReleaseDate() {
    return new Date(RELEASE_DATE).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });
  }

  // Drive the visible release line from CONFIG
  var releaseDateText = document.getElementById('release-date-text');
  if (releaseDateText) {
    releaseDateText.textContent = 'GTA VI drops on ' + formatReleaseDate();
  }

  // ── Split-flap digit units ─────────────────────────────────────────────────

  var flipUnits = {};

  function initFlipDigits() {
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (id) {
      var span = document.getElementById(id);
      if (!span) return;
      var val = span.textContent.trim();

      var unit = document.createElement('div');
      unit.className  = 'flip-unit';
      unit.id         = id;
      unit.dataset.value = val;
      unit.innerHTML  =
        '<div class="sf-top"><span class="sf-num">' + val + '</span></div>' +
        '<div class="sf-bottom"><span class="sf-num">' + val + '</span></div>';

      span.replaceWith(unit);
      flipUnits[id] = unit;
    });
  }

  function updateFlipUnit(unit, newVal) {
    var oldVal = unit.dataset.value;
    if (oldVal === newVal) return;
    unit.dataset.value = newVal;

    // Reduced motion: swap the digit instantly, no flap animation
    if (prefersReducedMotion) {
      unit.querySelector('.sf-top .sf-num').textContent = newVal;
      unit.querySelector('.sf-bottom .sf-num').textContent = newVal;
      return;
    }

    // Update top half immediately — the drop flap covers it
    unit.querySelector('.sf-top .sf-num').textContent = newVal;

    // Drop flap: shows old value's top half, rotates away downward
    var dropFlap = document.createElement('div');
    dropFlap.className = 'sf-flap sf-flap-drop';
    dropFlap.innerHTML = '<span class="sf-num">' + oldVal + '</span>';

    // Rise flap: shows new value's bottom half, rises up into place
    var riseFlap = document.createElement('div');
    riseFlap.className = 'sf-flap sf-flap-rise';
    riseFlap.innerHTML = '<span class="sf-num">' + newVal + '</span>';

    unit.appendChild(dropFlap);
    unit.appendChild(riseFlap);

    // After animation completes, update bottom half and remove flaps
    setTimeout(function () {
      unit.querySelector('.sf-bottom .sf-num').textContent = newVal;
      dropFlap.remove();
      riseFlap.remove();
    }, 400);
  }

  initFlipDigits();

  // ── Timezone display ───────────────────────────────────────────────────────

  function showTimezoneInfo() {
    var tzEl = document.getElementById('release-tz');
    if (!tzEl) return;
    try {
      var releaseLocal = new Date(RELEASE_DATE);
      var localStr = releaseLocal.toLocaleString(undefined, {
        weekday:      'short',
        month:        'short',
        day:          'numeric',
        year:         'numeric',
        hour:         '2-digit',
        minute:       '2-digit',
        timeZoneName: 'short',
      });
      tzEl.textContent = localStr + ' in your timezone';
    } catch (e) {
      // Intl not available, skip
    }
  }

  showTimezoneInfo();

  // ── Particles (skipped when reduced motion is requested) ────────────────────

  function initParticles() {
    var canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    // Insert as first child of body so z-index layers work correctly
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var COUNT = isMobile ? 20 : 45;
    var particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x:       Math.random() * window.innerWidth,
        y:       Math.random() * window.innerHeight,
        r:       0.5 + Math.random() * 1.5,
        opacity: 0.04 + Math.random() * 0.18,
        speedY:  -(0.08 + Math.random() * 0.25),
        speedX:  (Math.random() - 0.5) * 0.12,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(252, 175, 23, ' + p.opacity + ')';
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -4)               p.y = canvas.height + 4;
        if (p.x < -4)               p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  if (!prefersReducedMotion) initParticles();

  // ── Milestone banner ───────────────────────────────────────────────────────

  var shownMilestones = new Set();
  var milestoneTimer  = null;

  function checkMilestone(days) {
    if (MILESTONES.indexOf(days) !== -1 && !shownMilestones.has(days)) {
      shownMilestones.add(days);
      showMilestoneBanner(days);
    }
  }

  function showMilestoneBanner(days) {
    var banner = document.getElementById('milestone-banner');
    if (!banner) return;
    banner.textContent = MILESTONE_MSG[days] || (days + ' days remaining!');
    banner.hidden = false;
    // Trigger reflow so transition fires
    void banner.offsetWidth;
    banner.classList.add('banner-visible');
    clearTimeout(milestoneTimer);
    milestoneTimer = setTimeout(function () {
      banner.classList.remove('banner-visible');
      setTimeout(function () { banner.hidden = true; }, 500);
    }, 5000);
  }

  // ── Progress bar ───────────────────────────────────────────────────────────

  var progressBarEl  = document.getElementById('progress-bar');
  var progressPctEl  = document.getElementById('progress-percent');
  var progressTrack  = document.getElementById('progress-track');

  function updateProgress() {
    var total   = RELEASE_DATE - REVEAL_DATE;
    var elapsed = Date.now() - REVEAL_DATE;
    var pct     = Math.min(100, Math.max(0, (elapsed / total) * 100));
    var pctStr  = pct.toFixed(1) + '%';
    if (progressBarEl)  progressBarEl.style.width = pctStr;
    if (progressPctEl)  progressPctEl.textContent = pctStr;
    if (progressTrack)  progressTrack.setAttribute('aria-valuenow', pct.toFixed(0));
  }

  // ── Screen-reader countdown (announced ~once per minute) ────────────────────

  var srEl = document.getElementById('countdown-sr');
  var lastSrKey = '';

  function updateSrCountdown(days, hours, minutes) {
    if (!srEl) return;
    var key = days + ':' + hours + ':' + minutes;
    if (key === lastSrKey) return;   // only re-announce when the minute changes
    lastSrKey = key;
    srEl.textContent = days + ' days, ' + hours + ' hours, ' + minutes +
      ' minutes until GTA VI releases on ' + formatReleaseDate() + '.';
  }

  // ── Countdown ──────────────────────────────────────────────────────────────

  var countdownInterval;

  function updateCountdown() {
    var now        = Date.now();
    var difference = RELEASE_DATE - now;

    if (difference <= 0) {
      showReleasedState();
      return;
    }

    var days    = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);

    updateFlipUnit(flipUnits.days,    pad(days));
    updateFlipUnit(flipUnits.hours,   pad(hours));
    updateFlipUnit(flipUnits.minutes, pad(minutes));
    updateFlipUnit(flipUnits.seconds, pad(seconds));

    updateProgress();
    updateSrCountdown(days, hours, minutes);
    checkMilestone(days);
  }

  function showReleasedState() {
    clearInterval(countdownInterval);
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (id) {
      if (flipUnits[id]) updateFlipUnit(flipUnits[id], '00');
    });
    if (releaseDateText) {
      releaseDateText.textContent = '🎮 GTA VI is OUT NOW!';
      releaseDateText.classList.add('released');
    }
    if (progressBarEl) progressBarEl.style.width = '100%';
    if (progressPctEl) progressPctEl.textContent = '100%';
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', '100');
    if (srEl) srEl.textContent = 'GTA VI is out now!';
    launchConfetti();
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);

  // ── Confetti (skipped when reduced motion is requested) ─────────────────────

  function launchConfetti() {
    if (prefersReducedMotion) return;
    var canvas  = document.createElement('canvas');
    canvas.id     = 'confetti-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx     = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    var COLORS = ['#fcaf17', '#ffffff', '#ff4e4e', '#4eff91', '#4eb5ff'];
    var pieces = [];
    for (var i = 0; i < 120; i++) {
      pieces.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * -canvas.height,
        w:     6 + Math.random() * 8,
        h:     10 + Math.random() * 10,
        rot:   Math.random() * 360,
        spd:   2 + Math.random() * 3,
        col:   COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: (Math.random() - 0.5) * 1.5,
      });
    }

    var frame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(function (p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y   += p.spd;
        p.x   += p.drift;
        p.rot += 2;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    setTimeout(function () { cancelAnimationFrame(frame); canvas.remove(); }, 6000);
  }

  // ── Trailer modal ──────────────────────────────────────────────────────────

  var modal         = document.getElementById('trailer-modal');
  var closeModalBtn = document.getElementById('close-modal');
  var trailerIframe = document.getElementById('trailer-iframe');

  function openTrailerModal(videoId) {
    trailerIframe.src            = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    modal.style.display          = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeTrailerModal() {
    trailerIframe.src            = '';
    modal.style.display          = 'none';
    document.body.style.overflow = '';
  }

  Object.keys(CONFIG.trailers).forEach(function (btnId) {
    var el = document.getElementById(btnId);
    if (el) el.addEventListener('click', function () { openTrailerModal(CONFIG.trailers[btnId]); });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeTrailerModal, eventOptions);

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeTrailerModal();
    }, eventOptions);

    if (isMobile) {
      modal.addEventListener('touchend', function (e) {
        if (e.target === modal) closeTrailerModal();
      }, eventOptions);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeTrailerModal();
    });
  }

  // ── Share button ───────────────────────────────────────────────────────────

  var shareButton = document.getElementById('share-button');
  if (shareButton) {
    shareButton.addEventListener('click', function () {
      var shareData = {
        title: 'GTA VI Countdown',
        text:  'GTA VI drops ' + formatReleaseDate() + ' – track the official countdown!',
        url:   CONFIG.siteUrl,
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareData.url).then(function () {
          var origHTML = shareButton.innerHTML;
          shareButton.textContent = '✓ Link copied!';
          setTimeout(function () { shareButton.innerHTML = origHTML; }, 2000);
        }).catch(function () {});
      }
    });
  }

  // ── Dropdown menus (pre-order + calendar) ───────────────────────────────────

  function setupDropdown(button, dropdown, build) {
    if (!button || !dropdown) return;

    function close() {
      dropdown.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
    }
    function open() {
      if (dropdown.children.length === 0) build(dropdown);
      if (isMobile) {
        var rect = button.getBoundingClientRect();
        dropdown.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
      }
      dropdown.style.display = 'block';
      button.setAttribute('aria-expanded', 'true');
    }

    // Non-passive: we call preventDefault() here (passive would warn + no-op)
    button.addEventListener('click', function (e) {
      e.preventDefault();
      if (dropdown.style.display === 'block') close(); else open();
    });

    function outside(e) {
      if (!dropdown.contains(e.target) && !button.contains(e.target) && e.target !== button) close();
    }
    document.addEventListener('click', outside, eventOptions);
    if (isMobile) document.addEventListener('touchend', outside, eventOptions);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function appendLink(dropdown, name, url, iconSVG) {
    var link = document.createElement('a');
    link.href      = url;
    link.className = 'dropdown-link';
    link.target    = '_blank';
    link.rel       = 'noopener noreferrer';
    link.setAttribute('role', 'menuitem');
    link.innerHTML = iconSVG + name;
    dropdown.appendChild(link);
  }

  // Pre-order dropdown
  var CART_ICON =
    '<svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">' +
      '<path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.49-.402L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>' +
    '</svg>';

  function buildPreorderLinks(dropdown) {
    CONFIG.preorder.forEach(function (store) {
      appendLink(dropdown, store.name, store.url, CART_ICON);
    });
  }

  setupDropdown(
    document.getElementById('preorder-button'),
    document.getElementById('preorder-dropdown'),
    buildPreorderLinks
  );

  // Calendar dropdown
  var CAL_ICON =
    '<svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">' +
      '<path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>' +
      '<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>' +
    '</svg>';

  function buildCalendarLinks(dropdown) {
    var title = CONFIG.event.title;
    var desc  = 'Grand Theft Auto VI official release date – ' + formatReleaseDate();
    var start = CONFIG.event.start;
    var end   = CONFIG.event.end;
    var loc   = CONFIG.event.location;

    var services = [
      {
        name: 'Google Calendar',
        url:  'https://www.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
              '&dates=' + start + '/' + end + '&details=' + encodeURIComponent(desc) +
              '&location=' + encodeURIComponent(loc),
      },
      {
        name: 'Apple Calendar',
        url:  'data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:' +
              start + '%0ADTEND:' + end + '%0ASUMMARY:' + encodeURIComponent(title) +
              '%0ADESCRIPTION:' + encodeURIComponent(desc) + '%0ALOCATION:' + encodeURIComponent(loc) +
              '%0AEND:VEVENT%0AEND:VCALENDAR',
      },
      {
        name: 'Outlook',
        url:  'https://outlook.live.com/calendar/0/deeplink/compose?subject=' + encodeURIComponent(title) +
              '&startdt=' + start + '&enddt=' + end + '&body=' + encodeURIComponent(desc) +
              '&location=' + encodeURIComponent(loc),
      },
      {
        name: 'Yahoo Calendar',
        url:  'https://calendar.yahoo.com/?v=60&title=' + encodeURIComponent(title) +
              '&st=' + start + '&et=' + end + '&desc=' + encodeURIComponent(desc) +
              '&in_loc=' + encodeURIComponent(loc),
      },
    ];

    services.forEach(function (service) {
      appendLink(dropdown, service.name, service.url, CAL_ICON);
    });
  }

  setupDropdown(
    document.getElementById('add-to-calendar-button'),
    document.getElementById('calendar-dropdown'),
    buildCalendarLinks
  );

  // ── Mobile touch target sizing ─────────────────────────────────────────────
  if (isMobile) {
    document.querySelectorAll(
      '.trailer-button, .social-button, .footer-button, .close-button'
    ).forEach(function (el) {
      el.style.minHeight = '44px';
      el.style.minWidth  = '44px';
    });
  }

});
