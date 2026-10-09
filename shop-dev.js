/* 상점 디벨롭 — 장 번호 · 지금 읽는 장 표시 · 진열장 12점만 먼저 */
(function () {
  'use strict';
  var nav = document.querySelector('.spx-jump'); if (!nav) return;
  var links = [].slice.call(nav.querySelectorAll('a'));
  links.forEach(function (a, i) { a.insertAdjacentHTML('afterbegin', '<i>' + (i + 1) + '</i>'); });
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function mark() {
    var y = window.innerHeight * .35, cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }
  window.addEventListener('scroll', mark, { passive: true }); mark();
  /* 진열장: 처음엔 12점 */
  var grid = document.querySelector('.sp-grid'); if (!grid) return;
  var items = [].slice.call(grid.querySelectorAll('.vt'));
  if (items.length > 12) {
    items.slice(12).forEach(function (v) { v.classList.add('more'); });
    grid.classList.add('folded');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'spx-more';
    b.innerHTML = '<span class="hj" data-ko="진열장 더 열기 · ' + (items.length - 12) + '점 더">진렬장 더 열기 · ' + (items.length - 12) + ' 뎜 더</span>';
    grid.parentNode.insertBefore(b, grid.nextSibling);
    b.addEventListener('click', function () { grid.classList.remove('folded'); b.remove(); });
    /* 칸(약 · 화장품 …)을 고르면 접기 해제 */
    [].forEach.call(document.querySelectorAll('.sp-tabs button'), function (t) { t.addEventListener('click', function () { if (t.dataset.cat !== '전부') { grid.classList.remove('folded'); if (b.parentNode) b.remove(); } }); });
  }
})();

/* 진열장 줄 맞춤 — 보이는 광고 수가 4로 나누어떨어지지 않으면, 가로로 가장 긴 광고부터 두 칸씩 차지 */
(function () {
  var grid = document.querySelector('.sp-grid'); if (!grid) return;
  var t = null;
  function cols() { return window.matchMedia('(max-width:980px)').matches ? 2 : 4; }
  function fit() {
    var all = [].slice.call(grid.querySelectorAll('.vt'));
    var folded = grid.classList.contains('folded');
    var vis = all.filter(function (v) { return !v.hidden && !(folded && v.classList.contains('more')); });
    var c = cols(), need = (c - vis.length % c) % c, pick = [];
    if (c === 4 && need) pick = vis.filter(function (v) { return +v.dataset.r > 1.15; }).sort(function (a, b) { return b.dataset.r - a.dataset.r; }).slice(0, need);
    all.forEach(function (v) { var w = pick.indexOf(v) > -1; if (v.classList.contains('wide') !== w) v.classList.toggle('wide', w); });
  }
  function later() { clearTimeout(t); t = setTimeout(fit, 80); }
  new MutationObserver(function (ms) {
    if (ms.some(function (m) { return m.attributeName === 'hidden' || m.target === grid; })) later();
  }).observe(grid, { subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  window.addEventListener('resize', later);
  fit();
})();
