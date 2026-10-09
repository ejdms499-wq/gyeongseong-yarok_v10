/* 본지 광고면 — 상점 · 상영관 문은 종이가 덮이며 넘어감 (심인 문은 nr-main.js 가 맡음) */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('.am-shop, .am-film, .am-real'), function (a) {
    a.addEventListener('click', function (e) {
      if (reduce) return;
      e.preventDefault();
      var dark = a.classList.contains('am-film');
      var w = document.createElement('div'); w.className = 'sk-wipe'; if (dark) w.style.background = '#0b0907';
      document.body.appendChild(w);
      requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add('on'); }); });
      setTimeout(function () { location.href = a.getAttribute('href'); }, dark ? 900 : 560);
    });
  });
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) [].forEach.call(document.querySelectorAll('.sk-wipe'), function (w) { w.remove(); }); });
})();
