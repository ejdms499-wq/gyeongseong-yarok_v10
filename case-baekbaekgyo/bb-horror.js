/* 경성야록 · 백백교 판 2 — 서늘함을 끝까지
   등불 · 흰 그림자 · 귀엣말 · 白으로 덮이는 장부 · 머물지 않는 수 · 바람 소리
   (번쩍임 없음 · 모든 변화는 천천히) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var touch = window.matchMedia && matchMedia('(hover: none)').matches;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 등불 : 손이 닿는 자리만 밝음 ── */
  $$('.lantern').forEach(function (l) {
    var host = l.closest('section') || l;
    host.addEventListener('pointermove', function (e) {
      var r = l.getBoundingClientRect(); if (!r.width) return; var k = l.offsetWidth / r.width;
      l.style.setProperty('--lx', ((e.clientX - r.left) * k) + 'px');
      l.style.setProperty('--ly', ((e.clientY - r.top) * k) + 'px');
      l.classList.add('lit');
    });
    host.addEventListener('pointerleave', function () { l.classList.remove('lit'); });
  });

  /* ── 지금 화면 가운데가 어두운 띠인가 ── */
  var DARK = ['#white', '#night', '#mute', '#mountain', '.bb-land', '.bb-jar', '.bb-ledger', '.bb-verdict', '.bb-line'];
  function inDark() {
    var y = innerHeight / 2;
    return DARK.some(function (s) { var el = $(s); if (!el) return false; var r = el.getBoundingClientRect(); return r.top < y && r.bottom > y; });
  }

  /* ── 가만히 잇으면 ── */
  var last = performance.now(), mx = innerWidth / 2, my = innerHeight / 2;
  ['pointermove', 'keydown', 'wheel', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, function (e) { last = performance.now(); if (e.clientX != null) { mx = e.clientX; my = e.clientY; } away(); }, { passive: true });
  });

  /* 흰 그림자 — 화면 가장자리에, 뒤돌아 선 흰 옷 하나 */
  var SIL = '<svg viewBox="0 0 100 360" aria-hidden="true"><ellipse cx="50" cy="11" rx="6" ry="7" fill="#efe8da"/><ellipse cx="50" cy="32" rx="15" ry="18" fill="#efe8da"/><path d="M30 54 Q50 46 70 54 L80 122 L88 352 L12 352 L20 122 Z" fill="#efe8da"/></svg>';
  var ghost = document.createElement('div'); ghost.className = 'bb-ghost'; ghost.innerHTML = SIL; ghost.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ghost);
  var ghostAt = -1e9, ghostOn = false;
  function away() {
    if (ghostOn) { ghostOn = false; ghost.classList.add('go'); ghost.classList.remove('on'); setTimeout(function () { ghost.classList.remove('go'); }, 1500); }
    if (wOn) { wOn = false; whisper.classList.remove('on'); }
  }
  /* 귀엣말 — 오래 머물면 커서 엽헤 그들의 말이 떠오름 */
  var WORDS = ['희게, 더 희게', '한 사람의 흰 것으로', '쉰세 곳', '물과 불의 심판', '대원님', '바치시오'];
  var whisper = document.createElement('div'); whisper.className = 'bb-whisper'; whisper.setAttribute('aria-hidden', 'true');
  document.body.appendChild(whisper);
  var wAt = -1e9, wOn = false, wi = 0;
  if (!touch && !calm) setInterval(function () {
    var now = performance.now(), idle = now - last;
    if (!inDark()) return;
    if (idle > 7000 && !ghostOn && now - ghostAt > 45000) {
      ghostAt = now; ghostOn = true;
      ghost.className = 'bb-ghost ' + (mx > innerWidth / 2 ? 'l' : 'r');
      requestAnimationFrame(function () { ghost.classList.add('on'); });
    }
    if (idle > 13000 && !wOn && now - wAt > 30000) {
      wAt = now; wOn = true;
      whisper.textContent = WORDS[wi++ % WORDS.length];
      whisper.style.left = Math.min(innerWidth - 260, mx + 34) + 'px';
      whisper.style.top = Math.max(20, my - 46) + 'px';
      requestAnimationFrame(function () { whisper.classList.add('on'); });
      setTimeout(function () { if (wOn) { wOn = false; whisper.classList.remove('on'); } }, 7000);
    }
  }, 1000);

  /* ── 장부 : 임명장을 다 보고 나면, 「某」가 하나씩 「白」으로 ── */
  function onClass(el, cls, fn) {
    if (!el) return; if (el.classList.contains(cls)) { fn(); return; }
    var mo = new MutationObserver(function () { if (el.classList.contains(cls)) { mo.disconnect(); fn(); } });
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
  }
  onClass($('#ledger'), 'all', function () { setTimeout(function () { $('#ledger').classList.add('white'); }, 3500); });

  /* ── 땅 : 다 세고 나면, 수가 하나로 머물지 안음 ── */
  (function () {
    var big = $('.lc-big'); if (!big) return; var sec = big.closest('section'), alts = $$('.alt', big), k = -1;
    onClass(sec, 'counted', function () {
      setTimeout(function step() {
        k++; var n = k % (alts.length + 1);
        alts.forEach(function (a, j) { a.classList.toggle('on', j === n - 1); });
        big.classList.add('cycling'); big.classList.toggle('home', n === 0);
        setTimeout(step, n === 0 ? 7000 : 4200);
      }, 5000);
    });
  })();

  /* ── 바람 소리 : 축음긔를 켜 두면, 어두운 칸에서 낮게 깔림 ── */
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
      g = ac.createGain(); g.gain.value = 0;
      src.connect(lp); lp.connect(g); g.connect(ac.destination); src.start(); lfo.start();
    }
    function level() {
      if (!ac) return; var on = !bgm.paused, t = ac.currentTime;
      g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(on ? (inDark() ? 0.09 : 0.03) : 0, t, 1.6);
    }
    bgm.addEventListener('play', function () { build(); if (ac.state === 'suspended') ac.resume(); level(); });
    bgm.addEventListener('pause', level);
    window.addEventListener('scroll', function () { if (ac) level(); }, { passive: true });
  })();
})();
