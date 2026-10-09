/* 경성야록 상점 — 한 상품의 십오 년 (넘겨 보기) · 박람회 할인권 */
(function () {
  'use strict';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hj(o, k) { return '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>'; }

  var box = document.getElementById('yr-data');
  if (box) {
    var D = JSON.parse(box.textContent);
    var sec = document.getElementById('years');
    var pic = sec.querySelector('.yr-pic'), img = pic.querySelector('img');
    var d = sec.querySelector('.yr-d'), t = sec.querySelector('.yr-t'), o = sec.querySelector('.yr-o');
    var line = sec.querySelector('.yr-line'), frame = sec.querySelector('.yr-frame');
    var tr = 'aj', i = 0;
    var lab = function (it) { var p = it.d.split('.'); return p[0] + '.' + (+p[1]); };
    function build() {
      line.innerHTML = D[tr].map(function (it, k) {
        return '<li' + (it.src ? '' : ' class="end"') + '><button type="button" data-k="' + k + '"><i></i><span>' + lab(it) + '</span></button></li>';
      }).join('');
      Array.prototype.forEach.call(line.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { go(+b.dataset.k); }); });
    }
    function go(k) {
      var L = D[tr]; i = Math.max(0, Math.min(L.length - 1, k)); var it = L[i];
      var last = !it.src;
      frame.classList.add('turn');
      setTimeout(function () {
        if (it.src) { img.src = it.src; img.alt = '동아일보 ' + it.d + ' ' + it.p + ' 광고'; }
        pic.classList.toggle('void', last);
        d.textContent = it.d + (it.p ? ' · ' + it.p : '');
        t.textContent = it.t;
        o.innerHTML = hj(esc(it.o), it.k);
        frame.classList.remove('turn');
      }, 380);
      Array.prototype.forEach.call(line.querySelectorAll('li'), function (li, n) { li.classList.toggle('on', n === i); li.classList.toggle('past', n < i); });
      sec.classList.toggle('dusk', last);
      sec.querySelector('.yr-prev').disabled = i === 0;
      sec.querySelector('.yr-next').disabled = i === L.length - 1;
    }
    sec.querySelector('.yr-prev').addEventListener('click', function () { go(i - 1); });
    sec.querySelector('.yr-next').addEventListener('click', function () { go(i + 1); });
    Array.prototype.forEach.call(sec.querySelectorAll('.yr-tabs button'), function (b) {
      b.addEventListener('click', function () {
        tr = b.dataset.tr;
        Array.prototype.forEach.call(sec.querySelectorAll('.yr-tabs button'), function (x) { x.classList.toggle('on', x === b); });
        build(); go(0);
      });
    });
    sec.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); });
    build(); go(0);
  }

  /* 경성사건박람회 — 모든 관을 돌았으면 할인권 */
  var cp = document.querySelector('.sp-coupon');
  if (cp) {
    var HALLS = ['literature', 'music', 'stage', 'art'], st = [];
    try { var sv = JSON.parse(localStorage.getItem('gsyr-appendix-v1') || 'null'); if (sv && Array.isArray(sv.stamps)) st = sv.stamps; } catch (e) {}
    var n = HALLS.filter(function (h) { return st.indexOf(h) > -1; }).length;
    cp.hidden = false;
    cp.innerHTML = n >= HALLS.length
      ? '<b>' + hj('割引券', '할인권') + '</b>' + hj('박람회 네 관을 다 도신 손님이시구려. 할인권을 바닷소 — 감사하오.', '박람회 네 관을 모두 다녀오셨군요. 할인권 확인 — 감사합니다.')
      : hj('경성사건박람회 네 관을 다 돌면, 이 상뎜의 할인권을 드리오. (지금 ' + n + ' / 4 관)', '경성사건박람회 네 관을 모두 돌면 이 상점 할인권을 드립니다. (지금 ' + n + ' / 4관)');
    if (n >= HALLS.length) cp.classList.add('got');
  }
})();
