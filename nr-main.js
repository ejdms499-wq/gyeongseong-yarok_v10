/* 본지 06 편집국 칸 — 등잔 줄을 당김 → 편집국에 불이 켜짐 → 등불 자리로 동그랗게 닫히며 편집국으로
   + 편집국에서 실린 기사 3편 (이 컴퓨터 보관함) */
(function () {
  'use strict';
  var plate = document.getElementById('dkPlate'), go = document.getElementById('dkGo');
  if (!plate) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GO = 'newsroom.html', busy = false;
  function enter(e) {
    if (e) e.preventDefault();
    if (busy) return; busy = true;
    if (reduce) { location.href = GO; return; }
    plate.classList.add('pull');                                           // 0.0 줄을 당김
    setTimeout(function () { plate.classList.remove('pull'); plate.classList.add('lit'); }, 260);   // 0.26 탁 — 불이 켜짐
    setTimeout(function () {                                               // 1.6 등불 자리로 조여 듦
      var iris = document.getElementById('irisOut'), r = plate.getBoundingClientRect();
      if (!iris) { location.href = GO; return; }
      document.body.appendChild(iris);
      iris.style.left = (r.left + r.width * .79) + 'px'; iris.style.top = (r.top + r.height * .36) + 'px';
      iris.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { iris.classList.add('close'); }); });
      setTimeout(function () { location.href = GO; }, 1350);
    }, 1600);
  }
  plate.addEventListener('click', enter);
  if (go) go.addEventListener('click', enter);
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) { busy = false; plate.classList.remove('lit', 'pull'); var i = document.getElementById('irisOut'); if (i) { i.classList.remove('close'); i.hidden = true; } } });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function dot(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? (+m[1]) + '. ' + (+m[2]) + '. ' + (+m[3]) : esc(d); }
  if (!window.NR) return;
  NR.all().then(function (all) {
    var pub = all.filter(function (a) { return a.status === 'published'; });
    if (!pub.length) return;
    document.getElementById('dkList').innerHTML = pub.slice(0, 3).map(function (a) {
      return '<li><a href="newsroom.html?id=' + encodeURIComponent(a.id) + '"><time>' + dot(a.date) + '</time><b>' + esc(a.title) + '</b><em>' + esc(a.reporter ? a.reporter + ' 기자' : a.newspaper) + '</em></a></li>';
    }).join('');
  }).catch(function () {});
})();

/* 광고 ③ 심인 — 누르면 「당신을 차잣소」 → 종이가 덮이며 광고면으로 */
(function () {
  'use strict';
  var ad = document.getElementById('seekAd'); if (!ad) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  ad.addEventListener('click', function (e) {
    if (reduce) return;
    e.preventDefault();
    if (ad.classList.contains('got')) return;
    ad.classList.add('got');
    setTimeout(function () {
      var w = document.createElement('div'); w.className = 'sk-wipe'; document.body.appendChild(w);
      requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add('on'); }); });
      setTimeout(function () { location.href = ad.getAttribute('href'); }, 600);
    }, 1500);
  });
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) { ad.classList.remove('got'); var w = document.querySelector('.sk-wipe'); if (w) w.remove(); } });
})();
