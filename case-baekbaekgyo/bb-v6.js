/* 경성야록 · 백백교 판 6 — 영화처럼, 천천히
   흰 종이(눌러야만) · 벼슬 사다리 · 찢겨 흐터진 한 집 · 그 밤(스크롤 장면) · 세는 땅 · 병
   (번쩍임 없음 · 모든 변화는 1초 넘게 천천히) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function H(o, k) { return k && k !== o ? '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>' : '<span class="hj" tabindex="0">' + o + '</span>'; }
  function play(id, v) { var a = document.getElementById(id); if (!a) return; try { a.currentTime = 0; a.volume = v || 0.4; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  function exists(src, ok) { var i = new Image(); i.onload = function () { ok(src); }; i.src = src; }
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function zoomK() { return parseFloat(getComputedStyle(document.documentElement).zoom) || 1; }

  /* ── 一 흰 종이 : 눌러야만 들춰짐 ── */
  (function () {
    var sec = $('#obit'), box = sec && $('.ob6', sec); if (!box) return;
    var busy = false, T = [];
    function clear() { T.forEach(clearTimeout); T = []; }
    function wait(ms) { busy = true; T.push(setTimeout(function () { busy = false; }, calm ? 0 : ms)); }
    /* 1 들춤 → 글이 다 써지면 「다 읽으셧소?」 · 2 독자가 누르면 → 먹이 번지고 흰 칠이 덮음 · 3 다시 누르면 처음으로 */
    function lift() {
      clear(); wait(7400);
      sec.classList.add('lifted'); play('sfxWhoosh', .3);
      T.push(setTimeout(function () { sec.classList.add('inked'); }, calm ? 0 : 2600));
      T.push(setTimeout(function () { sec.classList.add('ready'); }, calm ? 0 : 7400));
    }
    function wash() {
      clear(); wait(9000);
      sec.classList.remove('ready'); sec.classList.add('bleed');
      T.push(setTimeout(function () { sec.classList.add('washed'); play('sfxWhoosh', .18); }, calm ? 0 : 2800));
    }
    function cover() {
      clear(); wait(3000);
      sec.classList.remove('washed', 'bleed', 'inked', 'ready');
      T.push(setTimeout(function () { sec.classList.remove('lifted'); }, 600));
    }
    function toggle() {
      if (busy) return;
      if (!sec.classList.contains('lifted')) lift();
      else if (sec.classList.contains('ready')) wash();
      else if (sec.classList.contains('washed')) cover();
    }
    box.addEventListener('click', function (e) { if (e.target.closest('.hj')) return; toggle(); });
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  })();

  /* ── 二 벼슬 사다리 ── */
  (function () {
    var sec = $('#ledger'), wrap = sec && $('.lg6', sec); if (!wrap) return;
    var GIVE = ['논밭', '집', '모은 돈', '패물', '가진 것 전부'], POST = ['경찰서장', '군수', '도지사', '참의', '대신'];
    var btn = $('.l6-give', wrap), gv = $('.gv', btn), slip = $('.l6-slip', wrap), n = 0;
    function rung(k) { return $('.l6-rungs li[data-k="' + k + '"]', wrap); }
    var LB = ['논밭을', '집을', '모은 돈을', '패물을', '가진 것 전부를'];
    function label() { if (n < GIVE.length) gv.innerHTML = H(LB[n] + ' 바치시압', LB[n] + ' 바치기'); }
    label();
    btn.addEventListener('click', function () {
      if (n >= GIVE.length || wrap.classList.contains('done')) return;
      var li = rung(n); $('.g', li).innerHTML = H(GIVE[n]); li.classList.add('on');
      $('.sl-b', slip).innerHTML = H('독립이 이루어지는 날,<br>그대를 <b>' + POST[n] + '</b>에 임명함.', '독립이 이루어지는 날,<br>그대를 <b>' + POST[n] + '</b>에 임명한다.');
      slip.classList.remove('new'); void slip.offsetWidth; slip.classList.add('new'); slip.dataset.lv = n + 1;
      play('sfxBell', .28); n++;
      if (n < GIVE.length) { label(); return; }
      wrap.classList.add('done'); btn.disabled = true;
      gv.innerHTML = H('더 바칠 것이 업소', '더 바칠 것이 없다');
      setTimeout(function () {
        var d = rung(5); d.classList.add('on');
        var g = $('.g', d), p = $('.p', d), w = '딸', k = 0;
        (function wr() { if (k < w.length) { g.textContent = w.slice(0, ++k); setTimeout(wr, 900); } })();
        setTimeout(function () { p.textContent = '—'; d.classList.add('blank'); }, 2200);
      }, 2400);
      setTimeout(function () { wrap.classList.add('void'); gv.innerHTML = H('임명장은 — 한 장도 지켜지지 아넛소', '임명장은 — 한 장도 지켜지지 않았다'); }, 6200);
    });
  })();

  /* ── 三 흐터진 한 집 : 한 장의 그림자가 네 조각으로 ── */
  (function () {
    var sec = $('#house'), st = sec && $('.hs6', sec); if (!st) return;
    var say = $('.hs-say', sec), go = $('.hs-go', sec), reset = $('.hs-reset', sec);
    var S = $$('.h6-s', st), step = 0;
    exists('./img/mj/bb_family.jpg', function (src) { st.style.setProperty('--fam', 'url(' + src + ')'); st.classList.add('fam'); });
    exists('./img/mj/bb_watcher.jpg', function (src) { st.style.setProperty('--wat', 'url(' + src + ')'); st.classList.add('wat'); });
    /* 찢긴 가장자리 : 점 수가 같은 다각형이라 천천히 변함 */
    function edge(torn) {
      var N = 14, l = [], r = [], j = function () { return torn ? (Math.random() * 4.5).toFixed(2) : 0; };
      for (var i = 0; i <= N; i++) { var y = (i / N * 100).toFixed(2); r.push((100 - j()) + '% ' + y + '%'); }
      for (var k = N; k >= 0; k--) { var y2 = (k / N * 100).toFixed(2); l.push(j() + '% ' + y2 + '%'); }
      return 'polygon(' + r.concat(l).join(',') + ')';
    }
    S.forEach(function (s) { $('.h6-vis', s).style.clipPath = edge(false); });
    function setStep(n) { step = n; st.dataset.step = n; }
    go.addEventListener('click', function () {
      if (step !== 0) return; setStep(1); go.hidden = true; play('sfxWhoosh', .25);
      S.forEach(function (s, i) { setTimeout(function () { $('.h6-vis', s).style.clipPath = edge(true); s.classList.add('torn'); }, i * 380); });
      say.innerHTML = H('한 집이 네 조각으로 찌져졋소. 딸은 — 대원님 곁으로.', '한 집이 네 조각으로 찢어졌다. 딸은 — 교주 곁으로.');
      setTimeout(function () {
        setStep(2); S.forEach(function (s) { if (!s.classList.contains('far')) s.disabled = false; });
        say.innerHTML = H('이제 — 한 사람을 눌러, 떠나게 해 보시압.', '이제 — 한 사람을 눌러, 떠나게 해 보세요.');
      }, 3400);
    });
    S.forEach(function (s) {
      s.addEventListener('click', function () {
        if (step !== 2) return; setStep(3);
        S.forEach(function (x) { x.disabled = true; });
        s.classList.add('leave'); play('sfxWhoosh', .2);
        setTimeout(function () {
          $('.h6-st', s).innerHTML = H('벽력사가 맛텃소', '벽력사가 맡았다');
          S.forEach(function (x, i) { if (x !== s) setTimeout(function () { x.classList.add('hostage'); $('.h6-st', x).innerHTML = H('볼모', '볼모'); }, 700 + i * 650); });
          st.classList.add('tight');
          say.innerHTML = H('떠나려는 이는 사라졋소. 남은 식구는 — 볼모가 되엇소.', '떠나려는 사람은 사라졌다. 남은 가족은 — 볼모가 되었다.');
          reset.hidden = false; sec.classList.add('told');
        }, 2600);
      });
    });
    reset.addEventListener('click', function () {
      setStep(0); st.classList.remove('tight'); go.hidden = false; reset.hidden = true;
      S.forEach(function (s) { s.classList.remove('leave', 'hostage', 'torn'); s.disabled = true; $('.h6-vis', s).style.clipPath = edge(false); $('.h6-st', s).textContent = ''; });
      say.innerHTML = H('방석 네 장 — 한 집 식구요.', '방석 네 장 — 한 집 식구다.');
    });
  })();

  /* ── 四 그 밤 : 스크롤로 넘기는 장면 + 시간 줄 ── */
  (function () {
    var sec = $('#night'), track = sec && $('.n6-track', sec); if (!track) return;
    var CAMS = [[1.03, 1.14, -1.5, 0, 0], [1.04, 1.16, 1.5, -1, 0], [1.08, 1.3, 0, -3, 0], [1.1, 1.2, 2, 0, -1.4], [1.04, 1.18, -2, 1, 0], [1.02, 1.12, 0, 1.5, 0], [1.05, 1.15, 1.5, 0, 0], [1.02, 1.1, 0, -1, 0]];
    var shots = [], subs = [], dots = [], N = 0, cur = -1, raf = 0, fill = $('.n6-tl-fill', sec), sp = -1;
    var veil = document.createElement('div'); veil.className = 'n6-fade'; veil.setAttribute('aria-hidden', 'true'); $('.n6-stick', sec).appendChild(veil);
    function build() {
      shots = $$('.n6-i', sec); subs = $$('.n6-sub', sec); dots = $$('.n6-tl li', sec); N = shots.length;
      track.style.height = 'calc(' + (N * 88 + 110) + 'vh / var(--ykz, 1))';
      shots.forEach(function (im, k) { im.dataset.k = k; });
      dots.forEach(function (d, k) { d.style.setProperty('--t', N > 1 ? (k / (N - 1)) : 0); $('button', d).onclick = function () { go(k); }; });
      sec.classList.add('ready'); render();
    }
    function drop(b) { [$('.n6-i[data-b="' + b + '"]', sec), $('.n6-sub[data-b="' + b + '"]', sec), $('.n6-tl li[data-b="' + b + '"]', sec)].forEach(function (e) { if (e) e.remove(); }); }
    /* 그림이 아직 업는 장면은 빼고 — 「prev」는 앞 장면의 자막을 대신함 */
    var opt = $$('.n6-i[data-miss]', sec), left = opt.length;
    function done() { if (--left <= 0) build(); }
    if (!left) build();
    opt.forEach(function (im) {
      var ok = false, t = new Image();
      function miss() {
        if (ok) return; ok = true; var b = im.dataset.b;
        if (im.dataset.miss === 'prev') {
          var sub = $('.n6-sub[data-b="' + b + '"]', sec), prev = sub && sub.previousElementSibling;
          if (prev) { prev.innerHTML = sub.innerHTML; var pd = $('.n6-tl li[data-b="' + prev.dataset.b + '"] span', sec), md = $('.n6-tl li[data-b="' + b + '"] span', sec); if (pd && md) pd.innerHTML = md.innerHTML; }
        }
        drop(b); done();
      }
      t.onload = function () { if (ok) return; ok = true; done(); };
      t.onerror = miss; setTimeout(miss, 4000); t.src = im.getAttribute('src');
    });
    function prog() {
      var r = track.getBoundingClientRect(), vh = innerHeight / zoomK();
      var k = r.height / track.offsetHeight || 1, tot = track.offsetHeight - vh; if (tot <= 0) return 0;
      return Math.max(0, Math.min(1, (-r.top / k) / tot));
    }
    function go(k) {
      var r = track.getBoundingClientRect(), z = r.height / track.offsetHeight || 1, vh = innerHeight / zoomK();
      var y = scrollY + r.top + (.04 + .84 * (k + .35) / N) * (track.offsetHeight - vh) * z;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    function render() {
      raf = 0; if (!N) return;
      var tp = prog(); if (sp < 0 || calm) sp = tp; sp += (tp - sp) * .14; if (Math.abs(tp - sp) > .0004) ask();
      /* 앞 6% · 뒤 10% 는 검정으로 열고 닫음 — 끈적임이 풀릴 때 끊기지 안케 */
      var edge = Math.min(1, sp / .06, (1 - sp) / .1); veil.style.opacity = (1 - Math.max(0, edge)).toFixed(3);
      var p = Math.max(0, Math.min(1, (sp - .04) / .84)), x = p * N, i = Math.min(N - 1, Math.floor(x)), f = x - i;
      shots.forEach(function (im, k) {
        var c = CAMS[k % CAMS.length], t = k === i ? f : (k < i ? 1 : 0), s = c[0] + (c[1] - c[0]) * t;
        var o = k === i ? (f > .8 && k < N - 1 ? 1 - (f - .8) / .2 : 1) : (k === i + 1 && f > .8 ? (f - .8) / .2 : 0);
        im.style.opacity = o.toFixed(3);
        im.style.transform = 'translate(' + (c[2] * t).toFixed(2) + '%,' + (c[3] * t).toFixed(2) + '%) scale(' + s.toFixed(4) + ') rotate(' + (c[4] * t).toFixed(2) + 'deg)';
      });
      var d = (f > .9 && i < N - 1) ? i + 1 : i;
      var dawn = !!(shots[d] && /door4|raid|ban/.test(shots[d].getAttribute('src')));
      sec.classList.toggle('cold', dawn);
      if (fill) fill.style.setProperty('--p', p.toFixed(4));
      sec.classList.toggle('started', p > .01);
      if (d !== cur) {
        cur = d;
        subs.forEach(function (s, k) { s.classList.toggle('on', k === d); });
        dots.forEach(function (o, k) { o.classList.toggle('on', k === d); o.classList.toggle('past', k < d); });
        if (p > .01 && p < .99) play('sfxWhoosh', .1);
      }
    }
    function ask() { if (!raf) raf = requestAnimationFrame(render); }
    window.addEventListener('scroll', ask, { passive: true }); window.addEventListener('resize', ask);
  })();

  /* ── 七 땅 : 다섯을 세면 — 산비탈이 스스로 세어 314에 닿고, 수는 끗내 머물지 못함 ── */
  (function () {
    var sec = $('#land'), fig = sec && $('.l6w', sec); if (!fig) return;
    var ol = $('.l6-marks', fig), num = $('#ldCount'), alt = $('#ldAlt'), altS = $('#ldAltS'), n = 0, auto = false;
    var TARGET = 314, ALTS = [[380, '동아일보 류월 구일자'], [346, '동아일보 십일월 십칠일자'], ['350여', '또 다른 긔록'], [314, '뒤에 가장 흔히 적히는 수']];
    function mark(x, y, faint) {
      n++; num.textContent = n;
      var li = document.createElement('li'); if (faint) li.className = 'faint';
      li.style.left = x + '%'; li.style.top = y + '%';
      li.innerHTML = '<i></i>' + (faint && n % 7 ? '' : '<span>' + n + '</span>');
      ol.appendChild(li); requestAnimationFrame(function () { requestAnimationFrame(function () { li.classList.add('on'); }); });
    }
    function selfCount() {
      if (auto) return; auto = true; sec.classList.add('self');
      var t0 = performance.now(), from = n, T = calm ? 0 : 9000;
      (function step(t) {
        var k = T ? Math.min(1, (t - t0) / T) : 1, e = k * k * (3 - 2 * k), want = Math.round(from + (TARGET - from) * e);
        while (n < want) mark((3 + Math.random() * 94).toFixed(2), (30 + Math.random() * 62).toFixed(2), true);
        if (k < 1) requestAnimationFrame(step); else unsettled();
      })(t0);
    }
    function unsettled() {
      sec.classList.add('done'); var i = 0;
      (function next() {
        var a = ALTS[i % ALTS.length]; i++;
        alt.parentNode.classList.remove('on');
        setTimeout(function () { alt.textContent = a[0]; altS.textContent = a[1]; alt.parentNode.classList.add('on'); }, 1200);
        if (i <= ALTS.length) setTimeout(next, 4200); else setTimeout(function () { sec.classList.add('last'); }, 2400);
      })();
    }
    fig.addEventListener('click', function (e) {
      if (e.target.closest('a, .hj') || auto) return;
      var r = fig.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
      if (y < 18 || y > 96) return;
      mark(x.toFixed(2), y.toFixed(2), false); sec.classList.add('counting'); play('sfxBell', .12);
      if (n >= 5) setTimeout(selfCount, 900);
    });
  })();

  /* ── 조서 : 먹줄을 하나씩 걷음 ── */
  (function () {
    var sec = $('#dossier'); if (!sec) return;
    var li = $$('.ds-list li', sec), n = 0;
    li.forEach(function (l) {
      $('.ds-ink', l).addEventListener('click', function () {
        if (l.classList.contains('open')) return; l.classList.add('open'); n++; play('sfxWhoosh', .12);
        if (n === li.length) setTimeout(function () { sec.classList.add('all'); }, 2400);
      });
    });
  })();

  /* ── 병 : 스크롤만 내려도 — 다가가고, 74년이 흐르고, 재가 되어 하얘짐 ── */
  (function () {
    var sec = $('#jar'); if (!sec) return;
    var fig = $('.jr-pic', sec), grid = $('.jr-grid', sec), run = $('.jr-run', sec), dk = $('.jr-dark', sec);
    var yEl = $('#jrYear6'), aEl = $('#jrAgo6'), items = $$('.jr-list li', sec);
    var cv = $('.jr-cv', sec), cx = cv.getContext('2d'), W = 0, Hh = 0, P = [], ash = false, raf = 0;
    var YR = [1937, 1945, 1950, 1960, 2010, 2011];
    fig.addEventListener('pointermove', function (e) {
      var r = fig.getBoundingClientRect(); if (!r.width) return;
      dk.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      dk.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
    function size() { W = cv.width = fig.offsetWidth; Hh = cv.height = fig.offsetHeight; }
    function seed() { P = []; for (var i = 0; i < 140; i++) P.push({ x: W * (.3 + Math.random() * .4), y: Hh * (.45 + Math.random() * .4), s: Math.random(), z: .6 + Math.random() * 1.8, a: Math.random() * 6 }); }
    function loop() {
      if (!W) size(); cx.clearRect(0, 0, W, Hh);
      if (ash) P.forEach(function (p) {
        p.y -= (.3 + p.s * .9); p.x += Math.sin(p.y * .02 + p.a) * .4;
        if (p.y < -10) { p.y = Hh * (.6 + Math.random() * .3); p.x = W * (.3 + Math.random() * .4); }
        var al = Math.max(0, Math.min(1, p.y / Hh + .25));
        cx.fillStyle = 'rgba(246,241,230,' + (.9 * al).toFixed(3) + ')'; cx.beginPath(); cx.arc(p.x, p.y, p.z, 0, 7); cx.fill();
      });
      requestAnimationFrame(loop);
    }
    size(); requestAnimationFrame(loop); window.addEventListener('resize', size);
    function prog() {
      var rr = run.getBoundingClientRect(), gh = grid.getBoundingClientRect().height, k = rr.height / Math.max(1, run.offsetHeight) || 1;
      var top0 = (parseFloat(getComputedStyle(grid).top) || 0) * k;
      return Math.max(0, Math.min(1, (top0 + gh - rr.top) / Math.max(1, rr.height)));
    }
    var sp = -1, fin = $('#finale');
    var veil = document.createElement('div'); veil.className = 'bb-veil'; veil.setAttribute('aria-hidden', 'true'); document.body.appendChild(veil);
    function render() {
      raf = 0; var tp = prog(); if (sp < 0 || calm) sp = tp; sp += (tp - sp) * .12; if (Math.abs(tp - sp) > .0004) ask();
      var p = sp;
      sec.style.setProperty('--p', p.toFixed(4));
      var k = Math.min(1, p / .72), yr = Math.round(1937 + 74 * k);
      yEl.textContent = yr; aEl.textContent = yr - 1937;
      items.forEach(function (li, i) { li.classList.toggle('on', yr >= YR[i]); });
      sec.classList.toggle('counted', yr >= 2011);
      if (p > .74 && !ash) { size(); seed(); ash = true; sec.classList.add('ash'); }
      if (p < .66 && ash) { ash = false; sec.classList.remove('ash'); }
      sec.classList.toggle('started', p > .02);
      /* 화면 전체가 흰빛으로 — 흰 지면이 화면을 다 채우면 막은 조용히 걷힘 (거꾸로 올라가도 같은 길) */
      var v = Math.max(0, Math.min(1, (p - .7) / .26));
      if (fin) {
        var fr = fin.getBoundingClientRect(), vh = innerHeight;
        if (fr.top < vh * .15) v = Math.min(v, Math.max(0, (fr.top + vh * .35) / (vh * .5)));
        if (fr.top < vh * .15 && p >= .99) v = Math.max(0, Math.min(1, (fr.top + vh * .35) / (vh * .5)));
      }
      veil.style.opacity = v.toFixed(3); document.body.classList.toggle('bb-veiled', v > .02);
    }
    function ask() { if (!raf) raf = requestAnimationFrame(render); }
    window.addEventListener('scroll', ask, { passive: true }); window.addEventListener('resize', ask); render();
  })();
})();
