/* =========================================================================
   경성야록 · 광고 모아보기 (adcollection.html) 의 광고 목록
   -------------------------------------------------------------------------
   광고를 더 넣는 법
     1) 광고 사진을 assets/adcollection/ 폴더에 넣기 (예: abc-1937.jpg)
     2) 아래 ADS 목록에 한 덩어리 복사해서 붙이고 내용만 고치기
        id    : 사진 파일 이름 (.jpg 뺀 것)
        date  : '1937-10-09' 꼴
        page  : 면 (모르면 '' 로 비워 둠)
        cat   : drug(의약) · store(백화점·상점) · beauty(화장품) · food(먹고 마시는 것) · goods(돈·물건)
        tb    : 결핵·폐병 광고면 true
        title : 광고 문구 (지면에 크게 적힌 말)
        who   : 광고주 / 상품
        after : (있으면) 마우스를 올렸을 때 · 크게 볼 때 나오는 '그 광고의 뒤' 이야기
        sheet : 이 광고가 실린 그날 지면 사진 (assets/adcollection/pages/ 안 파일 이름)
        sheetNote : 같은 날 지면에 실린 기사 한 줄
        check : 저해상 캡처에서 읽은 문구라 원문 확인이 필요하면 true
   ========================================================================= */
window.AD_CATS = [
  { id: 'all',    name: '전체' },
  { id: 'tb',     name: '결핵 · 폐병', note: '기획' },
  { id: 'drug',   name: '의약' },
  { id: 'store',  name: '백화점 · 상점' },
  { id: 'beauty', name: '화장품' },
  { id: 'food',   name: '먹고 마시는 것' },
  { id: 'goods',  name: '돈 · 물건' },
  { id: 'scrap',  name: '오려 둔 것' }
];

window.ADS = [
  { id: 'hwashin-1938', date: '1938-04-05', page: '2', cat: 'store', title: '和信百貨祭', who: '화신백화점 · 애국상품 전람회',
    after: '삼 년 전 정월 어느 저녁, 이 백화점은 불탔다. 두 달 뒤 화신은 「부흥 공작을 착착 진행!」이라는 광고를 냈다.',
    sheet: 'hwashin-fire-1935', sheetNote: '1935.1.27 호외 「和信大火災續報」' },
  { id: 'hwashin-1935', date: '1935-04-03', page: '4', cat: 'store', title: '復興工作을 着着進行!', who: '화신 · 경성 종로',
    after: '두 달 전, 1935년 1월 27일 저녁 화신 동관에서 불이 났다. 이 광고는 불탄 백화점이 낸 첫 인사다. "신춘 백화가 전 점에 충만!"',
    sheet: 'hwashin-fire-1935', sheetNote: '1935.1.27 호외 「和信大火災續報」' },
  { id: 'jesaengdang-1935', date: '1935-04-03', page: '4', cat: 'drug', title: '淸心保命丹 本家', who: '제생당약방 본포',
    sheet: 'p-1935-04', sheetNote: '창간 15주년 축하 광고면 · 화신 부흥 광고 옆' },
  { id: 'samyongjeong-1938', date: '1938-09-29', page: '2', cat: 'drug', title: '高速度 補血強壯劑 蔘茸精', who: '아사히제약 · "건강의 원천, 인류의 생명수"',
    after: '같은 날 같은 면에 「商美展遂開幕」 — 동아일보 광고부가 연 중등상업학교 상업미술작품전 개막 소식이 실렸다. 전시장은 화신 갤러리였다.',
    sheet: 'p-1938-09-eve', sheetNote: '같은 면 「商美展遂開幕」 (석간)' },
  { id: 'deokrimsa-1937', date: '1937-10-09', page: '1', cat: 'drug', tb: true, title: '肺病全快法', who: '덕림사 (오사카) · "광명의 당신에게"',
    after: '부제는 "광명의 당신에게". 오사카의 절이 조선 신문에 낸 폐병 광고다. 이듬해 오월, 화신 옆 길에선 가래를 공짜로 검사해 주었다.',
    sheet: 'p-1937', sheetNote: '1면 하단 광고란' },
  { id: 'neotone-1939', date: '1939-08-13', page: '1', cat: 'drug', tb: true, title: '무서운 結核病, 患者百萬以上!', who: '유한양행 · 네오톤',
    after: '결핵 환자 백만에게 약을 팔던 이 회사는 지금도 영업 중이다. 이 자리, 2026년엔 귀사의 광고.',
    sheet: 'p-1939', sheetNote: '1면 전단 광고' },
  { id: 'naose-1936', date: '1936-03-31', page: '2', cat: 'drug', tb: true, check: true, title: '폐병 · 부족증 · 늑막염엔 나오세', who: '연속 의약 광고',
    after: '같은 날 같은 면에 「春風에 迷兒」 — 화신 앞에서 울며 헤매던 아홉 살 아이의 기사가 실렸다.',
    sheet: 'mia-1936', sheetNote: '같은 면 「春風에 迷兒」' },
  { id: 'coamezin-1937', date: '1937-10-09', page: '1', cat: 'drug', title: '月經催進劑 コアメジン', who: '코아메진',
    sheet: 'p-1937', sheetNote: '1면 하단 · 폐병전쾌법 옆' },
  { id: 'proter-1938', date: '1938-05-20', page: '', cat: 'drug', check: true, title: '매독엔 푸로다', who: 'PROTER',
    after: '이 광고가 실린 날, 화신 옆 길에선 결핵 가래 무료검사가 열렸다. 같은 면 「結核豫防日의 街頭風景」.',
    sheet: 'tb-day-1938', sheetNote: '같은 면 「結核豫防日의 街頭風景」' },
  { id: 'gurobel-1938', date: '1938-05-20', page: '', cat: 'drug', check: true, title: '임질 · 구로벨', who: '연속 의약 광고',
    sheet: 'tb-day-1938', sheetNote: '같은 면 「結核豫防日의 街頭風景」' },
  { id: 'kaizer-1938', date: '1938-05-20', page: '', cat: 'drug', check: true, title: '가이자', who: 'KAIZER',
    sheet: 'tb-day-1938', sheetNote: '같은 면 「結核豫防日의 街頭風景」' },
  { id: 'geno-1936', date: '1936-03-31', page: '2', cat: 'drug', check: true, title: '체증엔 겐오', who: '연속 의약 광고',
    sheet: 'mia-1936', sheetNote: '같은 면 「春風에 迷兒」' },
  { id: 'echise-1936', date: '1936-03-31', page: '2', cat: 'drug', check: true, title: '기침 · 해수 · 담천식엔 에치세', who: '연속 의약 광고',
    sheet: 'mia-1936', sheetNote: '같은 면 「春風에 迷兒」' },
  { id: 'enguru-1936', date: '1936-03-31', page: '2', cat: 'drug', check: true, title: '치질엔 엥구루', who: '연속 의약 광고',
    sheet: 'mia-1936', sheetNote: '같은 면 「春風에 迷兒」' },
  { id: 'clover-1938', date: '1938-05-20', page: '', cat: 'beauty', title: '口紅 クローバー', who: '클로버 입술연지',
    sheet: 'tb-day-1938', sheetNote: '같은 면 「結核豫防日의 街頭風景」' },
  { id: 'ruriha-1938', date: '1938-05-20', page: '', cat: 'beauty', check: true, title: 'るり羽', who: '루리하',
    sheet: 'tb-day-1938', sheetNote: '같은 면 「結核豫防日의 街頭風景」' },
  { id: 'morinaga-1936', date: '1936-03-31', page: '2', cat: 'food', title: '森永ミルク', who: '모리나가 밀크',
    sheet: 'mia-1936', sheetNote: '같은 면 「春風에 迷兒」' },
  { id: 'kingofkings-1938', date: '1938-09-29', page: '2', cat: 'food', check: true, title: 'King of Kings', who: '킹 오브 킹스',
    after: '같은 날 같은 면에 동아일보 광고부가 연 상업미술전 개막 소식 「商美展遂開幕」이 실렸다. 광고부가 광고로 행사를 만든 셈이다.',
    sheet: 'sangmi-1938', sheetNote: '같은 면 「商美展遂開幕」 (조간)' },
  { id: 'bond-1937', date: '1937-10-09', page: '1', cat: 'goods', title: '債券で儲ける秘訣', who: '역지일본사 채권부',
    sheet: 'p-1937', sheetNote: '1면 하단 광고란' },
  { id: 'watch-1937', date: '1937-10-09', page: '1', cat: 'goods', check: true, title: '時計', who: '회중시계 · 탁상시계',
    sheet: 'p-1937', sheetNote: '1면 하단 광고란' },
  { id: 'ink-1938', date: '1938-05-20', page: '', cat: 'goods', check: true, title: 'インキ ¥2.0', who: '잉크',
    sheet: 'tb-day-1938', sheetNote: '같은 면 「結核豫防日의 街頭風景」' },
  { id: 'record-1936', date: '1936-03-31', page: '2', cat: 'goods', check: true, title: '絶佳盤!!', who: '레코드',
    sheet: 'mia-1936', sheetNote: '같은 면 「春風에 迷兒」' }
];

/* =========================================================================
   놀이 칸 자료 — 광고가 늘면 여기에도 한 덩어리씩 보태면 됨
   ========================================================================= */

/* 무엇을 팔까 — 글자를 가린 그림(q-광고id.jpg)만 보고 맞히기
   q-…jpg 는 assets/adcollection/ 안에, 광고 그림 부분만 오려 둔 것 */
window.AD_QUIZ = [
  { id: 'coamezin-1937', pick: ['무용 연구소 원생 모집', '여학교 체조 시간 안내', '월경을 재촉하는 약', '아이들 놀이 기구'], ans: 2,
    say: '손잡고 원을 그리는 여인들은 「月經催進劑」, 월경을 재촉하는 약 광고였소.' },
  { id: 'morinaga-1936', pick: ['페인트 깡통', '모리나가 밀크(우유)', '정어리 통조림', '양철 장난감'], ans: 1,
    say: '깡통에 든 것은 모리나가 밀크. 이 회사는 지금도 우유를 만들고 있소.' },
  { id: 'neotone-1939', pick: ['권투 시합 광고', '공장 일꾼 모집', '결핵을 막는다는 강장제', '탈춤 공연'], ans: 2,
    say: '불끈 쥔 주먹과 탈 같은 얼굴은 유한양행의 강장제 네오톤. 큰 글씨는 「무서운 結核病, 患者百萬以上!」' },
  { id: 'enguru-1936', pick: ['서양 활동사진', '분과 연지', '치질 약', '여자 모자'], ans: 2,
    say: '서양 배우 같은 얼굴 옆 큰 글자는 「치질」. 엥구루라는 치질 약 광고였소.' },
  { id: 'naose-1936', pick: ['모자 가게', '폐병 · 늑막염 약', '양장점', '사진관'], ans: 1,
    say: '모자 쓴 숙녀는 「폐병 · 부족증 · 늑막염엔 나오세」. 같은 면엔 미아 기사가 실렸소.' },
  { id: 'echise-1936', pick: ['기침 · 천식 약', '웃음 학교', '치약', '양과자'], ans: 0,
    say: '활짝 웃는 얼굴로 판 것은 「기침 · 해수 · 담천식엔 에치세」.' }
];

/* 허위광고 단속반 — 오늘 기준이면 걸릴까?
   bad: true 면 '걸림'이 정답.  why 는 오늘 기준 풀이 (법률 판단이 아님, 이해를 돕는 정도) */
window.AD_JUDGE = [
  { id: 'deokrimsa-1937', bad: true,  why: '「全快」, 병이 완전히 낫는다고 장담하오. 오늘날 약 광고는 병이 반드시 낫는다고 쓸 수 업소.' },
  { id: 'morinaga-1936',  bad: false, why: '제품 이름과 믿을 만하다는 말뿐이오. 크게 걸릴 데가 업소.' },
  { id: 'neotone-1939',   bad: true,  why: '환자 백만이라는 숫자로 겁을 주고, 강장제가 결핵을 막는다고 내세우오. 오늘날 약 광고에선 공포를 부추기거나 효능을 부풀릴 수 업소.' },
  { id: 'hwashin-1938',   bad: false, why: '행사 날짜와 장소를 알리는 백화점 광고요. 그대로 실어도 무사하오.' },
  { id: 'naose-1936',     bad: true,  why: '폐병 · 늑막염 같은 중병을 약 하나로 다스린다고 하오. 오늘날이면 효능 과장이오.' },
  { id: 'samyongjeong-1938', bad: true, why: '「건강의 원천, 인류의 생명수」. 강장제를 만병통치처럼 부풀렷소.' },
  { id: 'clover-1938',    bad: false, why: '입술연지 이름을 크게 쓴 광고요. 걸릴 말이 업소.' },
  { id: 'bond-1937',      bad: true,  why: '「채권으로 버는 비결」. 오늘날 금융 광고는 돈을 잃을 수도 잇다는 말을 함께 적어야 하오.' }
];

/* 살아남은 광고 — 그 광고를 낸 곳은 지금 어찌 되었나 */
window.AD_ALIVE = [
  { id: 'neotone-1939', who: '유한양행', alive: true,
    then: '1939년, 결핵 환자 백만을 앞세워 강장제를 팔앗소.', now: '1926년 세워진 유한양행은 지금도 제약회사로 영업 중이오.' },
  { id: 'morinaga-1936', who: '모리나가 밀크', alive: true,
    then: '1936년, 「신뢰할 수 잇는 영양」이라며 깡통 우유를 팔앗소.', now: '모리나가 유업은 지금도 일본에서 우유와 분유를 만들고 잇소.' },
  { id: 'hwashin-1935', who: '화신백화점', alive: false,
    then: '1935년, 불탄 지 두 달 만에 「부흥 공작을 착착 진행!」', now: '1987년 3월 건물이 헐렷소. 그 자리엔 지금 종로타워가 섯소.' },
  { id: 'jesaengdang-1935', who: '제생당약방', alive: false, check: true,
    then: '1935년, 「청심보명단 본가」라 크게 내걸엇소.', now: '지금은 간판을 찾을 수 업소. (확인 중)' }
];

/* 그때 얼마였소 — 광고에 값이 적힌 것만
   설렁탕 값: 1920~30년대 설렁탕 한 그릇 10~15전 (주영하, 경향신문 「음식 100년」)
   오늘 설렁탕 값은 어림으로 한 그릇 1만 2천 원 */
window.AD_PRICE_BASE = { bowlThen: 15, bowlNow: 12000 };   // 전(錢) · 원
window.AD_PRICE = [
  { id: 'ink-1938', label: '잉크 한 병', sen: 200, check: true }
];
