/* 경성야록 특전 — 네 사건(죽첨정 · 마리아 · 손기정 · 백백교)을 끝까지 읽으면 편집국 출입 암호를 전보로 보냄
   · 사건 지면: 맨 아래(.page-foot)까지 내려오면 「읽음」 + 전보 쪽지(몇째인지)
   · 본지: 넷 다 읽으면 전보가 와 잇음 + 편집국 칸에 진행 표시
   · 편집국 문 앞: 암호 힌트
   · 기록은 창을 새로 열면 지워짐 (yk-zoom.js 맨 위 초기화) */
(function (W, D) {
  'use strict';
  var YKB = (function () { try { var c = D.currentScript && D.currentScript.src; return c ? c.replace(/yk-reward\.js.*$/, '') : ''; } catch (e) { return ''; } })();
  var PASS = '자정';
  var CASES = [['jk', '죽첨정', 'case-jukcheomjeong'], ['maria', '마리아', 'case-maria'], ['sk', '손기정', 'case-sonkijeong'], ['bb', '백백교', 'case-baekbaekgyo']];
  var NUM = ['첫째', '둘째', '셋째', '넷째'];
  function get() { try { return JSON.parse(localStorage.getItem('yk-read') || '{}') || {}; } catch (e) { return {}; } }
  function put(o) { try { localStorage.setItem('yk-read', JSON.stringify(o)); } catch (e) {} }
  function count() { var o = get(), n = 0; CASES.forEach(function (c) { if (o[c[0]]) n++; }); return n; }
  /* 한 번 받은 전보(암호)는 새로 고쳐도 지니고 잇음 — 진행 표시만 처음부터 */
  function got() { try { return localStorage.getItem('yk-pass') === '1'; } catch (e) { return false; } }
  function done() { var d = count() >= CASES.length; if (d) { try { localStorage.setItem('yk-pass', '1'); } catch (e) {} } return d || got(); }
  function dots() { var o = get(); return CASES.map(function (c) { return '<i class="ykr-d' + (o[c[0]] ? ' on' : '') + '" title="' + c[1] + '"></i>'; }).join(''); }
  W.ykReward = { PASS: PASS, get: get, count: count, done: done, dots: dots, cases: CASES };

  /* 전보 쪽지 꼴 (한 번만 넣음) */
  function css() {
    if (D.getElementById('ykr-css')) return;
    var s = D.createElement('style'); s.id = 'ykr-css';
    s.textContent =
      '.ykr-tel{position:fixed;right:24px;bottom:24px;z-index:9000;width:min(340px,calc(100vw - 32px));padding:18px 20px 14px;background:linear-gradient(180deg,#efe6cf,#e3d6b6);color:#1e1913;border:1px solid rgba(58,49,40,.6);box-shadow:0 22px 44px -16px rgba(0,0,0,.65);font-family:"Nanum Myeongjo","Noto Serif KR",serif;transform:translateY(24px) rotate(-.6deg);opacity:0;transition:transform .5s cubic-bezier(.3,.8,.3,1),opacity .4s}' +
      '.ykr-tel.on{transform:translateY(0) rotate(-.6deg);opacity:1}' +
      '.ykr-tel::before{content:"";position:absolute;inset:6px;border:1px solid rgba(58,49,40,.28);pointer-events:none}' +
      '.ykr-hd{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:7px;border-bottom:1px solid rgba(58,49,40,.6)}' +
      '.ykr-hd b{font-family:"Noto Serif KR",serif;font-weight:900;font-size:17px;letter-spacing:.4em}' +
      '.ykr-hd span{font-size:11px;letter-spacing:.14em;color:#4a3f31}' +
      '.ykr-bd{margin-top:10px;font-size:14px;line-height:1.85}' +
      '.ykr-bd strong{font-family:"Noto Serif KR",serif;font-weight:900;font-size:20px;letter-spacing:.3em;padding:0 .2em;border-bottom:2px solid #1e1913}' +
      '.ykr-ft{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;color:#4a3f31}' +
      '.ykr-ft button,.ykr-ft a{font:inherit;color:#1e1913;background:none;border:0;border-bottom:1px solid #1e1913;padding:0 0 1px;cursor:pointer;text-decoration:none}' +
      '.ykr-x{position:absolute;right:10px;top:6px;font-size:18px;line-height:1;color:#6e6250;background:none;border:0;cursor:pointer}' +
      '.ykr-dots{display:inline-flex;gap:5px;vertical-align:middle;margin-left:6px}' +
      '.ykr-d{width:9px;height:9px;border:1px solid currentColor;display:inline-block}' +
      '.ykr-d.on{background:currentColor}' +
      /* 특전 전보 — 군더더기 없는 한 장: 작은 머리글 · 큰 두 글자 · 가는 괘선 */
      '.ykg-run .ykr-tel{opacity:0!important;transform:translateY(30px)!important;pointer-events:none!important}' +
      '.ykr-tel.sp{width:min(330px,calc(100vw - 32px));padding:22px 26px 18px;background:#ede5cf;border:0;color:#1e1913;transform:translateY(22px);box-shadow:0 30px 60px -24px rgba(0,0,0,.75),0 1px 3px rgba(0,0,0,.2)}' +
      '.ykr-tel.sp.on{transform:none}' +
      '.ykr-tel.sp::before{inset:7px;border:1px solid rgba(30,25,19,.22)}' +
      '.ykr-sh{display:flex;justify-content:space-between;align-items:center;font-size:10px;letter-spacing:.34em;color:#6e6250}' +
      '.ykr-sh b{display:inline-flex;align-items:center;gap:8px;font-weight:700;color:#1e1913}' +
      '.ykr-sh b i{width:14px;height:14px;display:inline-grid;place-items:center;background:#8a2a21;color:#ede5cf;font-style:normal;font-size:9px;letter-spacing:0;font-family:"Noto Serif KR",serif;font-weight:900}' +
      '.ykr-to{margin:22px 0 0;font-size:12.5px;letter-spacing:.16em;color:#3a3128}' +
      '.ykr-key{margin:18px 0 0;padding:16px 0 14px;border-top:1px solid #1e1913;border-bottom:1px solid rgba(30,25,19,.35);text-align:center}' +
      '.ykr-key small{display:block;font-size:9.5px;letter-spacing:.5em;color:#6e6250}' +
      '.ykr-key strong{display:block;margin-top:8px;padding:0 0 0 .55em;border:0;background:none;font-family:"Noto Serif KR",serif;font-weight:900;font-size:46px;line-height:1;letter-spacing:.55em;color:#1e1913;filter:blur(6px);opacity:0;transition:filter 1.4s ease .5s,opacity 1.4s ease .5s}' +
      '.ykr-tel.on .ykr-key strong{filter:none;opacity:1}' +
      '.ykr-hush{margin:12px 0 0;font-size:11.5px;letter-spacing:.14em;color:#6e6250;text-align:center}' +
      '.ykr-tel.sp .ykr-ft{margin:16px 0 0;font-size:10px;letter-spacing:.24em;color:#8b7f6b}' +
      '.ykr-tel.sp .ykr-ft a{font-size:12px;letter-spacing:.14em;font-weight:700;color:#1e1913;border-bottom:1px solid #1e1913}' +
      '.ykr-tel.sp .ykr-x{right:14px;top:10px;font-size:15px;color:#8b7f6b;z-index:2}' +
      '@media (prefers-reduced-motion:reduce){.ykr-tel{transition:none}}';
    D.head.appendChild(s);
  }
  function tel(html, foot, wait) {
    css();
    var old = D.querySelector('.ykr-tel'); if (old) old.remove();
    var t = D.createElement('div'); t.className = 'ykr-tel'; t.setAttribute('role', 'status');
    var sp = /<strong>/.test(html);
    if (sp) {
      t.classList.add('sp');
      var key = (html.match(/<strong>([^<]*)<\/strong>/) || [0, PASS])[1];
      t.innerHTML = '<button type="button" class="ykr-x" aria-label="닫기">×</button>' +
        '<p class="ykr-sh"><b><i>特</i>電 報</b><span>子正 · 京城</span></p>' +
        '<p class="ykr-to">네 사건을 끗까지 닑은 독자께.</p>' +
        '<p class="ykr-key"><small>편집국 출입 암호</small><strong>' + key + '</strong></p>' +
        '<p class="ykr-hush">문 압 수위에게만 — 남에겐 비밀이오.</p>' +
        '<div class="ykr-ft">' + (foot || '') + '</div>';
    } else {
      t.innerHTML = '<button type="button" class="ykr-x" aria-label="닫기">×</button><div class="ykr-hd"><b>電報</b><span>京城野錄 編輯局 發</span></div><div class="ykr-bd">' + html + '</div><div class="ykr-ft">' + (foot || '') + '</div>';
    }
    D.body.appendChild(t);
    /* 보는 법(안내)이 떠 잇는 동안은 기다렷다가 — 안내가 끗나면 그때 내려옴 */
    var busy = function () { return W.ykGuideOn || D.querySelector('.ykg-veil'); };
    var on = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('on'); }); }); };
    if (busy()) { var wt = setInterval(function () { if (!busy()) { clearInterval(wt); setTimeout(on, 900); } }, 400); } else on();
    var close = function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 500); };
    t.querySelector('.ykr-x').addEventListener('click', close);
    if (wait) setTimeout(close, wait);
    return t;
  }
  W.ykReward.tel = tel;

  var path = location.pathname.replace(/\\/g, '/');
  var here = null; CASES.forEach(function (c) { if (path.indexOf('/' + c[2] + '/') > -1) here = c; });

  /* ── 사건 지면: 맨 아래까지 오면 읽음 ── */
  if (here) {
    var mark = function () {
      var o = get(); if (o[here[0]]) return;
      o[here[0]] = 1; put(o);
      var n = count();
      if (n >= CASES.length) tel('「' + here[1] + '」까지, <b>네 사건을 다 읽엇소.</b><br>본지로 도라가면 편집국에서 보낸 전보가 와 잇소.', '<span class="ykr-dots" style="color:#1e1913">' + dots() + '</span><a href="../index.html">본지로 →</a>', 0);
      else tel('「' + here[1] + '」 긔록을 끗까지 읽엇소. 네 사건 중 <b>' + NUM[n - 1] + '</b>.<br>넷을 다 읽으면 <b>편집국 출입 암호</b>를 보내 드리오.', '<span class="ykr-dots" style="color:#1e1913">' + dots() + '</span><span>' + n + ' / 4</span>', 9000);
    };
    var start = function () {
      var foot = D.querySelector('.page-foot'); if (!foot || !('IntersectionObserver' in W)) return;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !W.ykGuideOn && W.scrollY > 600) { mark(); io.disconnect(); } });
      }, { threshold: .6 });
      io.observe(foot);
    };
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', start); else start();
    return;
  }

  /* ── 본지: 편집국 칸 진행 표시 + 넷 다 읽으면 전보 ── */
  var isMain = /\/index\.html$|\/$/.test(path) && !/\/case|\/sikjasil|\/radio-device|\/main-/.test(path);
  if (isMain) {
    var paint = function () {
      var el = D.getElementById('dkKey'); if (!el) return;
      css();
      el.innerHTML = done()
        ? '<b>특전</b> 편집국 출입 암호 · <strong>' + PASS + '</strong> <span>(전보로 받음)</span>'
        : '<b>특전</b> 네 사건을 끗까지 읽으면 편집국 출입 암호가 전보로 오오 <span class="ykr-dots">' + dots() + '</span> <span>' + count() + ' / 4</span>';
    };
    var go = function () {
      paint();
      var seen = false; try { seen = sessionStorage.getItem('yk-tel-shown') === '1'; } catch (e) {}
      if (done() && !seen) {
        try { sessionStorage.setItem('yk-tel-shown', '1'); } catch (e) {}
        setTimeout(function () {
          tel('네 사건 긔록을 끗까지 닑은 독자께 —<br>편집국 출입 암호 <strong>' + PASS + '</strong><br>문 압 수위에게만 말하시오 · 남에겐 비밀', '<span>京城野錄 編輯局</span><a href="newsroom.html">편집국으로 →</a>', 0);
        }, 1600);
      }
    };
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
  }
})(window, document);
