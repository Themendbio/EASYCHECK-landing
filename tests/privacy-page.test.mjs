// 개인정보 처리방침 머리말·개정 이력의 버전·시행일과 경품 수령 정보 파기 시점 문구가 서로 어긋나지 않는지 검사한다.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../app/policy/privacy/page.js', import.meta.url), 'utf8');
const header = source.match(
    /버전 ([\d.]+) · 고지일 (\d{4}년 \d{1,2}월 \d{1,2}일) · 시행일 (\d{4}년 \d{1,2}월 \d{1,2}일)/,
);
const history = [...source.matchAll(/\[\s*'(\d+\.\d+)',\s*'(\d{4}년 \d{1,2}월 \d{1,2}일)'/g)];

function toUtc(text) {
    const [, y, m, d] = text.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
    return Date.UTC(Number(y), Number(m) - 1, Number(d));
}

test('머리말의 버전·시행일이 개정 이력 마지막 행과 같다', () => {
    assert.ok(header, '머리말 버전 줄이 없다');
    const [, version, , effective] = header;
    const [, lastVersion, lastEffective] = history.at(-1);
    assert.equal(lastVersion, version);
    assert.equal(lastEffective, effective);
});

test('시행일은 고지일로부터 최소 7일 뒤다(제15조 ②)', () => {
    const [, , notice, effective] = header;
    const days = (toUtc(effective) - toUtc(notice)) / 86_400_000;
    assert.ok(days >= 7, `고지 기간이 ${days}일이다`);
});

test('당첨자 수령 정보 파기 시점을 한 가지로만 적는다', () => {
    assert.doesNotMatch(source, /발송 완료 후 파기/);
    assert.match(source, /경품 발송 및 제세공과금 처리 완료 후 파기/);
});
