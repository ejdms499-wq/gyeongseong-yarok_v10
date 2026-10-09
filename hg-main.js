/* 본지 07 독자 호외 v3 — 인쇄소 사진 속 빨랫줄 · 방금 찍은 호외(맨 앞, 떨어지듯 널림) + 예시
   호외를 누르면 인쇄소에서 그 호외를 펼쳐 봄 · 빈 곳(사진)을 누르면 인쇄소로 */
(function () {
  'use strict';
  var box = document.getElementById('rhgSheets'); if (!box) return;
  var room = document.getElementById('rhgMark');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function enc(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  var EX = [
    { style: 'classic', topic: 'daily', tone: 'funny', kick: '사회 · 독자 투고', head: '종로 야시장에 도깨비불이 나타나다', sub: '— 구경꾼 수백, 순사도 우슴을 참지 못하다', body: ['【경성】 엇저녁 종로 야시장 한복판에 파란 불덩이가 둥실 떠올라 장꾼들이 혼비백산하엿다.', '알고 보니 엿장수 김 씨가 새로 들여온 전등이엇다 한다.', '이 소문이 돌자 구경꾼이 몰녀 근처 엿장수만 큰 재미를 보앗다 한다.'], by: '투고 · 아무개생' },
    { style: 'horror', topic: 'mystery', tone: 'tense', kick: '괴담 · 자정 이후', head: '자정의 전차에 한 사람이 더 탓다', sub: '— 차장 「분명 셋이 내렷는데」', body: ['【경성】 자정 막차가 종점에 닷자 차장은 고개를 갸웃하엿다.', '네 사람이 탓는데 내린 이는 셋. 남은 자리에는 젓은 우산 하나만 노혀 잇섯다.', '밤길에 혼자 나서는 일은 삼가기를 바란다. 특히 자정 넘어서는.'], by: '투고 · 아무개생' },
    { style: 'breaking', topic: 'free', tone: 'funny', kick: '특보 · 속보', head: '고양이, 「ㄱ」 활자 물고 지붕 우로!', sub: '— 식자공 「그 뒤로 지면에 ㄱ이 모자라오」', body: ['【경성】 본보 식자실에서 먹색 고양이 한 마리가 「ㄱ」 활자를 물고 달아나 지붕 우에 올라앉앗다.', '식자공들이 사다리를 노앗스나 고양이는 달만 처다볼 뿐이엇다.', '자세한 소식은 다음 호외로 알리겟다.'], by: '투고 · 아무개생' }
  ];
  var ART = { mystery: 'assets/hogoe/art_mystery.jpg', daily: 'assets/hogoe/art_daily.jpg', history: 'assets/hogoe/art_history.jpg', free: 'assets/hogoe/art_free.jpg' };
  var mine = []; try { mine = JSON.parse(localStorage.getItem('yk-hogoe') || '[]') || []; } catch (e) {}
  var fresh = false; try { fresh = sessionStorage.getItem('yk-hogoe-fresh') === '1'; sessionStorage.removeItem('yk-hogoe-fresh'); } catch (e) {}
  var list = mine.slice(0, 2).map(function (m, i) { m.mine = 1; m.idx = i; return m; }).concat(EX).slice(0, 4);
  var X = list.length > 3 ? [.15, .38, .62, .85] : [.2, .5, .8], R = [-3, 2.2, -1.6, 2.8];
  box.innerHTML = list.map(function (m, i) {
    var href = m.mine ? 'hogoe.html?see=' + m.idx : 'hogoe.html#h=' + enc({ s: m.style, t: m.tone, p: m.topic, k: m.kick, h: m.head, u: m.sub, b: m.body, y: m.by });
    return '<a class="hs ' + esc(m.style) + (m.mine ? ' mine' : '') + (m.mine && i === 0 && fresh ? ' fresh' : '') + '" href="' + href + '" style="--r:' + R[i] + 'deg;--d:' + (i * .4) + 's" data-x="' + X[i] + '" aria-label="' + esc(m.head) + '">' +
      '<span class="hs-pin"></span><span class="hs-p"><span class="hs-tag">' + (m.mine ? '독자' : '예시') + '</span><span class="hs-mh"><b>경성야록</b><em>호외</em></span>' +
      '<span class="hs-h">' + esc(m.head) + '</span><span class="hs-art" style="background-image:url(' + (ART[m.topic] || ART.mystery) + ')"></span><span class="hs-cols"></span></span></a>';
  }).join('');
  var tally = document.getElementById('rhgTally');
  if (mine.length && tally) tally.innerHTML = '<span class="hj l" data-ko="오늘 밤 인쇄소 · 찍은 호외 ' + mine.length + '장">오늘 밤 인쇄소 · 찍은 호외 <b>' + mine.length + '</b>장</span>';
  if (mine.length) { var cap = document.getElementById('rhgCap'); if (cap) cap.innerHTML = '<span class="hj l" data-ko="인쇄소 · 재현 그림 · 맨 앞은 당신이 찍은 호외">인쇄소 · 재현 그림 · 맨 압흔 당신이 찍은 호외</span>'; }
  if (fresh) setTimeout(function () { document.getElementById('hogoe').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 600);

  function hang() {
    var W = room.clientWidth, H = room.clientHeight;
    [].forEach.call(box.children, function (a) {
      var x = +a.dataset.x, sw = a.offsetWidth, t = (x - .5) / .53;
      var y = -.14 * H + .34 * H * Math.sqrt(Math.max(0, 1 - t * t));
      a.style.left = (x * W - sw / 2) + 'px'; a.style.top = (y + 2) + 'px';
    });
  }
  hang(); window.addEventListener('resize', hang);
  if (document.fonts) document.fonts.ready.then(hang);

  /* 사진 · 「인쇄소로」 — 불이 확 밝아지고 종이가 덮이며 */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(e, href) {
    if (reduce) return;
    e.preventDefault(); e.stopPropagation();
    room.classList.add('press');
    setTimeout(function () {
      var w = document.createElement('div'); w.className = 'sk-wipe'; document.body.appendChild(w);
      requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add('on'); }); });
      setTimeout(function () { location.href = href; }, 540);
    }, 260);
  }
  room.addEventListener('click', function (e) { var a = e.target.closest('.hs'); go(e, a ? a.getAttribute('href') : 'hogoe.html'); });
  var g = document.getElementById('rhgGo'); if (g) g.addEventListener('click', function (e) { go(e, 'hogoe.html'); });
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) { room.classList.remove('press'); var w = document.querySelector('.sk-wipe'); if (w) w.remove(); } });
})();
