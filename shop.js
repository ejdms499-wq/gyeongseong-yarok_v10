/* 경성야록 상점 — 옛말↔오늘말 · 진열장 칸 고르기 · 실제 광고 사진이 있으면 바꿔 끼우기 */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hover = window.matchMedia && matchMedia('(hover: hover)').matches;
  function gloss(el, on) {
    if (!el.dataset.ko) return;
    if (on) { if (el.dataset.old == null) el.dataset.old = el.innerHTML; el.innerHTML = el.dataset.ko; el.classList.add('gloss'); }
    else if (el.dataset.old != null) { el.innerHTML = el.dataset.old; el.classList.remove('gloss'); }
  }
  if (hover) {
    document.addEventListener('mouseover', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, true); });
    document.addEventListener('mouseout', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, false); });
  } else {
    document.addEventListener('click', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h) gloss(h, !h.classList.contains('gloss')); });
  }
  /* 진열장 칸 */
  $$('.sp-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.dataset.cat;
      $$('.sp-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
      $$('.sp-grid .vt').forEach(function (v) { v.hidden = !(c === '전부' || v.dataset.cat === c); });
    });
  });
  /* assets/ads/아이디.png|jpg 가 있으면 그 칸은 실제 지면 광고 사진으로 */
  $$('.vt-scan[data-src]').forEach(function (img) {
    var b = img.dataset.src;
    var t = function (e) { var i = new Image(); i.onload = function () { img.src = b + e; var v = img.closest('.vt'); v.classList.add('has-scan'); if (i.naturalWidth / i.naturalHeight > 1.7) v.classList.add('wide'); }; i.onerror = function () { if (e === '.png') t('.jpg'); }; i.src = b + e; };
    t('.png');
  });
  /* 오늘 날짜 (머리) */
  var td = document.querySelector('.t-date'); if (td) td.style.visibility = 'hidden';
})();
