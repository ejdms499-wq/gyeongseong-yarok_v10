/* 경성야록 · 손기정 — 지면 우의 ▸ 표 · 장치마다 「이건 무어요」(그 장치 설명만)
   백백교 · 죽첨정 · 마리아 지면과 같은 방식. 번쩍임 없음 · 모든 변화는 천천히 */
(function () {
  'use strict';
  var D = document, W = window;
  var $ = function (s, r) { return (r || D).querySelector(s); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function H(o, k) { return k && k !== o ? '<span class="hj" tabindex="0" data-ko="' + esc(k) + '">' + o + '</span>' : '<span class="hj" tabindex="0">' + o + '</span>'; }

  /* ── 지면 우의 표 : ▸ 누르는 곳 · ↓ 내리는 곳 · ◐ 손을 대는 곳 ── */
  var MARKS = [
    ['.nt-pics .sk-film', 'tap', '눌러 보시압', '눌러서 재생해 보세요', 'click'],
    ['.report-history .book-wrap', 'tap', '날자를 넘기고, 손잡이를 당기시압', '날짜를 넘기고, 손잡이를 당겨 보세요', 'click'],
    ['.sk-podium .pd-photo', 'hover', '손을 대 보시압', '마우스를 대 보세요', 'hover'],
    ['.sk-brush .bs-plate', 'hover', '문질러 보시압', '마우스로 문질러 보세요', 'hover'],
    ['.sk-blank .bk-grid', 'down', '천천히 내리시압', '천천히 내려 보세요', 'scroll'],
    ['.sk-name .nm-grid', 'tap', '카드를 누르시압', '카드를 눌러 보세요', 'click'],
    ['.sk-marks .mk-row', 'tap', '영상을 누르시압', '영상을 눌러 보세요', 'click']
  ];
  var ICON = { tap: '<i class="bt-ic tap" aria-hidden="true"></i>', down: '<i class="bt-ic down" aria-hidden="true"></i>', hover: '<i class="bt-ic hover" aria-hidden="true"></i>' };
  MARKS.forEach(function (m) {
    var el = $(m[0]); if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var b = D.createElement('span'); b.className = 'bt-mark ' + m[1]; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = ICON[m[1]] + '<b>' + H(m[2], m[3]) + '</b>';
    el.appendChild(b);
    var done = function () { if (b.classList.contains('did')) return; b.classList.add('did'); b.innerHTML = '<b>' + H('해 봄', '해 봤어요') + '</b>'; setTimeout(function () { b.classList.add('gone'); }, 2600); };
    if (m[4] === 'click') el.addEventListener('click', function (e) { if (!e.target.closest('.bt-q')) done(); });
    else if (m[4] === 'hover') { var t = null; el.addEventListener('mouseenter', function () { t = setTimeout(done, 1800); }); el.addEventListener('mouseleave', function () { clearTimeout(t); }); el.addEventListener('touchstart', function () { setTimeout(done, 1200); }, { passive: true }); }
    else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { setTimeout(done, 6000); io.disconnect(); } }); }, { threshold: [.2] }); io.observe(el); }
  });

  /* ── 이건 무어요? : 장치마다 작은 표 하나 — 누르면 그 장치 설명만 ── */
  var HELP = [
    ['.case-brief .cb-steps', '물음 셋 · 봉함', '물음 셋 · 봉함',
      '이 지면이 쫓아가는 물음 셋이오. 셋재 칸 「그 값은 무엇이엇나」는 봉해 두엇소 — 지면을 내려가면 드러나지만, 봉함을 누르면 먼저 뜻어 볼 수 잇소.',
      '이 페이지가 쫓아가는 물음 셋이에요. 셋째 칸 「그 값은 무엇이었나」는 봉해 두었어요 — 내려가면 드러나지만, 봉함을 누르면 먼저 뜯어 볼 수 있어요.'],
    ['.sk-night .nt-course', '오후 열한 시 이 분', '오후 열한 시 이 분',
      '① 우의 다섯 점은 그날 레이스의 구간이오 — 출발 · 8km · 15km · 31km · 결승. 점마다 그때의 순위와 시각이 적혀 잇소. ② 아래 「출발선」 영상을 누르면 1936년의 실제 기록 영상이 소리 업시 흐르오. ③ 맨 아래 세 칸은 그 밤 경성 세종로 동아일보사 압의 장면이오.',
      '① 위의 다섯 점은 그날 레이스 구간이에요 — 출발 · 8km · 15km · 31km · 결승. 점마다 그때의 순위와 시각이 적혀 있어요. ② 아래 「출발선」 영상을 누르면 1936년 실제 기록 영상이 소리 없이 재생돼요. ③ 맨 아래 세 칸은 그 밤 경성 세종로 동아일보사 앞의 장면이에요.'],
    ['.report-history .book-wrap', '기뻐한 지면', '기뻐한 지면',
      '① 우의 날자 줄이나 양옆 화살표로 그날 신문을 넘기시압 — 8월 10 · 11 · 12 · 13일. ② 왼편 원문 지면 가운데 손잡이를 왼쪽으로 당기면 가튼 긔사가 2026년 뉴스로 바뀌오. ③ 오른편은 「오늘 말로 읽기 · 간추려 읽기」로 바꿔 읽고, 「긔록에게 뭇다」에서 문답을 보시압. ④ 지면마다 「실제 동아일보 기사 · 당대 다른 신문」 표가 부터 잇소.',
      '① 위의 날짜 줄이나 양옆 화살표로 그날 신문을 넘겨 보세요 — 8월 10 · 11 · 12 · 13일. ② 왼쪽 원문 지면 가운데 손잡이를 왼쪽으로 당기면 같은 기사가 2026년 뉴스로 바뀌어요. ③ 오른쪽은 「오늘 말로 읽기 · 요약해서 읽기」로 바꿔 읽고, 「기록에게 묻다」에서 문답을 보세요. ④ 지면마다 「실제 동아일보 기사 · 당대 다른 신문」 표시가 붙어 있어요.'],
    ['.sk-podium .pd-grid', '가슴을 가린 나무', '가슴을 가린 나무',
      '1936년 8월 9일 시상대의 실제 기록 사진이오. 사진에 마우스를 대거나 누르면 — 묘목 화분이 가린 손 군의 가슴과, 가릴 것이 업던 남승룡의 가슴이 밝아지오.',
      '1936년 8월 9일 시상대의 실제 기록 사진이에요. 사진에 마우스를 대거나 누르면 — 묘목 화분이 가린 손기정의 가슴과, 가릴 것이 없던 남승룡의 가슴이 밝아져요.'],
    ['.sk-brush .bs-grid', '붓 · 지운 손', '붓 · 지운 손',
      '그날 편집국의 손이 되어 보는 칸이오. ① 왼편 사진의 가슴을 마우스로 문지르면 — 표지가 조곰씩 지워지오. ② 문지를수록 오른편의 차례 1~4가 하나씩 켜지오. ③ 끗까지 지우면 실제로 실린 1936년 8월 25일 동아일보 지면이 나오오. (차례는 경찰 보고에 적힌 대로 · 잡아간 쪽의 긔록)',
      '그날 편집국의 손이 되어 보는 칸이에요. ① 왼쪽 사진의 가슴을 마우스로 문지르면 — 표식이 조금씩 지워져요. ② 문지를수록 오른쪽의 순서 1~4가 하나씩 켜져요. ③ 끝까지 지우면 실제로 실린 1936년 8월 25일 동아일보 지면이 나와요. (순서는 경찰 보고에 적힌 대로 · 잡아간 쪽의 기록)'],
    ['.sk-roster .rs-book', '편집국 명부', '편집국 명부',
      '사진이 나간 뒤 비어 간 의자들이오. 일홈 엽헤 「拘禁(구금)」 · 「辭任(사임)」 도장이 찍혀 잇소. 아래에는 풀려나며 쓴 서약 세 줄과 — 아즉 풀리지 아니한 물음 둘이 이어지오. (명부 모양은 재구성)',
      '사진이 나간 뒤 비어 간 의자들이에요. 이름 옆에 「拘禁(구금)」 · 「辭任(사임)」 도장이 찍혀 있어요. 아래에는 풀려나며 쓴 서약 세 줄과 — 아직 풀리지 않은 물음 둘이 이어져요. (명부 형식은 재구성)'],
    ['.sk-blank .bk-grid', '이백칠십팔 일', '278일',
      '네모 하나가 하로치 신문이오. 정간된 날부터 하나씩 어두워지고, 밝은 칸은 그 사이의 일(조선중앙일보 휴간 · 손 군 귀국 · 속간)이오. 아래에는 귀국 날의 실제 사진과 — 278일 만에 나온 속간 지면이 이어지오.',
      '네모 하나가 하루치 신문이에요. 정간된 날부터 하나씩 어두워지고, 밝은 칸은 그 사이의 일(조선중앙일보 휴간 · 손기정 귀국 · 속간)이에요. 아래에는 귀국 날의 실제 사진과 — 278일 만에 나온 속간 지면이 이어져요.'],
    ['.sk-name .nm-grid', '손긔졍 KOREAN', '손기정 KOREAN',
      '① 엽서 카드의 「실물 엽서 보기」를 누르면 1936년 8월 15일 실제 엽서가 크게 열리오. ② 셋재 카드에 마우스를 대거나 누르면 — 공식 긔록의 「JPN」 자리에 그가 적은 「KOREAN」이 보이오.',
      '① 엽서 카드의 「실물 엽서 보기」를 누르면 1936년 8월 15일 실제 엽서가 크게 열려요. ② 셋째 카드에 마우스를 대거나 누르면 — 공식 기록의 「JPN」 자리에 그가 적은 「KOREAN」이 보여요.'],
    ['.sk-marks .mk-row', '가슴의 표지', '가슴의 표지',
      '1936 · 1945 · 1988 · 지금 — 그의 가슴에 달린 것들이오. 1936년 칸의 영상을 누르면 백림 전광판에 「SON · JAPAN」이 뜨는 실제 기록 영상이 흐르오. 맨 끗 「지금」 칸과 견주어 보시압.',
      '1936 · 1945 · 1988 · 지금 — 그의 가슴에 달린 것들이에요. 1936년 칸의 영상을 누르면 베를린 전광판에 「SON · JAPAN」이 뜨는 실제 기록 영상이 재생돼요. 맨 끝 「지금」 칸과 비교해 보세요.']
  ];
  HELP.forEach(function (h) {
    var el = null; h[0].split(',').some(function (s) { el = $(s.trim()); return !!el; }); if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var q = D.createElement('button'); q.type = 'button'; q.className = 'bt-q';
    q.setAttribute('aria-label', h[2] + ' — 이 장치 설명 보기');
    q.innerHTML = '<i aria-hidden="true">？</i><b>' + H('이건 무어요', '이건 뭐예요') + '</b>';
    ['click', 'pointerdown', 'pointerup', 'mousedown'].forEach(function (ev) { q.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    q.addEventListener('click', function (e) { e.preventDefault(); if (W.ykGuide) W.ykGuide({ sel: h[0].split(',')[0].trim(), t: [h[1], h[2]], b: [h[3], h[4]] }); });
    el.appendChild(q);
  });
})();
