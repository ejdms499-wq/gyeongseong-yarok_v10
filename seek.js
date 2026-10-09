/* 심인 광고면 — 「제가 그 사람이오」 · 「여기 잇소」 통지서 → 광고를 내림(發見)
   팀원이 만든 「제작 동료 모집 · 정기 독자 신청」을 옮김. 화면 시연용: 서버로 보내지 않고 이 컴퓨터에만 남김 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 옛말 ↔ 오늘말 */
  var hover = window.matchMedia && matchMedia('(hover: hover)').matches;
  function gloss(el, on) {
    if (!el.dataset.ko) return;
    if (on) { if (el.dataset.old == null) el.dataset.old = el.innerHTML; el.innerHTML = el.dataset.ko; el.classList.add('gloss'); }
    else if (el.dataset.old != null) { el.innerHTML = el.dataset.old; el.classList.remove('gloss'); }
  }
  if (hover) {
    document.addEventListener('mouseover', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, true); });
    document.addEventListener('mouseout', function (e) { var h = e.target.closest && e.target.closest('.hj[data-ko]'); if (h && !h.contains(e.relatedTarget)) gloss(h, false); });
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var KEY = 'yk-seek';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  var TEXT = {
    crew: { t: '자 수 서', s: '「동료를 차즘」 광고를 보고 통지하오. 그 사람은 — 나요. (도망칠 생각은 업소)', go: '자수하기' },
    reader: { t: '통 지 서', s: '「독자를 차즘」 광고를 보고 통지하오. 그 사람은 — 여기 잇소. 화면을 내리다 말앗슬 뿐이오.', go: '부치기' }
  };
  function hj(o, n) { return '<span class="hj" tabindex="0" data-ko="' + n + '">' + o + '</span>'; }
  /* 판결 — 죄가 만흘수록 형이 무거워짐 (형벌은 모다 야근) */
  var SENT = ['훈방. 단, 차는 본인이 끓일 것', '야근 사흘. 집행유예 업슴', '야근 한 달. 식은 차 무제한 지급', '무기 야근. 가석방은 다음 호 발행 뒤 심사', '종신 편집국 근무. 이불은 지참 허가'];
  function foundLine(k, d) {
    var n = esc(d.name || '아무개');
    if (k === 'crew') {
      var c = (d.crime || []).length, sv = SENT[Math.min(c, SENT.length - 1)];
      var cr = c ? esc(d.crime.join(' · ')) : '죄 업슴 (그것이 가장 수상함)';
      return '<span class="sk-verdict"><b>판　결</b><em>죄목 ' + c + '건 — ' + cr + '</em><strong>' + esc(sv) + '</strong><i>京城野錄 編輯局 審人係</i></span>' +
        hj(n + ' 님, 자수를 접수하엿소. 수색대는 해산하오. 현상금(식은 차 한 잔)은 본인이 마시시오.', n + ' 님, 자수를 접수했습니다. 수색대는 해산합니다. 현상금(식은 차 한 잔)은 본인이 드세요.') + '<small>' + hj('※ 시연 화면이라 실제로 접수되지 안소. 안심하시오.', '※ 시연 화면이라 실제로 접수되지 않습니다. 안심하세요.') + '</small><button type="button" data-undo="crew">광고 다시 걸기 (탈옥)</button>';
    }
    return k === 'crew' ? '' + '<small>' + hj('※ 시연 화면이라 실제로 접수되지 안소. 안심하시오.', '※ 시연 화면이라 실제로 접수되지 않습니다. 안심하세요.') + '</small><button type="button" data-undo="crew">광고 다시 걸기</button>'
      : '<span class="sk-verdict r"><b>發　見</b><em>최종 목격지 — ' + esc(d.where || '본지 삼 면 하단') + '</em><strong>' + (d.where === '지금 이 칸' ? '발견 장소가 너무 갓가워 수색대가 놀랏소' : '수색대 해산 · 광고 내림') + '</strong><i>京城野錄 編輯局 審人係</i></span>' + hj(n + ' 님, 차잣소. 다음 호부터 남보다 먼저 배달하리다. 이제 못 빠져나가오.', n + ' 님, 찾았습니다. 다음 호부터 남보다 먼저 보내 드립니다. 이제 못 빠져나갑니다.') + '<small>' + hj('※ 시연 화면이라 실제로 메일이 가지 안소. 안심하시오.', '※ 시연 화면이라 실제로 메일이 가지 않습니다. 안심하세요.') + '</small><button type="button" data-undo="reader">광고 다시 걸기</button>';
  }
  function paint() {
    var d = load();
    [['crew', '#adCrew'], ['reader', '#adReader']].forEach(function (p) {
      var ad = $(p[1]), v = d[p[0]];
      ad.classList.toggle('found', !!v);
      $('.sk-found', ad).innerHTML = v ? foundLine(p[0], v) : '';
    });
  }
  document.addEventListener('click', function (e) {
    var u = e.target.closest('[data-undo]'); if (!u) return;
    var d = load(); delete d[u.dataset.undo]; save(d); paint();
  });

  /* 통지서 */
  var modal = $('#modal'), form = $('#mForm'), cur = null, tab = 'new', last = null;
  function open(k) {
    cur = k; last = document.activeElement;
    $('#mT').textContent = TEXT[k].t; $('#mS').textContent = TEXT[k].s; $('#mGo').textContent = TEXT[k].go;
    $$('.sk-fields', form).forEach(function (f) { f.classList.toggle('on', f.dataset.for === k); });
    $$('[aria-invalid]', form).forEach(function (x) { x.removeAttribute('aria-invalid'); });
    modal.hidden = false; requestAnimationFrame(function () { modal.classList.add('on'); });
    setTimeout(function () { var f = $('.sk-fields.on input:not([hidden]), .sk-fields.on textarea', form); if (f) f.focus(); }, 60);
  }
  function close() { modal.classList.remove('on'); setTimeout(function () { modal.hidden = true; if (last) last.focus(); }, 280); }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.dataset.open); }); });
  $('#mX').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  $$('.sk-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      tab = b.dataset.t;
      $$('.sk-tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $$('[data-only]', form).forEach(function (x) { x.hidden = x.dataset.only !== tab; });
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, bad = null;
    function need(el, ok) { el.setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok && !bad) bad = el; }
    var rec;
    if (cur === 'crew') {
      need(f.name, f.name.value.trim()); need(f.reason, f.reason.value.trim());
      rec = { name: f.name.value.trim(), field: f.field.value, reason: f.reason.value.trim(), crime: $$('input[name=crime]:checked', form).map(function (x) { return x.value; }) };
    } else {
      if (tab === 'new') need(f.rname, f.rname.value.trim());
      need(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()));
      rec = { name: tab === 'new' ? f.rname.value.trim() : f.email.value.trim().split('@')[0], email: f.email.value.trim(), where: f.where.value };
    }
    if (bad) { bad.focus(); return; }
    rec.at = new Date().toISOString();
    var d = load(); d[cur] = rec; save(d);
    close();
    var ad = cur === 'crew' ? $('#adCrew') : $('#adReader');
    setTimeout(function () { ad.scrollIntoView({ behavior: 'smooth', block: 'center' }); paint(); }, 320);
  });

  paint();
})();

/* 尋猫 — 누르면 고양이가 「ㄱ」을 물고 튀어나와 냐옹 (소리 파일 없이 브라우저가 직접 만듦) */
(function () {
  'use strict';
  var ad = document.getElementById('adCat'); if (!ad) return;
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null, t0 = 0;
  function meow() {
    if (!AC) return;
    try {
      ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
      var now = ctx.currentTime, dur = .62 + Math.random() * .18, base = 520 + Math.random() * 120;
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), g = ctx.createGain(), mix = ctx.createGain();
      o.type = 'sawtooth'; o2.type = 'triangle';
      /* 냐— (올라감) 옹 (내려감) */
      [o, o2].forEach(function (x, k) {
        var m = k ? 2 : 1;
        x.frequency.setValueAtTime(base * .78 * m, now);
        x.frequency.linearRampToValueAtTime(base * 1.32 * m, now + dur * .35);
        x.frequency.linearRampToValueAtTime(base * 1.12 * m, now + dur * .6);
        x.frequency.exponentialRampToValueAtTime(base * .62 * m, now + dur);
      });
      f.type = 'bandpass'; f.Q.value = 6;               /* 입 모양: 이 → 아 → 오 */
      f.frequency.setValueAtTime(1900, now); f.frequency.linearRampToValueAtTime(1300, now + dur * .45); f.frequency.linearRampToValueAtTime(700, now + dur);
      f2.type = 'lowpass'; f2.frequency.value = 3200;
      var vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 7; vg.gain.value = 9; vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
      o.connect(mix); o2.connect(mix); mix.gain.value = .5; mix.connect(f); f.connect(f2); f2.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(.28, now + .06); g.gain.setValueAtTime(.26, now + dur * .55); g.gain.exponentialRampToValueAtTime(.001, now + dur);
      [o, o2, vib].forEach(function (x) { x.start(now); x.stop(now + dur + .05); });
    } catch (e) {}
  }
  var hide = null;
  function pop() {
    if (Date.now() - t0 < 500) return; t0 = Date.now();
    ad.classList.remove('mew'); void ad.offsetWidth; ad.classList.add('mew');
    meow();
    clearTimeout(hide); hide = setTimeout(function () { ad.classList.remove('mew'); }, 1800);
  }
  ad.addEventListener('click', function (e) { if (e.target.closest('.hj') && e.detail === 0) return; pop(); });
  ad.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pop(); } });
})();

/* 광고면 아래칸 — 부고 · 현상 수배 · 사과 · 문 두드림 */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null;
  function ac() { if (!AC) return null; ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function knock(t0, loud) {   /* 나무문을 주먹으로 */
    var c = ac(); if (!c) return; var t = c.currentTime + t0;
    var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(70, t + .09);
    g.gain.setValueAtTime(loud, t); g.gain.exponentialRampToValueAtTime(.001, t + .14); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .16);
    var n = c.createBufferSource(), b = c.createBuffer(1, c.sampleRate * .03, c.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; var gn = c.createGain(); gn.gain.value = loud * .6; n.buffer = b; n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(t);
  }
  /* 부고 — 분향 */
  var ob = $('obitB'), on = 0, OB = ['', '고인(기계)께서 감사를 표할 수 업소', '세 번째 향 — 야근조가 울컥함', '분향소에서 원두 냄새가 나기 시작함', '고인이 잠시 「삐」 소리를 냇다는 제보가 잇소', '그만 하시오. 고인이 다시 켜질라'];
  if (ob) ob.addEventListener('click', function () { on++; $('obitN').textContent = '· 향 ' + on + ' 대'; var p = ob.parentNode.querySelector('.sk-obit-msg') || ob.parentNode.appendChild(Object.assign(document.createElement('p'), { className: 'sk-obit-msg' })); p.textContent = OB[Math.min(on, OB.length - 1)] || ''; ob.parentNode.classList.add('lit'); });
  /* 현상 수배 — 자정까지 남은 시간 (매일 밤 온다) */
  var dl = $('dl');
  if (dl) (function tick() { var n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); var s = Math.floor((m - n) / 1000), h = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60;
    dl.textContent = (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss; $('adWanted').classList.toggle('near', s < 3600); setTimeout(tick, 1000); })();
  /* 문 두드림 — 두드리면, 셋째부터는 저쪽에서도 두드림 */
  var kn = $('adKnock'), kc = 0, KN = ['짐작 가는 이는 이 칸을 두드려 보시오.', '…대답이 업소.', '…대답이 업소.', '똑. 똑. 똑. — 이번엔 저쪽에서.', '두드린 이를 차잣소. 당신이엇소.', '그만 두드리시오. 저쪽이 겁을 먹엇소.'];
  function hit() {
    kc++; [0, .22, .44].forEach(function (d) { knock(d, .5); });
    if (kc === 3) { setTimeout(function () { [0, .3, .6].forEach(function (d) { knock(d, .22); }); kn.classList.add('back'); }, 1500); }
    kn.classList.remove('shake'); void kn.offsetWidth; kn.classList.add('shake');
    setTimeout(function () { $('knockN').firstChild.textContent = KN[Math.min(kc, KN.length - 1)]; }, kc === 3 ? 2400 : 700);
  }
  if (kn) { kn.addEventListener('click', hit); kn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(); } }); }
})();
