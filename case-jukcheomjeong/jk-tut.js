/* 경성야록 · 죽첨정 — 지면 우의 ▸ 표 · 장치마다 「이건 무어요」(그 장치 설명만)
   백백교 지면과 같은 방식. 번쩍임 없음 · 모든 변화는 천천히 */
(function () {
  'use strict';
  var D = document, W = window;
  var $ = function (s, r) { return (r || D).querySelector(s); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function H(o, k) { return k && k !== o ? '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>' : '<span class="hj" tabindex="0">' + o + '</span>'; }

  /* ── 지면 우의 표 : 같은 모양, 세 가지 손짓 ── */
  var MARKS = [
    ['.case-brief .cb-steps', 'tap', '봉함을 뜯어 보시압', '봉함을 눌러 보세요', 'click'],
    ['#places', 'tap', '화살표로 넘기시압', '화살표로 넘겨 보세요', 'click'],
    ['.report-history .book-wrap', 'tap', '날자를 넘기고, 손잡이를 당기시압', '날짜를 넘기고, 손잡이를 당겨 보세요', 'click'],
    ['#story .st-list', 'down', '천천히 내리시압', '천천히 내려 보세요', 'scroll'],
    ['#extra .ex-in', 'down', '멈추고 지켜보시압', '멈춰서 지켜보세요', 'scroll'],
    ['#misWrite', 'tap', '두 쪽을 바꿔 보시압', '두 탭을 바꿔 보세요', 'click'],
    ['#mrRadio', 'tap', '켜고, 다이알을 돌리시압', '켜고, 다이얼을 돌려 보세요', 'click']
  ];
  var ICON = { tap: '<i class="bt-ic tap" aria-hidden="true"></i>', down: '<i class="bt-ic down" aria-hidden="true"></i>' };
  MARKS.forEach(function (m) {
    var el = $(m[0]); if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var b = D.createElement('span'); b.className = 'bt-mark ' + m[1]; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = ICON[m[1]] + '<b>' + H(m[2], m[3]) + '</b>';
    el.appendChild(b);
    var done = function () { if (b.classList.contains('did')) return; b.classList.add('did'); b.innerHTML = '<b>' + H('해 봄', '해 봤어요') + '</b>'; setTimeout(function () { b.classList.add('gone'); }, 2600); };
    if (m[4] === 'click') el.addEventListener('click', function (e) { if (!e.target.closest('.bt-q')) done(); });
    else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { setTimeout(done, 6000); io.disconnect(); } }); }, { threshold: [.35] }); io.observe(el); }
  });

  /* ── 이건 무어요? : 장치마다 작은 표 하나 — 누르면 그 장치 설명만 ── */
  var HELP = [
    ['.case-brief .cb-steps', '사건 요지 · 봉함', '사건 요지 · 봉함',
      '이십삼 일을 세 칸으로 줄인 것이오. 셋째 칸 「진상」은 봉해 두엇소 — 호외에서 저절로 열리지만, 봉함을 누르면 먼저 뜯어 볼 수도 잇소. 둘째 칸의 붉은 「오보」 도장도 눈여겨보시압.',
      '23일을 세 칸으로 줄인 거예요. 셋째 칸 「진상」은 봉해 두었어요 — 호외에서 저절로 열리지만, 봉함을 누르면 먼저 뜯어 볼 수도 있어요. 둘째 칸의 「오보」 도장도 눈여겨보세요.'],
    ['#rumor .ru-in', '지워진 두 글자', '지워진 두 글자',
      '골목에 떠돌든 말에서 두 글자가 빈 칸으로 남아 잇소. 누를 것은 업소 — 이 말을 기억해 두면, 호외 장에서 빈 칸이 채워지오. 옛말에 손을 대면 지금 말로 바뀌오.',
      '골목에 떠돌던 말에서 두 글자가 빈칸으로 남아 있어요. 누를 것은 없어요 — 이 말을 기억해 두면, 호외 장에서 빈칸이 채워져요. 옛말에 마우스를 대면 지금 말로 바뀌어요.'],
    ['#places', '그때와 이제', '그때와 지금',
      '그 매립지가 잇든 동네의 옛 사진과 오늘 사진이오. 현장 그 자리는 아니고, 가튼 동네의 건물이오. 아래 장소 긔록에는 1936년 바탕 지도가 부텃소.',
      '그 매립지가 있던 동네의 옛 사진과 오늘 사진이에요. 현장 그 자리는 아니고, 같은 동네의 건물이에요. 아래 장소 기록에는 1936년 지도가 붙어 있어요.'],
    ['.report-history .book-wrap', '신문이 받아 적은 말', '신문이 받아 적은 말',
      '① 우의 날자 줄이나 양옆 화살표로 그날 신문을 넘기시압. ② 왼편 지면의 손잡이를 왼쪽으로 당기면 2026년 뉴스로 바뀌오. ③ 오른편은 「오늘 말로 읽기 · 간추려 읽기」로 바꿔 읽고, 「긔록에게 뭇다」에서 문답을 보시압. ④ 맨 아래 「이날 지면에 오른 말」이 모이오 — 여섯을 다 모으면 호외에서 다시 맛나오.',
      '① 위의 날짜 줄이나 양옆 화살표로 그날 신문을 넘겨 보세요. ② 왼쪽 지면의 손잡이를 왼쪽으로 당기면 2026년 뉴스로 바뀌어요. ③ 오른쪽은 「오늘 말로 읽기 · 요약해서 읽기」로 바꿔 읽고, 「기록에게 묻다」에서 문답을 보세요. ④ 맨 아래 「이날 지면에 오른 말」이 모여요 — 여섯 개를 다 모으면 호외에서 다시 만나요.'],
    ['.ledger .lg-book', '의심의 장부', '의심의 장부',
      '서대문서가 의심한 이들을 지면에 실린 대로 다시 적은 장부요. 누가, 무엇을 근거로 의심바닷는지 한 줄씩 읽으시압. 맨 아래 빈 칸은 — 호외 장을 지나면 채워지오.',
      '서대문경찰서가 의심한 사람들을 신문에 실린 대로 다시 적은 장부예요. 누가, 무엇을 근거로 의심받았는지 한 줄씩 읽어 보세요. 맨 아래 빈칸은 — 호외 장을 지나면 채워져요.'],
    ['#story .st-list', '지면 뒤의 스물세 날', '신문 뒤의 23일',
      '휠을 천천히 내리면 수사의 장면이 하나씩 켜지고, 뒤의 그림이 바뀌오. 왼편 판은 ① 발견 뒤 며칠째인지 ② 범인 칸(끗까지 未詳) ③ 쫏는 단서 — 실패한 단서는 줄이 그어지고 까닭이 적히오. 비 오는 장면에서는 빗소리가 나오. 화면 아래 「빗소리 듯기 · 끄기」로 켜고 끌 수 잇소.',
      '휠을 천천히 내리면 수사 장면이 하나씩 켜지고, 뒤의 그림이 바뀌어요. 왼쪽 판은 ① 발견 뒤 며칠째인지 ② 범인 칸(끝까지 미상) ③ 쫓는 단서 — 실패한 단서는 줄이 그어지고 이유가 적혀요. 비 오는 장면에서는 빗소리가 나요. 화면 아래 「빗소리 듣기 · 끄기」로 켜고 끌 수 있어요.'],
    ['#extra .ex-in', '호외', '호외',
      '누를 것 업소. 화면에 멈추면 호외 제목이 한 줄씩 올라오고, 진상이 드러나고, 처음의 빈 칸이 채워지오. 끗으로 이십삼 일 동안 지면에 오른 말들이 하나씩 지워지오 — 끗까지 기다려 보시압.',
      '누를 것은 없어요. 화면에 멈추면 호외 제목이 한 줄씩 올라오고, 진상이 드러나고, 처음의 빈칸이 채워져요. 끝으로 23일 동안 신문에 오른 말들이 하나씩 지워져요 — 끝까지 기다려 보세요.'],
    ['#misWrite', '오보 고쳐 쓰기', '오보 고쳐 쓰기',
      '「그때처럼 쓰기」와 「오늘의 보도 준칙대로」를 눌러 바꿔 보시압. 가튼 사실이 엇더케 다르게 적히는지 보이오. 오른편은 칠십일 년 뒤 되풀이된 일이오.',
      '「그때처럼 쓰기」와 「오늘의 보도 준칙대로」를 눌러 바꿔 보세요. 같은 사실이 어떻게 다르게 적히는지 보여요. 오른쪽은 71년 뒤 되풀이된 일이에요.'],
    ['#mrRadio', '미신의 주파수', '미신의 주파수',
      '① 왼편 라듸오를 누르면 켜지오. ② 가운데 다이알을 마우스로 잡고 돌리거나, 우의 연도를 누르시압. ③ 주파수가 잡히면 방송이 나오고, 화면의 카드뉴스를 누르면 크게 보이오. ④ 주파수 사이에서는 두 시대를 잇는 한 줄이 들리오.',
      '① 왼쪽 라디오를 누르면 켜져요. ② 가운데 다이얼을 마우스로 잡고 돌리거나, 위의 연도를 눌러 보세요. ③ 주파수가 잡히면 방송이 나오고, 화면의 카드뉴스를 누르면 크게 보여요. ④ 주파수 사이에서는 두 시대를 잇는 한 줄이 들려요.']
  ];
  HELP.forEach(function (h) {
    var el = $(h[0]); if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var q = D.createElement('button'); q.type = 'button'; q.className = 'bt-q';
    q.setAttribute('aria-label', h[2] + ' — 이 장치 설명 보기');
    q.innerHTML = '<i aria-hidden="true">？</i><b>' + H('이건 무어요', '이건 뭐예요') + '</b>';
    ['click', 'pointerdown', 'pointerup', 'mousedown'].forEach(function (ev) { q.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    q.addEventListener('click', function (e) { e.preventDefault(); if (W.ykGuide) W.ykGuide({ sel: h[0], t: [h[1], h[2]], b: [h[3], h[4]] }); });
    el.appendChild(q);
  });
})();
