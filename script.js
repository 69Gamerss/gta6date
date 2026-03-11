document.addEventListener('DOMContentLoaded', function () {

  // ── Passive event listener detection ──────────────────────────────────────
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; return true; }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  const eventOptions = supportsPassive ? { passive: true } : false;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // ── Constants ──────────────────────────────────────────────────────────────
  // Midnight UTC on November 19, 2026
  const RELEASE_DATE = new Date('2026-11-19T00:00:00Z').getTime();
  // GTA VI Trailer 1 reveal: December 5, 2023
  const REVEAL_DATE  = new Date('2023-12-05T00:00:00Z').getTime();

  const MILESTONES = [365, 180, 100, 50, 30, 14, 7, 3, 1];
  const MILESTONE_MSG = {
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

  // ── Split-flap digit units ─────────────────────────────────────────────────

  const flipUnits = {};

  function initFlipDigits() {
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (id) {
      const span = document.getElementById(id);
      if (!span) return;
      const val = span.textContent.trim();

      const unit = document.createElement('div');
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
    const oldVal = unit.dataset.value;
    if (oldVal === newVal) return;
    unit.dataset.value = newVal;

    // Update top half immediately — the drop flap covers it
    unit.querySelector('.sf-top .sf-num').textContent = newVal;

    // Drop flap: shows old value's top half, rotates away downward
    const dropFlap = document.createElement('div');
    dropFlap.className = 'sf-flap sf-flap-drop';
    dropFlap.innerHTML = '<span class="sf-num">' + oldVal + '</span>';

    // Rise flap: shows new value's bottom half, rises up into place
    const riseFlap = document.createElement('div');
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
    const tzEl = document.getElementById('release-tz');
    if (!tzEl) return;
    try {
      const releaseLocal = new Date(RELEASE_DATE);
      const localStr = releaseLocal.toLocaleString(undefined, {
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

  // ── Particles ──────────────────────────────────────────────────────────────

  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    // Insert as first child of body so z-index layers work correctly
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = isMobile ? 20 : 45;
    const particles = [];
    for (let i = 0; i < COUNT; i++) {
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
        if (p.y < -4)              p.y = canvas.height + 4;
        if (p.x < -4)              p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  initParticles();

  // ── Milestone banner ───────────────────────────────────────────────────────

  const shownMilestones = new Set();
  let milestoneTimer    = null;

  function checkMilestone(days) {
    if (MILESTONES.indexOf(days) !== -1 && !shownMilestones.has(days)) {
      shownMilestones.add(days);
      showMilestoneBanner(days);
    }
  }

  function showMilestoneBanner(days) {
    const banner = document.getElementById('milestone-banner');
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

  const progressBarEl  = document.getElementById('progress-bar');
  const progressPctEl  = document.getElementById('progress-percent');

  function updateProgress() {
    const total   = RELEASE_DATE - REVEAL_DATE;
    const elapsed = Date.now() - REVEAL_DATE;
    const pct     = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const pctStr  = pct.toFixed(1) + '%';
    if (progressBarEl)  progressBarEl.style.width     = pctStr;
    if (progressPctEl)  progressPctEl.textContent     = pctStr;
  }

  // ── Countdown ──────────────────────────────────────────────────────────────

  const releaseDateText = document.getElementById('release-date-text');
  let countdownInterval;

  function updateCountdown() {
    const now        = Date.now();
    const difference = RELEASE_DATE - now;

    if (difference <= 0) {
      showReleasedState();
      return;
    }

    const days    = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    updateFlipUnit(flipUnits.days,    pad(days));
    updateFlipUnit(flipUnits.hours,   pad(hours));
    updateFlipUnit(flipUnits.minutes, pad(minutes));
    updateFlipUnit(flipUnits.seconds, pad(seconds));

    updateProgress();
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
    if (progressBarEl) progressBarEl.style.width     = '100%';
    if (progressPctEl) progressPctEl.textContent     = '100%';
    launchConfetti();
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);

  // ── Confetti ───────────────────────────────────────────────────────────────

  function launchConfetti() {
    const canvas  = document.createElement('canvas');
    canvas.id     = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx     = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#fcaf17', '#ffffff', '#ff4e4e', '#4eff91', '#4eb5ff'];
    const pieces = [];
    for (let i = 0; i < 120; i++) {
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

    let frame;
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

  const modal         = document.getElementById('trailer-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const trailerIframe = document.getElementById('trailer-iframe');

  const TRAILER_IDS = {
    'trailer-button-1': 'QdBZY2fkU-0',
    'trailer-button-2': 'VQRLujxTm3c',
  };

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

  Object.keys(TRAILER_IDS).forEach(function (btnId) {
    var el = document.getElementById(btnId);
    if (el) el.addEventListener('click', function () { openTrailerModal(TRAILER_IDS[btnId]); });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeTrailerModal, eventOptions);

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

  // ── Share button ───────────────────────────────────────────────────────────

  const shareButton = document.getElementById('share-button');
  if (shareButton) {
    shareButton.addEventListener('click', function () {
      const shareData = {
        title: 'GTA VI Countdown',
        text:  'GTA VI drops November 19, 2026 – track the official countdown!',
        url:   'https://gta6.date',
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareData.url).then(function () {
          const origHTML = shareButton.innerHTML;
          shareButton.textContent = '✓ Link copied!';
          setTimeout(function () { shareButton.innerHTML = origHTML; }, 2000);
        }).catch(function () {});
      }
    });
  }

  // ── Calendar ───────────────────────────────────────────────────────────────

  const calendarButton   = document.getElementById('add-to-calendar-button');
  const calendarDropdown = document.getElementById('calendar-dropdown');

  if (calendarButton && calendarDropdown) {
    calendarButton.addEventListener('click', function (e) {
      e.preventDefault();
      if (calendarDropdown.style.display === 'block') {
        calendarDropdown.style.display = 'none';
      } else {
        if (calendarDropdown.children.length === 0) createCalendarLinks();
        if (isMobile) {
          var rect = calendarButton.getBoundingClientRect();
          calendarDropdown.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
        }
        calendarDropdown.style.display = 'block';
      }
    }, eventOptions);

    document.addEventListener('click', function (e) {
      if (!calendarDropdown.contains(e.target) && e.target !== calendarButton) {
        calendarDropdown.style.display = 'none';
      }
    }, eventOptions);

    if (isMobile) {
      document.addEventListener('touchend', function (e) {
        if (!calendarDropdown.contains(e.target) && e.target !== calendarButton) {
          calendarDropdown.style.display = 'none';
        }
      }, eventOptions);
    }
  }

  function createCalendarLinks() {
    var title = 'GTA VI Release';
    var desc  = 'Grand Theft Auto VI official release date \u2013 November 19, 2026';
    var start = '20261119T000000Z';
    var end   = '20261119T235959Z';
    var loc   = 'Worldwide';

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

    var calIconSVG =
      '<svg class="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">' +
        '<path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>' +
        '<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>' +
      '</svg>';

    services.forEach(function (service) {
      var link = document.createElement('a');
      link.href      = service.url;
      link.className = 'calendar-link';
      link.target    = '_blank';
      link.rel       = 'noopener noreferrer';
      link.innerHTML = calIconSVG + service.name;
      calendarDropdown.appendChild(link);
    });
  }

  // ── Mobile touch target sizing ─────────────────────────────────────────────
  if (isMobile) {
    document.querySelectorAll(
      '.trailer-button, .social-button, .calendar-button, .share-button, .close-button'
    ).forEach(function (el) {
      el.style.minHeight = '44px';
      el.style.minWidth  = '44px';
    });
  }

});
