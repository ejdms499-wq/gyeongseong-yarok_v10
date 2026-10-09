/* 경성야록 상점 — 가위로 오려 엽서 만들기 · 내 스크랩첩 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hj(o, k) { return '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>'; }

  /* ── 가위 그림 (먹색 선) ── */
  var SCISSORS = '<svg viewBox="-30 -30 60 60" aria-hidden="true">' +
    '<g class="bl b1"><path d="M0 0 L26 -3 Q28 0 26 1 Z" fill="#1e1913"/><circle cx="-14" cy="7" r="7" fill="none" stroke="#1e1913" stroke-width="3"/><path d="M0 0 L-9 4" stroke="#1e1913" stroke-width="3"/></g>' +
    '<g class="bl b2"><path d="M0 0 L26 3 Q28 0 26 -1 Z" fill="#3a3128"/><circle cx="-14" cy="-7" r="7" fill="none" stroke="#1e1913" stroke-width="3"/><path d="M0 0 L-9 -4" stroke="#1e1913" stroke-width="3"/></g>' +
    '<circle r="1.8" fill="#c9b88f"/></svg>';

  /* ── 저장용 그림 (file:// 에서도 캔버스로 저장되게 js에 담아 둠) ── */
  var dataReady = null;
  function loadData() {
    if (window.YK_ADDATA) return Promise.resolve();
    if (dataReady) return dataReady;
    dataReady = new Promise(function (ok) { var s = document.createElement('script'); s.src = 'shop-adsdata.js'; s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
    return dataReady;
  }
  function imgFor(id) {
    return loadData().then(function () {
      return new Promise(function (ok, no) {
        var src = window.YK_ADDATA && window.YK_ADDATA[id]; if (!src) return no();
        var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = src;
      });
    });
  }

  /* ── 스크랩첩 상태 ── */
  var KEY = 'yk-scrap-v1', book = [];
  try { book = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { book = []; }
  function saveBook() { try { localStorage.setItem(KEY, JSON.stringify(book)); } catch (e) {} }

  /* ── 진열장마다 「오려 가기」 ── */
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>';
  $$('.vt[data-id]').forEach(function (v) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cut-btn'; b.setAttribute('aria-label', '가위로 오려 가기');
    b.innerHTML = ICON + '<span>' + hj('오려 가기', '오려 가기') + '</span>';
    b.addEventListener('click', function (e) { e.stopPropagation(); openCut(v); });
    ($('.vt-glass', v) || v).appendChild(b);
  });

  /* ── 오리기 무대 ── */
  var modal = document.createElement('div');
  modal.className = 'cut-modal'; modal.hidden = true;
  modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', '광고 오리기');
  modal.innerHTML =
    '<div class="cut-stage">' +
      '<div class="cut-sheet"><div class="cut-news"></div><div class="cut-piece"><img alt=""></div>' +
        '<svg class="cut-line" preserveAspectRatio="none"><rect class="dash"/><rect class="done"/></svg>' +
        '<div class="cut-sc">' + SCISSORS + '</div></div>' +
      '<div class="pc" hidden>' +
        '<div class="pc-head">' + hj('郵 便 葉 書', '우 편 엽 서') + '</div>' +
        '<div class="pc-stamp"><div class="ps-in"><b>京城野錄</b></div></div>' +
        '<svg class="pc-mark" viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="none" stroke="#5a2e22" stroke-width="2.2"/><circle cx="60" cy="60" r="29" fill="none" stroke="#5a2e22" stroke-width="1"/>' +
          '<text x="60" y="34" text-anchor="middle" font-size="13" fill="#5a2e22">京 城</text><text class="pm-d" x="60" y="65" text-anchor="middle" font-size="13" fill="#5a2e22"></text><text x="60" y="95" text-anchor="middle" font-size="11" fill="#5a2e22">野 錄</text>' +
          '<path d="M104 40 q12 6 0 12 q-12 6 0 12 q12 6 0 12" fill="none" stroke="#5a2e22" stroke-width="1.6"/></svg>' +
        '<div class="pc-left"><div class="pc-slot"></div></div>' +
        '<div class="pc-right"><label class="pc-msg"><span class="pc-lab">' + hj('보내는 말', '보내는 말') + '</span><textarea maxlength="54" rows="3"></textarea></label>' +
          '<p class="pc-from"></p><p class="pc-to">' + hj('京城府 · 野錄 讀者 貴下', '경성부 · 야록 독자님께') + '</p></div>' +
      '</div>' +
      '<div class="cut-acts" hidden>' +
        '<button type="button" class="ca-send"><i aria-hidden="true"></i>' + hj('카톡으로 보내기', '카카오톡으로 보내기') + '</button>' +
        '<button type="button" class="ca-save">' + hj('엽서로 간직하기', '엽서 그림으로 저장') + '</button>' +
        '<button type="button" class="ca-book">' + hj('스크랩첩에 붙이기', '스크랩첩에 붙이기') + '</button>' +
        '<button type="button" class="ca-close">' + hj('도로 노키', '닫기') + '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
  var sheet = $('.cut-sheet', modal), piece = $('.cut-piece', modal), pimg = $('img', piece), svg = $('.cut-line', modal),
      sc = $('.cut-sc', modal), pc = $('.pc', modal), acts = $('.cut-acts', modal), slot = $('.pc-slot', modal), ta = $('textarea', modal);
  var cur = null, raf = 0;
  var DEF_MSG = '그날 신문에서 오려 보내오.';
  ta.placeholder = DEF_MSG;

  function openCut(v) {
    cur = { id: v.dataset.id, d: v.dataset.d, p: v.dataset.p, t: v.dataset.t };
    var src = 'assets/ads/' + cur.id + '.jpg';
    pimg.src = src; ta.value = '';
    $('.pc-from', modal).innerHTML = hj('東亞日報 ' + cur.d + ' · ' + cur.p + ' 에서 오림', '동아일보 ' + cur.d + ' · ' + cur.p + '에서 오림');
    $('.pm-d', modal).textContent = cur.d.replace(/^19/, '').replace(/\.0?/g, '.');
    pc.hidden = true; acts.hidden = true; sheet.hidden = false;
    sheet.classList.remove('cut', 'gone'); piece.style.transform = ''; piece.classList.remove('lift'); piece.style.transition = '';
    if (piece.parentNode !== sheet) sheet.insertBefore(piece, svg);
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('on'); });
    var go = function () { layout(); setTimeout(startCut, reduce ? 0 : 500); };
    if (pimg.complete && pimg.naturalWidth) go(); else pimg.onload = go;
  }
  function layout() {
    var r = pimg.naturalWidth / pimg.naturalHeight || 1;
    var mw = Math.min(560, innerWidth - 120), mh = Math.min(420, innerHeight - 260);
    var w = mw, h = w / r; if (h > mh) { h = mh; w = h * r; }
    piece.style.width = (w + 28) + 'px'; piece.style.height = (h + 28) + 'px';
    sheet.style.width = (w + 120) + 'px'; sheet.style.height = (h + 120) + 'px';
    var W = w + 120, H = h + 120;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    $$('rect', svg).forEach(function (rc) { rc.setAttribute('x', 46); rc.setAttribute('y', 46); rc.setAttribute('width', w + 28); rc.setAttribute('height', h + 28); });
    var per = 2 * (w + 28 + h + 28); var done = $('.done', svg);
    done.style.strokeDasharray = per; done.style.strokeDashoffset = per;
    cur.geo = { x: 46, y: 46, w: w + 28, h: h + 28, per: per };
    placeSc(0);
  }
  function pointAt(t) {
    var g = cur.geo, L = t * g.per, w = g.w, h = g.h;
    if (L < w) return [g.x + L, g.y, 0];
    L -= w; if (L < h) return [g.x + w, g.y + L, 90];
    L -= h; if (L < w) return [g.x + w - L, g.y + h, 180];
    L -= w; return [g.x, g.y + h - L, 270];
  }
  function placeSc(t) {
    var p = pointAt(Math.min(t, 0.9999));
    var open = reduce ? 0 : Math.abs(Math.sin(t * 70)) * 16;
    sc.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px) rotate(' + p[2] + 'deg)';
    $('.b1', sc).setAttribute('transform', 'rotate(' + (-open) + ')');
    $('.b2', sc).setAttribute('transform', 'rotate(' + open + ')');
    $('.done', svg).style.strokeDashoffset = cur.geo.per * (1 - t);
  }
  function startCut() {
    var T = reduce ? 1 : 2600, t0 = performance.now();
    cancelAnimationFrame(raf);
    (function step(now) {
      var t = Math.min(1, (now - t0) / T);
      var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      placeSc(e);
      if (t < 1) raf = requestAnimationFrame(step); else afterCut();
    })(t0);
  }
  function afterCut() {
    sheet.classList.add('cut');
    piece.classList.add('lift');
    setTimeout(toCard, reduce ? 0 : 1100);
  }
  function toCard() {
    var a = piece.getBoundingClientRect();
    sheet.classList.add('gone');
    pc.hidden = false; slot.appendChild(piece); piece.classList.remove('lift');
    // 엽서 칸에 맞게
    var sr = slot.getBoundingClientRect(), r = pimg.naturalWidth / pimg.naturalHeight;
    var w = sr.width, h = w / r; if (h > sr.height) { h = sr.height; w = h * r; }
    piece.style.width = w + 'px'; piece.style.height = h + 'px';
    setTimeout(function () { sheet.hidden = true; }, 600);
    var b = piece.getBoundingClientRect();
    piece.style.transition = 'none';
    piece.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px) scale(' + (a.width / b.width) + ') rotate(-1.5deg)';
    piece.style.transformOrigin = '0 0';
    pc.classList.remove('in'); void pc.offsetWidth; pc.classList.add('in');
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      piece.style.transition = 'transform 1s cubic-bezier(.2,.7,.2,1)';
      piece.style.transform = 'rotate(-2deg)';
      setTimeout(function () { acts.hidden = false; }, 900);
    }); });
  }
  function close() {
    cancelAnimationFrame(raf); modal.classList.remove('on');
    setTimeout(function () { modal.hidden = true; }, 450);
  }
  $('.ca-close', modal).addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });

  /* ── 엽서 그림으로 저장 ── */
  function wrap(ctx, text, maxW) {
    var out = [], line = '';
    Array.from(text).forEach(function (ch) { if (ctx.measureText(line + ch).width > maxW) { out.push(line); line = ch; } else line += ch; });
    if (line) out.push(line); return out;
  }
  function paper(ctx, W, H, base) {
    ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var i = 0; i < W * H / 260; i++) { ctx.fillStyle = 'rgba(60,45,30,' + (rnd() * 0.06) + ')'; ctx.fillRect(rnd() * W, rnd() * H, 1.2, 1.2); }
    var g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(70,50,25,.22)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function tape(ctx, x, y, w, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(214,196,150,.78)'; ctx.fillRect(-w / 2, -11, w, 22);
    ctx.strokeStyle = 'rgba(120,95,55,.25)'; ctx.strokeRect(-w / 2, -11, w, 22); ctx.restore();
  }
  var SER = '"Noto Serif KR", serif';
  function makePostcard() {
    if (!cur) return Promise.reject();
    return imgFor(cur.id).then(function (im) {
      var W = 1400, H = 900, c = document.createElement('canvas'); c.width = W; c.height = H;
      var x = c.getContext('2d'); paper(x, W, H, '#ece2cb');
      x.strokeStyle = '#3a3128'; x.lineWidth = 2; x.strokeRect(34, 34, W - 68, H - 68); x.lineWidth = 1; x.strokeRect(42, 42, W - 84, H - 84);
      x.fillStyle = '#1e1913'; x.font = '900 34px ' + SER; x.textAlign = 'center'; x.fillText('郵　便　葉　書', W / 2 - 60, 104);
      x.beginPath(); x.moveTo(W * 0.58, 150); x.lineTo(W * 0.58, H - 90); x.strokeStyle = 'rgba(58,49,40,.55)'; x.stroke();
      // 그림
      var bx = 90, by = 160, bw = W * 0.58 - 140, bh = H - 290, r = im.width / im.height, w = bw, h = w / r; if (h > bh) { h = bh; w = h * r; }
      var cx = bx + (bw - w) / 2, cy = by + (bh - h) / 2;
      x.save(); x.translate(cx + w / 2, cy + h / 2); x.rotate(-0.035);
      x.shadowColor = 'rgba(20,14,8,.35)'; x.shadowBlur = 18; x.shadowOffsetY = 8; x.fillStyle = '#efe6d2'; x.fillRect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28);
      x.shadowColor = 'transparent'; x.drawImage(im, -w / 2, -h / 2, w, h); x.restore();
      tape(x, cx + 10, cy - 6, 110, -0.5); tape(x, cx + w - 10, cy + h + 4, 110, -0.5);
      // 우표 · 소인
      var sx = W - 210, sy = 70; x.fillStyle = '#e9dcc0'; x.fillRect(sx, sy, 120, 146);
      x.fillStyle = '#ece2cb'; for (var i = 0; i <= 10; i++) { [[sx + i * 12, sy], [sx + i * 12, sy + 146]].forEach(function (p) { x.beginPath(); x.arc(p[0], p[1], 4, 0, 7); x.fill(); }); }
      for (i = 0; i <= 12; i++) { [[sx, sy + i * 12.2], [sx + 120, sy + i * 12.2]].forEach(function (p) { x.beginPath(); x.arc(p[0], p[1], 4, 0, 7); x.fill(); }); }
      x.strokeStyle = '#4a3a2a'; x.strokeRect(sx + 12, sy + 12, 96, 122); x.fillStyle = '#3a2c1f'; x.font = '900 22px ' + SER;
      ['京', '城', '野', '錄'].forEach(function (ch, k) { x.fillText(ch, sx + 60, sy + 42 + k * 26); });
      x.save(); x.translate(sx - 6, sy + 108); x.strokeStyle = 'rgba(90,46,34,.82)'; x.fillStyle = 'rgba(90,46,34,.85)'; x.lineWidth = 2.4;
      x.beginPath(); x.arc(0, 0, 62, 0, 7); x.stroke(); x.lineWidth = 1.2; x.beginPath(); x.arc(0, 0, 40, 0, 7); x.stroke();
      x.font = '700 18px ' + SER; x.fillText('京 城', 0, -44); x.font = '700 19px ' + SER; x.fillText(cur.d.replace(/^19/, '').replace(/\.0?/g, '.'), 0, 7); x.font = '700 15px ' + SER; x.fillText('野 錄', 0, 54);
      x.lineWidth = 2; for (i = 0; i < 3; i++) { x.beginPath(); x.moveTo(70, -20 + i * 18); x.bezierCurveTo(100, -34 + i * 18, 120, -6 + i * 18, 150, -20 + i * 18); x.stroke(); }
      x.restore();
      // 글
      x.textAlign = 'left'; var tx = W * 0.58 + 50, tw = W - tx - 90;
      x.strokeStyle = 'rgba(58,49,40,.35)'; for (i = 0; i < 4; i++) { x.beginPath(); x.moveTo(tx, 380 + i * 64); x.lineTo(tx + tw, 380 + i * 64); x.stroke(); }
      x.fillStyle = '#1e1913'; x.font = '500 30px ' + SER;
      wrap(x, ta.value.trim() || DEF_MSG, tw - 10).slice(0, 4).forEach(function (ln, k) { x.fillText(ln, tx + 6, 370 + k * 64); });
      x.font = '700 22px ' + SER; x.fillText('京城府 · 野錄 讀者 貴下', tx, H - 150);
      x.fillStyle = '#6e6250'; x.font = '500 19px ' + SER; x.fillText('東亞日報 ' + cur.d + ' · ' + cur.p + ' 에서 오림 · 京城野錄 商店', tx, H - 110);
      return c;
    });
  }
  function download(c, name) { var a = document.createElement('a'); a.download = name; try { a.href = c.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); } catch (e) {} }
  function savePostcard() { makePostcard().then(function (c) { download(c, '경성야록_엽서_' + cur.d + '.png'); }).catch(function () {}); }
  $('.ca-save', modal).addEventListener('click', savePostcard);
  $('.ca-send', modal).addEventListener('click', function () {
    var name = '경성야록_엽서_' + cur.d + '.png', msg = (ta.value.trim() || DEF_MSG);
    makePostcard().then(function (c) { sendCard(c, name, '京城野錄 엽서 — ' + msg, '동아일보 ' + cur.d + ' 광고에서 오린 엽서'); }).catch(function () {});
  });

  /* ── 엽서 보내기 ──
     1) yk-kakao.js 에 카카오 열쇠가 들어 잇고, 사이트가 인터넷 주소(http/https)로 열렷으면 → 카카오톡 공유 카드
     2) 휴대폰 → 휴대폰의 「공유하기」 창 (카카오톡을 고르면 됨)
     3) 컴퓨터 → 엽서 그림을 복사 → 카카오톡 대화창에서 Ctrl + V
     4) 그것도 안 되면 → 그림으로 저장하고, 저장된 그림을 카톡 창에 끌어다 놓기 */
  var toast = document.createElement('div'); toast.className = 'yk-send'; toast.hidden = true; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  function say(html) {
    toast.innerHTML = '<div class="ys-in">' + html + '<button type="button" class="ys-x">' + hj('알앗소', '확인') + '</button></div>';
    toast.hidden = false; requestAnimationFrame(function () { toast.classList.add('on'); });
    $('.ys-x', toast).addEventListener('click', function () { toast.classList.remove('on'); setTimeout(function () { toast.hidden = true; }, 400); });
  }
  function kakaoReady() {
    var key = window.YK_KAKAO_KEY; if (!key || !/^https?:/.test(location.protocol)) return Promise.reject();
    if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) return Promise.resolve(window.Kakao);
    return new Promise(function (ok, no) {
      var sc = document.createElement('script'); sc.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'; sc.crossOrigin = 'anonymous';
      sc.onload = function () { try { if (!window.Kakao.isInitialized()) window.Kakao.init(key); ok(window.Kakao); } catch (e) { no(e); } };
      sc.onerror = no; document.head.appendChild(sc);
    });
  }
  function sendCard(c, name, title, desc) {
    c.toBlob(function (blob) {
      if (!blob) { download(c, name); return; }
      var file = null; try { file = new File([blob], name, { type: 'image/png' }); } catch (e) {}
      kakaoReady().then(function (K) {
        return K.Share.uploadImage({ file: [file] }).then(function (r) {
          K.Share.sendDefault({ objectType: 'feed', content: { title: title, description: desc, imageUrl: r.infos.original.url, link: { webUrl: location.href, mobileWebUrl: location.href } },
            buttons: [{ title: '경성야록 상점 가 보기', link: { webUrl: location.href, mobileWebUrl: location.href } }] });
        });
      }).catch(function () {
        var phone = window.matchMedia && matchMedia('(pointer: coarse)').matches;
        /* 휴대폰 · 윈도우 크롬/엣지 — 기기의 공유 창 → 카카오톡 고르기 */
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: title, text: title }).catch(function () {});
          say('<b>' + hj('공유 창이 열렷소', '공유 창이 열렸어요') + '</b><ol><li>' + hj('목록에서 카카오톡을 고르시압.', '목록에서 카카오톡을 고르세요.') + '</li></ol>');
          return;
        }
        if (navigator.clipboard && window.ClipboardItem) {
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function () {
            say('<b>' + hj('엽서를 복사해 두엇소', '엽서 그림을 복사했어요') + '</b>' +
              '<ol><li>' + hj('카카오톡에서 보낼 사람의 대화창을 여시압.', '카카오톡에서 보낼 사람의 대화창을 여세요.') + '</li>' +
              '<li>' + hj('글 쓰는 칸을 한 번 누르고 <kbd>Ctrl</kbd> + <kbd>V</kbd>', '글 쓰는 칸을 한 번 누르고 <kbd>Ctrl</kbd> + <kbd>V</kbd>') + '</li>' +
              '<li>' + hj('엽서 그림이 붓흐면 — 전송.', '엽서 그림이 붙으면 — 전송.') + '</li></ol>');
          }).catch(function () { fallback(c, name); });
        } else fallback(c, name);
      });
    }, 'image/png');
  }
  function fallback(c, name) {
    download(c, name);
    say('<b>' + hj('엽서를 그림으로 내려바닷소', '엽서를 그림 파일로 저장했어요') + '</b><ol><li>' + hj('「다운로드」 폴더에서 「' + name + '」 을 차즈시압.', '"다운로드" 폴더에서 "' + name + '" 파일을 찾으세요.') + '</li><li>' + hj('그 파일을 카카오톡 대화창 우로 끌어다 노으면 보내지오.', '그 파일을 카카오톡 대화창 위로 끌어다 놓으면 보내집니다.') + '</li></ol>');
  }
  window.ykSendCard = sendCard;

  /* ── 내 스크랩첩 ── */
  var tab = document.createElement('button');
  tab.type = 'button'; tab.className = 'sb-tab';
  tab.innerHTML = '<b>' + hj('스크랩帖', '스크랩첩') + '</b><span class="sb-n"></span>';
  document.body.appendChild(tab);
  var panel = document.createElement('div');
  panel.className = 'sb-panel'; panel.hidden = true;
  panel.innerHTML = '<div class="sb-top"><b>' + hj('나의 스크랩帖', '나의 스크랩첩') + '</b><span>' + hj('오린 광고를 끌어서 마음대로 붙이시오. 떼려면 귀퉁이 ×.', '오린 광고를 끌어서 원하는 곳에 붙이세요. 떼려면 모서리 ×.') + '</span>' +
    '<button type="button" class="sb-send">' + hj('카톡으로 보내기', '카카오톡으로 보내기') + '</button><button type="button" class="sb-save">' + hj('한 장으로 간직하기', '한 장 그림으로 저장') + '</button><button type="button" class="sb-x">' + hj('덥기', '닫기') + '</button></div>' +
    '<div class="sb-board"><div class="sb-empty"><span class="gh"></span><span class="gh"></span><span class="gh"></span>' +
      '<p>' + hj('아즉 오린 광고가 업소. 진렬장 광고에 손을 대고 가위를 누르시압.', '아직 오린 광고가 없습니다. 진열장 광고에 마우스를 대고 가위를 누르세요.') + '<br><small>' + hj('다섯 장을 모으면 상뎜 도장을 찍어 드리오.', '다섯 장을 모으면 상점 도장을 찍어 드립니다.') + '</small></p></div>' +
      '<div class="sb-seal" aria-hidden="true"><b>京城野錄</b><i>스크랩 完</i></div></div>';
  document.body.appendChild(panel);
  var board = $('.sb-board', panel);
  function count() {
    $('.sb-n', tab).textContent = book.length ? book.length + ' / 5' : '';
    tab.classList.toggle('has', book.length > 0); $('.sb-empty', panel).hidden = book.length > 0;
    var done = book.length >= 5; panel.classList.toggle('done', done); tab.classList.toggle('done', done);
  }
  function render() {
    $$('.sb-item', board).forEach(function (n) { n.remove(); });
    book.forEach(function (it, k) {
      var n = document.createElement('figure'); n.className = 'sb-item';
      n.style.left = it.x + '%'; n.style.top = it.y + '%'; n.style.transform = 'rotate(' + it.r + 'deg)';
      n.innerHTML = '<img src="assets/ads/' + it.id + '.jpg" alt="" draggable="false"><figcaption>' + esc(it.d) + '</figcaption><button type="button" aria-label="떼기">×</button>';
      $('button', n).addEventListener('click', function (e) { e.stopPropagation(); book.splice(k, 1); saveBook(); render(); count(); });
      drag(n, it); board.appendChild(n);
    });
  }
  function drag(n, it) {
    n.addEventListener('pointerdown', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      var br = board.getBoundingClientRect(), nr = n.getBoundingClientRect(), ox = e.clientX - nr.left, oy = e.clientY - nr.top;
      n.setPointerCapture(e.pointerId); n.classList.add('hold'); board.appendChild(n);
      function mv(ev) { it.x = Math.max(0, Math.min(88, (ev.clientX - ox - br.left) / br.width * 100)); it.y = Math.max(0, Math.min(84, (ev.clientY - oy - br.top) / br.height * 100)); n.style.left = it.x + '%'; n.style.top = it.y + '%'; }
      function up() { n.classList.remove('hold'); n.removeEventListener('pointermove', mv); n.removeEventListener('pointerup', up); var i = book.indexOf(it); if (i > -1) { book.splice(i, 1); book.push(it); } saveBook(); }
      n.addEventListener('pointermove', mv); n.addEventListener('pointerup', up);
    });
  }
  tab.addEventListener('click', function () { panel.hidden = !panel.hidden; if (!panel.hidden) { render(); requestAnimationFrame(function () { panel.classList.add('on'); }); } else panel.classList.remove('on'); });
  $('.sb-x', panel).addEventListener('click', function () { panel.classList.remove('on'); setTimeout(function () { panel.hidden = true; }, 400); });
  $('.ca-book', modal).addEventListener('click', function () {
    if (!cur) return;
    var it = { id: cur.id, d: cur.d, x: 6 + Math.random() * 70, y: 4 + Math.random() * 36, r: +(Math.random() * 6 - 3).toFixed(1) };
    book.push(it); saveBook();
    // 엽서의 그림이 스크랩첩으로 날아감
    var a = piece.getBoundingClientRect(), b = tab.getBoundingClientRect();
    var fly = piece.cloneNode(true); fly.className = 'cut-fly';
    fly.style.cssText = 'left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px';
    document.body.appendChild(fly); piece.style.visibility = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      fly.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(.08) rotate(-8deg)';
      fly.style.opacity = '.3';
    }); });
    setTimeout(function () { fly.remove(); piece.style.visibility = ''; count(); tab.classList.add('got'); setTimeout(function () { tab.classList.remove('got'); }, 900); close(); }, reduce ? 0 : 900);
  });
  function makeBook(done) {
    if (!book.length) return;
    var W = 1600, H = 1000, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
    paper(x, W, H, '#b59d74');
    x.fillStyle = '#2a1f15'; x.font = '900 30px ' + SER; x.fillText('京城野錄 · 나의 스크랩帖', 50, 64);
    var br = board.getBoundingClientRect();
    Promise.all(book.map(function (it) { return imgFor(it.id).catch(function () { return null; }); })).then(function (ims) {
      book.forEach(function (it, k) {
        var im = ims[k]; if (!im) return;
        var node = $$('.sb-item', board)[k], w = node ? node.offsetWidth / br.width * W : 260, h = w / (im.width / im.height);
        var px = it.x / 100 * W, py = it.y / 100 * H;
        x.save(); x.translate(px + w / 2, py + h / 2); x.rotate(it.r * Math.PI / 180);
        x.shadowColor = 'rgba(20,14,8,.35)'; x.shadowBlur = 14; x.shadowOffsetY = 6; x.fillStyle = '#efe6d2'; x.fillRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16);
        x.shadowColor = 'transparent'; x.drawImage(im, -w / 2, -h / 2, w, h); x.restore();
        x.save(); x.translate(px + w / 2, py + h / 2); x.rotate(it.r * Math.PI / 180); x.fillStyle = '#2a1f15';
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { var cx = q[0] * (w / 2 + 8), cy = q[1] * (h / 2 + 8); x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx - q[0] * 30, cy); x.lineTo(cx, cy - q[1] * 30); x.closePath(); x.fill(); });
        x.restore();
      });
      if (book.length >= 5) { x.save(); x.translate(W - 150, H - 140); x.rotate(-0.12); x.strokeStyle = 'rgba(90,46,34,.85)'; x.fillStyle = 'rgba(90,46,34,.85)'; x.lineWidth = 3;
        x.beginPath(); x.arc(0, 0, 78, 0, 7); x.stroke(); x.lineWidth = 1.2; x.beginPath(); x.arc(0, 0, 64, 0, 7); x.stroke();
        x.textAlign = 'center'; x.font = '900 26px ' + SER; x.fillText('京城野錄', 0, -6); x.font = '700 20px ' + SER; x.fillText('스크랩 完', 0, 26); x.restore(); }
      done(c);
    });
  }
  $('.sb-save', panel).addEventListener('click', function () { makeBook(function (c) { download(c, '경성야록_스크랩첩.png'); }); });
  $('.sb-send', panel).addEventListener('click', function () { makeBook(function (c) { sendCard(c, '경성야록_스크랩첩.png', '京城野錄 · 나의 스크랩첩', '동아일보 옛 광고를 오려 붙인 스크랩첩'); }); });
  count();
})();
