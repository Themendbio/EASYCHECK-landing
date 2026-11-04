// 이벤트 접수의 KST 마감 경계와 확정 일정을 검증한다.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
    EVENT,
    claimFormUrl,
    isClaimClosed,
    isEventClosed,
    winnersForwardUrl,
} from '../lib/event-config.js';

test('광고 유입 기간 동안 접수하고 KST 마감 직후 닫는다', () => {
    const closed = (instant) => isEventClosed(Date.parse(instant));
    assert.equal(closed('2026-10-14T12:00:00+09:00'), false);
    assert.equal(closed('2026-10-31T23:59:58.999+09:00'), false);
    assert.equal(closed('2026-10-31T23:59:59+09:00'), false);
    assert.equal(closed('2026-10-31T14:59:59Z'), false);
    assert.equal(closed('2026-10-31T23:59:59.001+09:00'), true);
    assert.equal(closed('2026-11-01T00:00:00+09:00'), true);
});

test('수령 정보 제출은 KST 11/18 23:59:59까지 받는다', () => {
    const closed = (instant) => isClaimClosed(Date.parse(instant));
    assert.equal(closed('2026-11-04T10:00:00+09:00'), false);
    assert.equal(closed('2026-11-18T23:59:59+09:00'), false);
    assert.equal(closed('2026-11-18T23:59:59.001+09:00'), true);
});

test('수령 양식 링크는 닉네임과 양식 선택지 글자 그대로의 등수를 채운다', () => {
    const url = new URL(claimFormUrl('수나 & <친구>', 2));
    assert.equal(url.origin + url.pathname, EVENT.CLAIM_FORM_URL);
    assert.equal(url.searchParams.get('usp'), 'pp_url');
    assert.equal(url.searchParams.get(EVENT.CLAIM_FORM_FIELDS.nickname), '수나 & <친구>');
    assert.equal(url.searchParams.get(EVENT.CLAIM_FORM_FIELDS.rank), '2등(스탠리 텀블러)');
    assert.equal(
        new URL(claimFormUrl('', 3)).searchParams.get(EVENT.CLAIM_FORM_FIELDS.rank),
        '3등(워치 겸용 보조배터리)',
    );
    assert.equal(
        new URL(claimFormUrl(null, 1)).searchParams.has(EVENT.CLAIM_FORM_FIELDS.nickname),
        false,
    );
});

test('당첨 확인 로그인으로 돌아온 요청만 당첨자 페이지로 넘긴다', () => {
    const state = EVENT.WINNERS_AUTH_STATE;
    assert.equal(
        winnersForwardUrl(`?code=abc&state=${state}`),
        `/event/winners?code=abc&state=${state}`,
    );
    assert.equal(
        winnersForwardUrl(`?error=access_denied&state=${state}`),
        `/event/winners?error=access_denied&state=${state}`,
    );
    assert.equal(winnersForwardUrl('?code=abc'), null);
    assert.equal(winnersForwardUrl(`?state=${state}`), null);
    assert.equal(winnersForwardUrl(''), null);
});
