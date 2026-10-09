/* 경성야록 · 백백교 판 3
   쓰지 못한 부고 · 바칠수록 놉흔 벼슬 · 흐터진 한 집 · 다가오는 그림자 · 세어 보시오 · 병과 흰 재
   (번쩍임 없음 · 모든 변화는 천천히) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function H(o, k) { return k && k !== o ? '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>' : '<span class="hj" tabindex="0">' + o + '</span>'; }
  function play(id, v) { var a = document.getElementById(id); if (!a) return; try { a.currentTime = 0; a.volume = v || 0.4; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  var touch = window.matchMedia && matchMedia('(hover: none)').matches;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function seen(el, fn, th) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { o.disconnect(); fn(); } }); }, { threshold: th || 0.35 });
    o.observe(el);
  }
  function exists(src, ok) { var i = new Image(); i.onload = function () { ok(src); }; i.src = src; }

  /* ── 六 용문산 : 등불 ── */
  $$('.lantern').forEach(function (l) {
    var host = l.closest('section') || l;
    host.addEventListener('pointermove', function (e) {
      var r = l.getBoundingClientRect(); if (!r.width) return; var k = l.offsetWidth / r.width;
      l.style.setProperty('--lx', ((e.clientX - r.left) * k) + 'px'); l.style.setProperty('--ly', ((e.clientY - r.top) * k) + 'px'); l.classList.add('lit');
    });
    host.addEventListener('pointerleave', function () { l.classList.remove('lit'); });
  });

  /* ── 흰 지면 : 천천히 내려앉는 재 ── */
  (function () {
    var fin = $('#finale'), cv = fin && $('.bf-ash', fin); if (!cv) return;
    var cx = cv.getContext('2d'), P = [], W = 0, Hh = 0;
    function size() { W = cv.width = fin.offsetWidth; Hh = cv.height = fin.offsetHeight; }
    for (var i = 0; i < 70; i++) P.push({ x: Math.random(), y: Math.random(), s: .15 + Math.random() * .5, z: .6 + Math.random() * 1.6 });
    (function f() {
      if (!W) size(); cx.clearRect(0, 0, W, Hh);
      P.forEach(function (p) { p.y += p.s / Hh * 1.4; p.x += Math.sin(p.y * 9) * .0003; if (p.y > 1) { p.y = 0; p.x = Math.random(); }
        cx.fillStyle = 'rgba(120,108,90,.28)'; cx.beginPath(); cx.arc(p.x * W, p.y * Hh, p.z, 0, 7); cx.fill(); });
      requestAnimationFrame(f);
    })();
    window.addEventListener('resize', size); setTimeout(size, 800);
  })();

  /* ── 밤 구간 : 오래 머물면 귀엣말 · 흰 그림자(그림이 오면) ── */
  var dark = $('.bb-dark');
  function inDark() { if (!dark) return false; var r = dark.getBoundingClientRect(), y = innerHeight / 2; return r.top < y && r.bottom > y; }
  var last = performance.now(), mx = innerWidth / 2, my = innerHeight / 2;
  var whisper = document.createElement('div'); whisper.className = 'bb-whisper'; whisper.setAttribute('aria-hidden', 'true'); document.body.appendChild(whisper);
  var ghost = null, gOn = false, wOn = false, gAt = -1e9, wAt = -1e9, wi = 0;
  ['pointermove', 'keydown', 'wheel', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, function (e) {
      last = performance.now(); if (e.clientX != null) { mx = e.clientX; my = e.clientY; }
      if (gOn && ghost) { gOn = false; ghost.classList.remove('on'); }
      if (wOn) { wOn = false; whisper.classList.remove('on'); }
    }, { passive: true });
  });
  var WORDS = ['백백백 의의의 적적적', '희게, 더 희게', '쉰세 곳', '물과 불의 심판', '대원님', '감응감감응 하시옵숭성'];
  if (!touch && !calm) setInterval(function () {
    var now = performance.now(), idle = now - last; if (!inDark()) return;
    if (ghost && idle > 8000 && !gOn && now - gAt > 50000) { gAt = now; gOn = true; ghost.className = 'bb-ghost ' + (mx > innerWidth / 2 ? 'l' : 'r'); requestAnimationFrame(function () { ghost.classList.add('on'); }); }
    if (idle > 12000 && !wOn && now - wAt > 28000) {
      wAt = now; wOn = true; whisper.textContent = WORDS[wi++ % WORDS.length];
      whisper.style.left = Math.min(innerWidth - 320, mx + 34) + 'px'; whisper.style.top = Math.max(20, my - 46) + 'px';
      requestAnimationFrame(function () { whisper.classList.add('on'); });
      setTimeout(function () { if (wOn) { wOn = false; whisper.classList.remove('on'); } }, 7000);
    }
  }, 1000);

  /* ── 바람 소리 : 축음긔를 켜 두면, 밤 구간에서 낮게 ── */
  (function () {
    var bgm = $('#bgm'); if (!bgm || !(window.AudioContext || window.webkitAudioContext)) return;
    var ac = null, g = null;
    function build() {
      if (ac) return; ac = new (window.AudioContext || window.webkitAudioContext)();
      var len = ac.sampleRate * 4, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0), v = 0;
      for (var i = 0; i < len; i++) { v = (v + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = v * 3.2; }
      var src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
      var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
      var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 180; lfo.connect(lg); lg.connect(lp.frequency);
      g = ac.createGain(); g.gain.value = 0; src.connect(lp); lp.connect(g); g.connect(ac.destination); src.start(); lfo.start();
    }
    function level() { if (!ac) return; var t = ac.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(!bgm.paused ? (inDark() ? 0.09 : 0.02) : 0, t, 1.6); }
    bgm.addEventListener('play', function () { build(); if (ac.state === 'suspended') ac.resume(); level(); });
    bgm.addEventListener('pause', level);
    window.addEventListener('scroll', function () { if (ac) level(); }, { passive: true });
  })();
})();
