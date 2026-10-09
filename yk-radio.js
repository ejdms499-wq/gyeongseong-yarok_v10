/* 사건 지면 공통 — 긔록 수신긔(라듸오) 뒷정리
   · 라듸오 칸을 벗어나면 라듸오가 스르르 꺼지고, 듣던 배경음악이 다시 흐름
   · 라듸오가 켜져 잇는 동안 축음긔(배경음악)를 누르면 라듸오를 끄고 곡조를 틂
   · 라듸오 옆에 「라듸오 끄기」 단추 */
(function () {
  'use strict';
  var root = document.getElementById('mrRadio'), bgm = document.getElementById('bgm');
  if (!root) return;
  var bgmWas = false, fadeT = null;
  function isOn() { return root.classList.contains('on'); }
  function off() { var p = root.querySelector('.rx-radio'); if (p && isOn()) p.click(); }
  function bgmIn() {
    if (!bgm || !bgm.paused) return;
    var target = bgm.volume > .05 ? bgm.volume : .35; bgm.volume = 0;
    var pr = bgm.play(); if (pr && pr.catch) pr.catch(function () {});
    clearInterval(fadeT); fadeT = setInterval(function () { bgm.volume = Math.min(target, bgm.volume + .02); if (bgm.volume >= target) clearInterval(fadeT); }, 80);
  }
  /* 라듸오를 켜기 직전, 배경음악이 흐르고 잇섯는지 기억 */
  function mark() { if (!isOn()) bgmWas = !!(bgm && !bgm.paused); }
  root.addEventListener('pointerdown', mark, true);
  root.addEventListener('keydown', mark, true);
  /* 칸을 벗어나면 끔 */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting || !isOn()) return;
        off(); if (bgmWas) setTimeout(bgmIn, 350);
      });
    }, { threshold: 0, rootMargin: '-10% 0px -10% 0px' }).observe(root);
  }
  /* 축음긔 단추 — 라듸오가 켜져 잇스면 먼저 끔 */
  var gb = document.querySelector('.bgm-toggle');
  if (gb) gb.addEventListener('click', function () { if (isOn()) off(); }, true);
  /* 「라듸오 끄기」 단추 */
  var css = document.createElement('style');
  css.textContent = '.yk-rx-off{position:absolute;right:14px;top:16px;z-index:5;display:none;align-items:center;gap:8px;padding:7px 16px 6px;border:1px solid rgba(236,222,190,.45);background:rgba(20,16,12,.72);color:#ecdebe;font:inherit;font-size:12.5px;letter-spacing:.2em;cursor:pointer;transition:background .3s,color .3s}' +
    '.yk-rx-off i{width:8px;height:8px;border-radius:50%;background:#e0a35a;box-shadow:0 0 8px #e0a35a}' +
    '.yk-rx-off:hover{background:#ecdebe;color:#1e1913}' +
    '#mrRadio.on .yk-rx-off{display:inline-flex}';
  document.head.appendChild(css);
  var room = root.querySelector('.rx-room') || root;
  if (getComputedStyle(room).position === 'static') room.style.position = 'relative';
  var b = document.createElement('button'); b.type = 'button'; b.className = 'yk-rx-off'; b.innerHTML = '<i></i>라듸오 끄기';
  b.addEventListener('click', function (e) { e.stopPropagation(); off(); if (bgmWas) setTimeout(bgmIn, 350); });
  room.appendChild(b);
})();
