// 이벤트 접수의 KST 마감 경계와 확정 일정을 검증한다.
import assert from 'node:assert/strict';
import test from 'node:test';
import { isEventClosed } from '../lib/event-config.js';

test('광고 유입 기간 동안 접수하고 KST 마감 직후 닫는다', () => {
    const closed = (instant) => isEventClosed(Date.parse(instant));
    assert.equal(closed('2026-10-14T12:00:00+09:00'), false);
    assert.equal(closed('2026-10-31T23:59:58.999+09:00'), false);
    assert.equal(closed('2026-10-31T23:59:59+09:00'), false);
    assert.equal(closed('2026-10-31T14:59:59Z'), false);
    assert.equal(closed('2026-10-31T23:59:59.001+09:00'), true);
    assert.equal(closed('2026-11-01T00:00:00+09:00'), true);
});
