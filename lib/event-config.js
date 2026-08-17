// 사전예약·경품 이벤트 상수 — 미확정 값은 REPLACE_ME. 값 확정 시 여기만 고치고 재배포.
export const EVENT = {
    // 카카오 개발자 콘솔 > 기존 EASYCHECK 앱 > JavaScript 키 (공개 키 — 도메인으로 제한됨)
    KAKAO_JS_KEY: 'REPLACE_ME_KAKAO_JS_KEY',
    API_BASE: 'https://api.themendbio.com',
    // 'prereg' = 출시 전(사전예약 접수) · 'live' = 출시 후(Play 링크 + 응모 지속)
    PHASE: 'prereg',
    PLAY_STORE_URL: 'REPLACE_ME_PLAY_URL', // 출시 승인 후 실제 링크
    KAKAO_CHANNEL_URL: '', // 채널 개설 후 https://pf.kakao.com/_xxxxx/friend — 빈 값이면 버튼 숨김
    PRIZES: [
        { rank: 1, name: '갤럭시 워치8', count: 1 },
        { rank: 2, name: '스탠리 텀블러', count: 3 },
        { rank: 3, name: '보조배터리', count: 10 },
    ],
};
