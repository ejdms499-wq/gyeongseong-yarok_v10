/* =========================================================================
   경성야록 · 광고첩 놀이 칸 (adcollection-play.js)
   자료는 adcollection-data.js 의 AD_QUIZ · AD_JUDGE · AD_ALIVE · AD_PRICE
   ========================================================================= */
(function () {
  var DIR = 'assets/adcollection/', SCRAP = 'yk-ad-scraps', MINE = 'yk-my-sheet';
  var ADS = window.ADS || [], BY = {};
  ADS.forEach(function (a) { BY[a.id] = a; });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var KNUM = ['영', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  function dateOf(a) { var d = a.date.split('-'); return d[0] + '.' + (+d[1]) + '.' + (+d[2]); }

  /* ── 보는 법 고르기 ── */
  var built = {};
  function setMode(m) {
    [].forEach.call(document.querySelectorAll('#modes button'), function (b) { b.setAttribute('aria-pressed', b.dataset.m === m); });
    [].forEach.call(document.querySelectorAll('.mode'), function (s) { s.classList.toggle('on', s.id === 'm-' + m); });
    if (!built[m] && BUILD[m]) { BUILD[m](); built[m] = true; }
    if (m === 'mine') drawTray();
    if (history.replaceState) history.replaceState(null, '', m === 'all' ? location.pathname : '#' + m);
  }
  $('#modes').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setMode(b.dataset.m); });

  var BUILD = {};

  /* ── 무엇을 팔까 ── */
  BUILD.quiz = function () {
    var box = $('#m-quiz'), list = shuffle(window.AD_QUIZ || []), i = 0, right = 0;
    function show() {
      if (i >= list.length) {
        var line = right === list.length ? '眼目이 밝소' : right >= list.length / 2 ? '제법이오' : '경성 사람은 아니시구려';
        box.innerHTML = '<div class="pl-end"><span class="pg">' + list.length + '장 중 ' + right + '장을 맞혓소</span><div class="big">' + line + '</div>' +
          '<p>그때 광고는 지금 눈으로 보면 엉뚱한 것을 팔앗소.<br>그림만 보고 맞히기는 쉽지 안소.</p>' +
          '<button type="button" class="pl-next" id="qzAgain">다시 하기</button></div>';
        $('#qzAgain').onclick = function () { list = shuffle(list); i = 0; right = 0; show(); };
        return;
      }
      var q = list[i], a = BY[q.id] || {};
      box.innerHTML =
        '<div class="pl-head"><h2>무엇을 팔까</h2><p>글자를 가리고 그림만 남겻소. 이 광고는 무엇을 팔앗겟소?</p><span class="pg">' + (i + 1) + ' / ' + list.length + '</span></div>' +
        '<div class="pl-body qz" id="qzBody">' +
          '<div class="pl-pic"><img class="part" src="' + DIR + 'q-' + q.id + '.jpg" alt="광고 그림 일부"><img class="full" src="' + DIR + q.id + '.jpg" alt="' + esc(a.title) + ' 광고 전체"><span class="cap" id="qzCap">그림만</span></div>' +
          '<div class="pl-side"><p class="pl-q">이 그림은<br>무엇을 팔던 광고요?</p>' +
            q.pick.map(function (p, k) { return '<button type="button" class="pl-opt" data-k="' + k + '"><i>' + '一二三四'[k] + '</i>' + esc(p) + '</button>'; }).join('') +
            '<div id="qzSay"></div></div></div>';
      [].forEach.call(box.querySelectorAll('.pl-opt'), function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, ok = k === q.ans; if (ok) right++;
          [].forEach.call(box.querySelectorAll('.pl-opt'), function (x) { x.disabled = true; if (+x.dataset.k === q.ans) x.classList.add('ok'); });
          if (!ok) b.classList.add('no');
          $('#qzBody').classList.add('shown'); $('#qzCap').textContent = dateOf(a) + ' · 동아일보';
          $('#qzSay').innerHTML = '<div class="pl-say"><small>' + (ok ? '맞앗소' : '아니오') + '</small>' + esc(q.say) + '</div>' +
            '<button type="button" class="pl-next" id="qzNext" style="margin-top:12px;float:right">' + (i + 1 < list.length ? '다음 광고 →' : '셈해 보기') + '</button>';
          $('#qzNext').onclick = function () { i++; show(); };
        };
      });
    }
    show();
  };

  /* ── 허위광고 단속반 ── */
  BUILD.judge = function () {
    var box = $('#m-judge'), list = shuffle(window.AD_JUDGE || []), i = 0, right = 0;
    function show() {
      if (i >= list.length) {
        box.innerHTML = '<div class="pl-end"><span class="pg">단속 ' + list.length + '건 중 ' + right + '건을 바로 보앗소</span>' +
          '<div class="big">' + (right >= list.length - 1 ? '名 團束官' : right >= list.length / 2 ? '見習 團束官' : '다시 보시오') + '</div>' +
          '<p>백 년 전 신문엔 병이 「全快」한다는 약 광고가 날마다 실렸소.<br>광고를 가려 보는 눈은 오늘 신문이 지켜야 할 몫이오.</p>' +
          '<p class="pl-note" style="margin-top:14px">※ 오늘 기준 풀이는 이해를 돕기 위한 것으로, 법률 판단이 아닙니다.</p>' +
          '<button type="button" class="pl-next" id="jdAgain">다시 단속하기</button></div>';
        $('#jdAgain').onclick = function () { list = shuffle(list); i = 0; right = 0; show(); };
        return;
      }
      var q = list[i], a = BY[q.id] || {};
      box.innerHTML =
        '<div class="pl-head"><h2>허위광고 단속반</h2><p>이 광고를 오늘 신문에 그대로 실으면 걸리겟소, 무사하겟소?</p><span class="pg">' + (i + 1) + ' / ' + list.length + '</span></div>' +
        '<div class="pl-body jd" id="jdBody">' +
          '<div class="pl-pic"><img src="' + DIR + q.id + '.jpg" alt="' + esc(a.title) + ' 광고">' +
            '<span class="stamp ' + (q.bad ? 'bad' : 'good') + '"><b>' + (q.bad ? '虛僞<br>誇大' : '無事<br>通過') + '</b><small>' + (q.bad ? '걸림' : '통과') + '</small></span>' +
            '<span class="cap">' + esc(dateOf(a)) + ' · 동아일보</span></div>' +
          '<div class="pl-side"><p class="pl-q">「' + esc(a.title) + '」</p><p class="pl-note" style="margin-top:-6px">' + esc(a.who) + '</p>' +
            '<div class="pick"><button type="button" class="bad" data-v="1"><b>걸림</b><small>허위 · 과대</small></button><button type="button" data-v="0"><b>통과</b><small>무사</small></button></div>' +
            '<div id="jdSay"></div></div></div>';
      [].forEach.call(box.querySelectorAll('.pick button'), function (b) {
        b.onclick = function () {
          var v = b.dataset.v === '1', ok = v === q.bad; if (ok) right++;
          [].forEach.call(box.querySelectorAll('.pick button'), function (x) { x.disabled = true; });
          b.classList.add('mine'); $('#jdBody').classList.add('done');
          setTimeout(function () {
            $('#jdSay').innerHTML = '<p class="verdict ' + (ok ? 'hit' : 'miss') + '">' + (ok ? '○ 바로 보앗소' : '× 잘못 보앗소') + '</p>' +
              '<div class="pl-say"><small>오늘 기준으로 보면</small>' + esc(q.why) + '</div>' +
              '<button type="button" class="pl-next" id="jdNext" style="margin-top:12px;float:right">' + (i + 1 < list.length ? '다음 광고 →' : '단속 마치기') + '</button>';
            $('#jdNext').onclick = function () { i++; show(); };
          }, 520);
        };
      });
    }
    show();
  };

  /* ── 살아남은 광고 ── */
  BUILD.alive = function () {
    var L = window.AD_ALIVE || [];
    $('#m-alive').innerHTML =
      '<div class="pl-head"><h2>살아남은 광고</h2><p>광고를 낸 곳은 그 뒤 어찌 되엇겟소? 「그 뒤 백 년」을 누르시오.</p></div>' +
      '<div class="al-list">' + L.map(function (r, k) {
        var a = BY[r.id] || {};
        return '<article class="al ' + (r.alive ? 'live' : 'gone') + '">' +
          '<div><div class="ph"><img src="' + DIR + r.id + '.jpg" alt="' + esc(a.title) + ' 광고" loading="lazy"></div>' +
            '<p class="then"><small>' + esc(dateOf(a)) + ' · 그때</small>' + esc(r.then) + '</p></div>' +
          '<span class="arr">백 년 뒤</span>' +
          '<div class="r"><h3>' + esc(r.who) + '</h3><span class="seal ' + (r.alive ? 'live' : 'gone') + '">' + (r.alive ? '營業中' : '閉店') + '</span>' +
            '<button type="button" class="show" data-k="' + k + '">그 뒤 백 년 →</button>' +
            '<p class="now"><small>지금</small>' + esc(r.now) + '</p>' +
            (r.check ? '<p class="pl-note">※ 지금 형편은 확인이 더 필요함</p>' : '') + '</div></article>';
      }).join('') + '</div>' +
      '<aside class="pitch"><h3><small>京城野錄 廣告部</small>백 년 전 귀사의 광고,<br>그 자리를 다시 팝니다</h3><ol>' +
        '<li><span><b>복각 광고</b>그 시절 귀사 광고를 경성야록 지면에 그대로 되살려 싣고, 「그 뒤 백 년」 이야기를 붙입니다.</span></li>' +
        '<li><span><b>광고첩 후원 칸</b>메인 광고 띠와 광고첩 맨 앞자리. 독자가 오려 가는 엽서 뒷면에 오늘의 귀사가 실립니다.</span></li>' +
        '<li><span><b>엽서 · 굿즈</b>독자가 고른 옛 광고로 엽서와 포스터를 찍어 냅니다. 동아일보 아카이브가 곧 상품이 됩니다.</span></li>' +
      '</ol></aside>';
    [].forEach.call(document.querySelectorAll('#m-alive .show'), function (b) {
      b.onclick = function () { b.closest('.al').classList.add('open'); };
    });
  };

  /* ── 그때 얼마였소 ── */
  var BOWL = '<svg viewBox="0 0 34 30" aria-hidden="true"><path d="M3 12h28c0 9-6 15-14 15S3 21 3 12z" fill="#2a2219"/><path d="M5 12c3-2 7-3 12-3s9 1 12 3" fill="none" stroke="#2a2219" stroke-width="1.4"/><path d="M12 7c0-2 2-2 2-4M18 7c0-2 2-2 2-4" fill="none" stroke="#6e6250" stroke-width="1.2" stroke-linecap="round"/></svg>';
  function won(n) { var m = Math.round(n / 1000) * 1000; return m >= 10000 ? (Math.floor(m / 10000) + '만' + (m % 10000 ? ' ' + (m % 10000) / 1000 + '천' : '') + ' 원') : (m / 1000 + '천 원'); }
  BUILD.price = function () {
    var B = window.AD_PRICE_BASE || { bowlThen: 15, bowlNow: 12000 }, L = window.AD_PRICE || [];
    $('#m-price').innerHTML =
      '<div class="pl-head"><h2>그때 얼마였소</h2><p>광고에 적힌 값을 그 시절 설렁탕 그릇으로 셈해 보시오.</p></div>' +
      L.map(function (r, k) {
        var a = BY[r.id] || {}, n = Math.floor(r.sen / B.bowlThen);
        return '<article class="pr" data-k="' + k + '"><div class="ph"><img src="' + DIR + r.id + '.jpg" alt="' + esc(a.title) + ' 광고"></div>' +
          '<div><h3>' + esc(r.label) + '</h3><p class="val">' + (r.sen >= 100 ? (r.sen / 100) + '원' : r.sen + '전') + ' · ' + esc(dateOf(a)) + ' 광고</p>' +
          '<button type="button" class="cnt">설렁탕으로 셈하기</button><div class="bowls">' + new Array(n + 1).join(BOWL) + '</div>' +
          '<p class="res">설렁탕 ' + (n <= 10 ? KNUM[n] : n) + ' 그릇 값이오<small>오늘 설렁탕 값으로 어림잡으면 약 ' + won(n * B.bowlNow) + '</small></p>' +
          (r.check ? '<p class="pl-note">※ 값은 저해상 지면에서 읽은 것이라 원문 대조가 필요함</p>' : '') + '</div></article>';
      }).join('') +
      '<p class="pl-note" style="margin-top:16px">설렁탕 한 그릇: 1920~30년대 10~15전 (주영하, 경향신문 「음식 100년」) · 오늘 값은 한 그릇 1만 2천 원 안팎으로 어림함.<br>값이 적힌 광고를 더 모으는 중이오.</p>';
    [].forEach.call(document.querySelectorAll('#m-price .cnt'), function (b) {
      b.onclick = function () {
        var art = b.closest('.pr'), bs = art.querySelectorAll('.bowls svg');
        art.classList.add('go');
        [].forEach.call(bs, function (s, j) { s.style.animationDelay = (j * 110) + 'ms'; });
        setTimeout(function () { art.classList.add('done'); }, bs.length * 110 + 400);
      };
    });
  };

  /* ── 나의 지면 ── */
  var items = load(MINE, { title: '', list: [] }), trayTab = 'cut';
  function today() { var d = new Date(); return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일'; }
  BUILD.mine = function () {
    $('#m-mine').innerHTML =
      '<div class="pl-head"><h2>나의 지면</h2><p>오려 둔 광고를 빈 지면에 붙여 나만의 경성 신문을 만드시오.</p></div>' +
      '<div class="mn"><div class="mp-wrap"><div class="mp" id="mp">' +
        '<div class="mast"><b>京城野錄</b><span><em>' + today() + '</em><em><span contenteditable="true" id="mpWho" spellcheck="false"></span> 의 지면</em><em>號外</em></span></div>' +
        '<p class="empty-hint" id="mpHint">서랍에서 광고를 눌러 붙이시오.<br>끌어서 옮기고, 모서리로 크기를 바꾸오.</p></div>' +
        '<div class="mp-act"><button type="button" class="main" id="mpSave">그림으로 저장</button><button type="button" id="mpShuffle">아무렇게나 흐트리기</button><button type="button" id="mpClear">모두 떼기</button></div></div>' +
      '<aside class="tray"><h3>서랍</h3><p>광고를 누르면 지면에 붙소.</p>' +
        '<div class="tb"><button type="button" data-t="cut">오려 둔 것</button><button type="button" data-t="all">모든 광고</button></div>' +
        '<div class="list" id="trayList"></div></aside></div>';
    var who = $('#mpWho'); who.textContent = items.title || '이름';
    who.addEventListener('input', function () { items.title = who.textContent.trim(); save(MINE, items); });
    who.addEventListener('focus', function () { if (who.textContent === '이름') { var r = document.createRange(); r.selectNodeContents(who); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } });
    $('#m-mine .tb').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { trayTab = b.dataset.t; drawTray(); } });
    $('#trayList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-id]'); if (!b) return;
      var im = b.querySelector('img'), ar = im && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 1.4;
      var w = Math.max(10, Math.min(46, 24 * Math.sqrt(ar)));
      items.list.push({ id: b.dataset.id, x: 6 + Math.random() * (88 - w), y: 18 + Math.random() * 44, w: +w.toFixed(1), r: +(Math.random() * 6 - 3).toFixed(1) });
      save(MINE, items); drawPage();
    });
    $('#mpClear').onclick = function () { items.list = []; save(MINE, items); drawPage(); };
    $('#mpShuffle').onclick = function () { items.list.forEach(function (it) { it.x = 4 + Math.random() * 56; it.y = 16 + Math.random() * 56; it.r = +(Math.random() * 8 - 4).toFixed(1); }); save(MINE, items); drawPage(); };
    $('#mpSave').onclick = savePic;
    drawPage();
  };
  function drawTray() {
    var el = $('#trayList'); if (!el) return;
    var cut = load(SCRAP, []).filter(function (id) { return BY[id]; });
    if (trayTab === 'cut' && !cut.length && !drawTray.once) { trayTab = 'all'; drawTray.once = true; }
    [].forEach.call(document.querySelectorAll('#m-mine .tb button'), function (b) { b.setAttribute('aria-pressed', b.dataset.t === trayTab); });
    var ids = trayTab === 'cut' ? cut : ADS.map(function (a) { return a.id; });
    el.innerHTML = ids.length ? ids.map(function (id) { return '<button type="button" data-id="' + id + '" title="' + esc(BY[id].title) + '"><img src="' + DIR + id + '.jpg" alt="' + esc(BY[id].title) + '" loading="lazy"></button>'; }).join('')
      : '<p class="none">아직 오려 둔 광고가 업소.<br>모아보기에서 광고를 크게 보고 「✂ 엽서로 오려 두기」를 누르시오.</p>';
  }
  function drawPage() {
    var mp = $('#mp'); if (!mp) return;
    [].forEach.call(mp.querySelectorAll('.it'), function (n) { n.remove(); });
    $('#mpHint').style.display = items.list.length ? 'none' : '';
    items.list.forEach(function (it, k) {
      var d = document.createElement('div');
      d.className = 'it'; d.dataset.k = k;
      d.style.cssText = 'left:' + it.x + '%;top:' + it.y + '%;width:' + it.w + '%;transform:rotate(' + it.r + 'deg)';
      d.innerHTML = '<img src="' + DIR + it.id + '.jpg" alt=""><button type="button" class="x" aria-label="떼기">×</button><span class="sz" aria-hidden="true">⤡</span>';
      mp.appendChild(d);
      d.querySelector('.x').addEventListener('click', function (e) { e.stopPropagation(); items.list.splice(k, 1); save(MINE, items); drawPage(); });
      d.addEventListener('pointerdown', function (e) {
        if (e.target.classList.contains('x')) return;
        e.preventDefault();
        var box = mp.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, ox = it.x, oy = it.y, ow = it.w, sizing = e.target.classList.contains('sz');
        // 집은 것을 맨 위로
        items.list.push(items.list.splice(k, 1)[0]); mp.appendChild(d); d.classList.add('drag', 'sel');
        function mv(ev) {
          var dx = (ev.clientX - sx) / box.width * 100, dy = (ev.clientY - sy) / box.height * 100;
          if (sizing) { it.w = Math.max(10, Math.min(90, ow + dx)); d.style.width = it.w + '%'; }
          else { it.x = Math.max(-10, Math.min(95, ox + dx)); it.y = Math.max(12, Math.min(96, oy + dy)); d.style.left = it.x + '%'; d.style.top = it.y + '%'; }
        }
        function up() { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); d.classList.remove('drag'); save(MINE, items); drawPage(); }
        addEventListener('pointermove', mv); addEventListener('pointerup', up);
      });
    });
  }
  function savePic() {
    var mp = $('#mp'), W = 1200, H = 1600, c = document.createElement('canvas'); c.width = W; c.height = H;
    var g = c.getContext('2d'), box = mp.getBoundingClientRect(), k = W / box.width;
    g.fillStyle = '#efe4cc'; g.fillRect(0, 0, W, H);
    var gr = g.createRadialGradient(W / 2, H, 50, W / 2, H, H); gr.addColorStop(0, 'rgba(90,70,40,.18)'); gr.addColorStop(1, 'rgba(90,70,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#1e1913'; g.textAlign = 'center'; g.font = '800 92px "Nanum Myeongjo", serif';
    g.fillText('京 城 野 錄', W / 2, 150);
    g.font = '24px "Noto Serif KR", serif'; g.fillStyle = '#6e6250';
    g.textAlign = 'left'; g.fillText(today(), 70, 200);
    g.textAlign = 'center'; g.fillText((items.title || '이름') + ' 의 지면', W / 2, 200);
    g.textAlign = 'right'; g.fillText('號外', W - 70, 200);
    g.fillStyle = '#3a3128'; g.fillRect(60, 222, W - 120, 3); g.fillRect(60, 230, W - 120, 1.5);
    var imgs = [].slice.call(mp.querySelectorAll('.it'));
    imgs.forEach(function (d) {
      var im = d.querySelector('img'), r = d.getBoundingClientRect(), it = items.list[+d.dataset.k] || {};
      var w = d.offsetWidth * k, h = d.offsetHeight * k, cx = (r.left - box.left + r.width / 2) * k, cy = (r.top - box.top + r.height / 2) * k;
      g.save(); g.translate(cx, cy); g.rotate((it.r || 0) * Math.PI / 180);
      g.shadowColor = 'rgba(30,20,10,.28)'; g.shadowBlur = 10; g.shadowOffsetY = 4;
      g.fillStyle = '#e8dcc2'; g.fillRect(-w / 2, -h / 2, w, h); g.shadowColor = 'transparent';
      g.globalCompositeOperation = 'multiply'; g.drawImage(im, -w / 2, -h / 2, w, h); g.globalCompositeOperation = 'source-over'; g.restore();
    });
    g.font = '18px "Noto Serif KR", serif'; g.fillStyle = '#6e6250'; g.textAlign = 'center';
    g.fillText('광고 원문 · 동아일보 지면  |  경성야록 광고첩에서 오려 붙임', W / 2, H - 40);
    try {
      c.toBlob(function (b) {
        if (!b) return window.print();
        var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = '경성야록_나의지면.png'; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      }, 'image/png');
    } catch (e) {
      // 컴퓨터에서 파일로 바로 열면(file://) 브라우저가 그림 저장을 막음 → 인쇄 창에서 'PDF로 저장'
      alert('컴퓨터에서 파일로 바로 열면 그림 저장이 막혀 잇소.\n인쇄 창이 뜨면 「PDF로 저장」을 고르시오. (사이트에 올리면 그림으로 저장됨)');
      window.print();
    }
  }
  // 모아보기에서 오려 두면 서랍도 새로
  addEventListener('storage', drawTray);

  /* 주소 끝 #quiz · #judge · #alive · #price · #mine 으로 바로 열기 */
  var h = location.hash.slice(1);
  if (BUILD[h]) setMode(h);
})();
