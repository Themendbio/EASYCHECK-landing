// 실제 이벤트 페이지의 표시 분기를 모의 인증 상태로 렌더링해 신청·마감 회귀를 검사한다.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { EVENT } from '../lib/event-config.js';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../app/event/prereg/page.js', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, allowJs: true },
    fileName: 'page.jsx',
}).outputText;

function render({
    phase = 'idle',
    status = null,
    closed = false,
    ready = true,
    error = false,
    cancelled = false,
} = {}) {
    const states = [phase, status, cancelled];
    const calls = [];
    const pageModule = { exports: {} };
    const mocks = {
        react: { ...React, useState: () => [states.shift(), () => {}], useEffect: () => {} },
        'next/link': {
            default: ({ children, ...props }) => React.createElement('a', props, children),
        },
        '../../../lib/event-config': { EVENT },
        '../../../hooks/useEventClosed': { useEventClosed: () => closed },
        '../../../hooks/useKakaoSdk': { useKakaoSdk: () => ({ ready, error }) },
        '../../../components/footer': { Footer: () => null },
        '../../../components/icons': { IconPlay: () => null },
        './event.module.css': { default: new Proxy({}, { get: (_, name) => String(name) }) },
    };
    runInNewContext(compiled, {
        exports: pageModule.exports,
        require: (name) => mocks[name] ?? require(name),
        window: {
            location: { origin: 'https://example.test' },
            Kakao: { Auth: { authorize: (input) => calls.push(input) } },
        },
        Intl,
        Date,
    });
    const tree = pageModule.exports.default();
    const buttons = [];
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (node.type === 'button') buttons.push(node);
        visit(node.props?.children);
    }
    visit(tree);
    return { html: renderToStaticMarkup(tree), buttons, calls };
}

test('신청 전의 두 신청 버튼과 참여 조회는 실제 카카오 리다이렉트로 연결된다', () => {
    const { html, buttons, calls } = render();
    assert.match(html, /event-prizes-illustration.webp/);
    assert.match(html, /prize-watch.webp/);
    assert.match(html, /10\.31/);
    assert.match(html, /11\.04/);
    assert.doesNotMatch(html, /기간 연장|재신청/);
    const enabled = buttons.filter((b) => !b.props.disabled);
    assert.equal(enabled.length, 4);
    enabled.forEach((b) => b.props.onClick());
    assert.equal(calls.length, 4);
    assert.ok(calls.every((c) => c.redirectUri === 'https://example.test/event/prereg'));
});

test('SDK 로딩 및 API 확인 중에는 중복 신청과 조회를 비활성화한다', () => {
    for (const state of [{ ready: false }, { phase: 'loading' }]) {
        assert.ok(render(state).buttons.every((b) => b.props.disabled));
    }
});

test('신청 확인 이후에는 앱 설치를 안내하고 응모 확정은 서버 응답으로만 표시한다', () => {
    const pending = render({ phase: 'done', status: { registered: true, entry_confirmed: false } });
    assert.match(pending.html, /이벤트 신청 확인됨/);
    assert.match(pending.html, /Google Play에서 앱 설치/);
    assert.doesNotMatch(pending.html, /응모가 완료되었습니다\./);
    const confirmed = render({
        phase: 'done',
        status: { registered: true, entry_confirmed: true },
    });
    assert.match(confirmed.html, /응모가 완료되었습니다\./);
    assert.match(confirmed.html, /2단계 완료/);
});

test('마감 후 신규 신청은 닫고 기존 참여 현황 조회를 유지한다', () => {
    const { html, buttons } = render({ closed: true });
    assert.doesNotMatch(html, />카카오로 신청하기</);
    assert.match(html, /이벤트 신청이 마감되었습니다/);
    assert.equal(buttons.filter((b) => !b.props.disabled).length, 2);
    assert.ok(buttons.some((b) => b.props.disabled));
});

test('마감 전 조회 결과가 오래됐으면 탈락으로 단정하지 않고 다시 확인을 안내한다', () => {
    const { html } = render({
        closed: true,
        phase: 'done',
        status: { registered: true, entry_confirmed: false, closed: false },
    });
    assert.match(html, /내 참여 현황 다시 확인/);
    assert.doesNotMatch(html, /추첨 대상에 포함되지 않았습니다/);
    const refreshed = render({
        phase: 'done',
        status: { registered: true, entry_confirmed: false, closed: true },
    });
    assert.match(refreshed.html, /추첨 대상에 포함되지 않았습니다/);
});

test('당첨·취소·오류 안내와 개인정보 링크를 유지한다', () => {
    const winner = render({
        phase: 'done',
        status: { registered: true, entry_confirmed: true, prize_rank: 1, nickname: '<test>' },
    });
    assert.match(winner.html, /1등에 당첨되었습니다/);
    assert.match(winner.html, /&lt;test&gt;/);
    assert.match(winner.html, /카카오톡 채널 추가/);
    assert.match(winner.html, /href="\/policy\/privacy"/);
    assert.match(render({ cancelled: true }).html, /로그인 동의를 취소/);
    assert.match(render({ error: true, ready: false }).html, /로그인 화면을 불러오지 못/);
    assert.match(render({ phase: 'error' }).html, /다시 시도하기/);
});
