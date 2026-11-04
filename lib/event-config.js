// 사전예약·경품 이벤트 상수 — 미확정 값은 REPLACE_ME. 값 확정 시 여기만 고치고 재배포.
export const EVENT = {
    // 카카오 개발자 콘솔 > 기존 EASYCHECK 앱 > JavaScript 키 (공개 키 — 도메인으로 제한됨)
    KAKAO_JS_KEY: 'd820d9aaed77567773f87a673940eaa5',
    API_BASE: 'https://api.themendbio.com',
    // 'prereg' = 출시 전(사전예약 접수) · 'live' = 출시 후(Play 링크 + 응모 지속)
    PHASE: 'live',
    PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.themend.easycheck',
    // 응모 마감(KST) — 서버 PREREG_DEADLINE 과 같은 값. 지나면 접수 CTA·홍보 카드가 닫힌다.
    PREREG_DEADLINE: '2026-10-31T23:59:59+09:00',
    DEADLINE_LABEL: '2026년 10월 31일 23:59 KST',
    ANNOUNCEMENT_LABEL: '2026년 11월 4일',
    KAKAO_CHANNEL_URL: 'https://pf.kakao.com/_FCgiX/friend', // 빈 값이면 버튼 숨김
    PRIZES: [
        { rank: 1, name: '갤럭시 워치8', count: 1 },
        { rank: 2, name: '스탠리 텀블러', count: 3 },
        { rank: 3, name: '워치 겸용 보조배터리', count: 10 },
    ],
    // 당첨 확인 — 카카오에 등록된 리다이렉트는 /event/prereg 뿐이라 state 로 표시해 돌려보낸다
    WINNERS_PATH: '/event/winners',
    WINNERS_AUTH_STATE: 'winners',
    // 수령 정보 제출 기한(발표일부터 14일) — 지나면 양식 버튼을 숨긴다
    CLAIM_DEADLINE: '2026-11-18T23:59:59+09:00',
    CLAIM_DEADLINE_LABEL: '2026년 11월 18일(수) 23:59',
    // 수령 정보 구글 폼 응답자 주소와 미리 채울 문항 id — 등수 값은 양식 선택지 '1등(갤럭시 워치8)' 형식
    CLAIM_FORM_URL:
        'https://docs.google.com/forms/d/e/1FAIpQLSfBleV8xCely60Jc4AAWgWOgHGvMheR54WF2yZeIHNfKVcyeA/viewform',
    CLAIM_FORM_FIELDS: { nickname: 'entry.714073088', rank: 'entry.1125238257' },
};

export function isEventClosed(now = Date.now()) {
    return now > Date.parse(EVENT.PREREG_DEADLINE);
}

export function isClaimClosed(now = Date.now()) {
    return now > Date.parse(EVENT.CLAIM_DEADLINE);
}

// 당첨자의 닉네임·등수를 채운 수령 양식 주소
export function claimFormUrl(nickname, rank) {
    const prize = EVENT.PRIZES.find((p) => p.rank === rank);
    const params = new URLSearchParams({ usp: 'pp_url' });
    if (nickname) params.set(EVENT.CLAIM_FORM_FIELDS.nickname, nickname);
    if (prize) params.set(EVENT.CLAIM_FORM_FIELDS.rank, `${prize.rank}등(${prize.name})`);
    return `${EVENT.CLAIM_FORM_URL}?${params}`;
}

// /event/prereg 로 돌아온 당첨 확인 로그인(코드·취소 모두)을 당첨자 페이지 주소로 바꾼다
export function winnersForwardUrl(search) {
    const params = new URLSearchParams(search);
    if (params.get('state') !== EVENT.WINNERS_AUTH_STATE) return null;
    if (!params.get('code') && !params.get('error')) return null;
    return `${EVENT.WINNERS_PATH}?${params}`;
}
