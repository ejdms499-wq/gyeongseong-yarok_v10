/* 경성야록 상점 v4 — 욕망의 다섯 서랍 · 광고만 켜기 · 속간한 날 · 경성 분양 공고 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hj(o, k) { return '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>'; }

  /* ── 욕망의 다섯 서랍 ── */
  (function () {
    var sec = $('#drawers'); if (!sec) return;
    var fronts = $$('.dr-row .dr-front', sec), lock = $('.dr-lock', sec), open = null;
    function show(k) {
      k = String(k); var will = open !== k; open = will ? k : null;
      $$('.dr-tray', sec).forEach(function (t) {
        if (will && t.dataset.k === k) { t.hidden = false; requestAnimationFrame(function () { t.classList.add('on'); }); }
        else { t.classList.remove('on'); t.hidden = true; }
      });
      fronts.concat([lock]).forEach(function (f) { var on = will && (f.dataset.k || 'lock') === k; f.classList.toggle('out', on); f.setAttribute('aria-expanded', on); });
    }
    fronts.forEach(function (f) { f.addEventListener('click', function () { show(f.dataset.k); }); });
    /* 잠긴 서랍: 마우스를 대고 1.6초 기다리면 열림 (누르거나 키보드로도 열림) */
    var timer = 0, unlocked = false, at = 0;
    function unlock() { if (unlocked) return; unlocked = true; at = Date.now(); lock.classList.add('open'); show('lock'); }
    lock.addEventListener('pointerenter', function () { if (unlocked) return; lock.classList.add('wait'); timer = setTimeout(unlock, 1600); });
    lock.addEventListener('pointerleave', function () { clearTimeout(timer); lock.classList.remove('wait'); });
    lock.addEventListener('click', function () { if (!unlocked) unlock(); else if (Date.now() - at > 900) show('lock'); });
  })();

  /* ── 광고만 켜기 (1938.7.28) ── */
  (function () {
    var sec = $('#oneday'), box = $('#od-data'); if (!sec || !box) return;
    var P = JSON.parse(box.textContent), i = 0, lit = false;
    var tabs = $('.od-tabs', sec), img = $('.od-page img', sec), path = $('.od-mask path', sec), boxes = $('.od-boxes', sec);
    var cap = $('.od-cap', sec), num = $('.od-n', sec), sw = $('.od-switch', sec), end = $('.od-end', sec);
    tabs.innerHTML = P.map(function (p, k) { return '<li><button type="button" data-k="' + k + '"><img alt="" src="assets/ads/d38/' + p.k + '.jpg"><span>' + p.n.replace(' · ', '<br>') + '</span>' + (p.r.length ? '' : '<em>' + hj('광고 업슴', '광고 없음') + '</em>') + '</button></li>'; }).join('');
    function draw() {
      var p = P[i];
      img.src = 'assets/ads/d38/' + p.k + '.jpg'; img.alt = '동아일보 1938년 7월 28일 ' + p.n;
      path.setAttribute('d', 'M0 0H100V100H0Z' + p.r.map(function (r) { return 'M' + r[0] + ' ' + r[1] + 'h' + r[2] + 'v' + r[3] + 'h-' + r[2] + 'Z'; }).join(''));
      boxes.innerHTML = p.r.map(function (r, k) { return '<i style="left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%;--k:' + k + '"></i>'; }).join('');
      num.innerHTML = '<b>' + p.n + '</b>' + hj('광고 ' + (p.r.length || '업슴') + (p.r.length ? ' 칸' : ''), '광고 ' + (p.r.length ? p.r.length + '칸' : '없음'));
      cap.innerHTML = hj(p.o, p.ko);
      end.hidden = i !== P.length - 1;
      $$('button', tabs).forEach(function (b, k) { b.classList.toggle('on', k === i); });
      $('.od-prev', sec).disabled = i === 0; $('.od-next', sec).disabled = i === P.length - 1;
      sec.classList.remove('turn'); void sec.offsetWidth; sec.classList.add('turn');
    }
    function light(v) { lit = v; sec.classList.toggle('lit', v); sw.setAttribute('aria-pressed', v); }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (b) { i = +b.dataset.k; draw(); } });
    $('.od-prev', sec).addEventListener('click', function () { if (i > 0) { i--; draw(); } });
    $('.od-next', sec).addEventListener('click', function () { if (i < P.length - 1) { i++; draw(); } });
    sw.addEventListener('click', function () { light(!lit); });
    draw();
  })();

  /* ── 그날의 아래칸 · 속간한 날: 빈 종이에서 지면이 찍혀 나옴 ── */
  (function () {
    var rows = $$('.ud-row.revive'); if (!rows.length) return;
    if (!('IntersectionObserver' in window)) { rows.forEach(function (r) { r.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.35 });
    rows.forEach(function (r) { io.observe(r); });
  })();

  /* ── 경성 분양 공고 ── */
  (function () {
    var sec = $('#bunyang'), box = $('#bn-data'); if (!sec || !box) return;
    var D = JSON.parse(box.textContent), hl = $('.bn-hl', sec), n = $('.bn-n', sec), o = $('.bn-o', sec);
    function pick(k) {
      var d = D[k]; if (!d) return;
      $$('.bn-pin', sec).forEach(function (p) { p.classList.toggle('on', p.dataset.k === k); });
      hl.style.left = d.x + '%'; hl.style.width = d.w + '%'; sec.classList.add('picked');
      n.innerHTML = hj(d.n, d.nk); o.innerHTML = hj(d.o, d.ko);
    }
    $$('.bn-pin', sec).forEach(function (p) {
      p.addEventListener('click', function () { pick(p.dataset.k); });
      p.addEventListener('mouseenter', function () { pick(p.dataset.k); });
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p.dataset.k); } });
    });
  })();
})();
