// 당첨자 안내 페이지의 표시 분기를 모의 조회 결과로 렌더링해 당첨·미당첨·수령 기한을 검사한다.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { EVENT, claimFormUrl } from '../lib/event-config.js';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../app/event/winners/page.js', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, allowJs: true },
    fileName: 'page.jsx',
}).outputText;

function render({
    phase = 'idle',
    status = null,
    cancelled = false,
    ready = true,
    error = false,
    claimClosed = false,
} = {}) {
    const states = [phase, status, cancelled];
    const calls = [];
    const pageModule = { exports: {} };
    const mocks = {
        react: { ...React, useState: () => [states.shift(), () => {}], useEffect: () => {} },
        'next/link': {
            default: ({ children, ...props }) => React.createElement('a', props, children),
        },
        '../../../lib/event-config': require('../lib/event-config.js'),
        '../../../hooks/useEventClosed': { useClaimClosed: () => claimClosed },
        '../../../hooks/useKakaoSdk': { useKakaoSdk: () => ({ ready, error }) },
        '../../../components/footer': { Footer: () => null },
        '../prereg/event.module.css': {
            default: new Proxy({}, { get: (_, name) => String(name) }),
        },
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
        encodeURIComponent,
        URLSearchParams,
    });
    const tree = pageModule.exports.default();
    const buttons = [];
    const links = [];
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (node.type === 'button') buttons.push(node);
        if (node.type === 'a') links.push(node);
        visit(node.props?.children);
    }
    visit(tree);
    return { html: renderToStaticMarkup(tree), buttons, links, calls };
}

const winner = (rank, nickname = '수나') => ({
    registered: true,
    entry_confirmed: true,
    closed: true,
    prize_rank: rank,
    nickname,
});

test('첫 화면은 발표 완료와 공지한 경품 인원을 보이고, 로그인은 등록된 주소로 돌아온다', () => {
    const { html, buttons, calls } = render();
    assert.match(html, /당첨자 발표/);
    assert.match(html, /카카오로 당첨 확인하기/);
    for (const prize of EVENT.PRIZES) {
        assert.match(html, new RegExp(`${prize.name}`));
    }
    assert.match(html, /10<\/strong>명/);
    assert.match(html, /명단은 공개하지 않습니다/);
    const enabled = buttons.filter((b) => !b.props.disabled);
    assert.equal(enabled.length, 1);
    enabled[0].props.onClick();
    assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
        { redirectUri: 'https://example.test/event/prereg', state: EVENT.WINNERS_AUTH_STATE },
    ]);
});

test('SDK 로딩과 조회 중에는 로그인 버튼을 막는다', () => {
    for (const state of [{ ready: false }, { phase: 'loading' }]) {
        assert.ok(render(state).buttons.every((b) => b.props.disabled));
    }
});

test('당첨자는 등수·경품·기한과 닉네임·등수가 채워진 수령 양식 버튼을 본다', () => {
    const { html } = render({ phase: 'done', status: winner(1, '<수나>') });
    assert.match(html, /1등 당첨/);
    assert.match(html, /갤럭시 워치8/);
    assert.match(html, /&lt;수나&gt;님/);
    assert.match(html, new RegExp(EVENT.CLAIM_DEADLINE_LABEL.replace(/[()]/g, '\\$&')));
    const href = claimFormUrl('<수나>', 1).replaceAll('&', '&amp;');
    assert.ok(
        html.includes(`href="${href}" target="_blank"`),
        '닉네임·등수가 채워진 양식 링크가 새 탭으로 열려야 한다',
    );
    assert.match(html, /수령 정보 입력하기/);
});

test('수령 기한이 지나면 양식 버튼을 숨기고 기한 종료를 알린다', () => {
    const { html } = render({ phase: 'done', status: winner(3), claimClosed: true });
    assert.match(html, /3등 당첨/);
    assert.match(html, /수령 정보 제출 기한이 지났습니다/);
    assert.doesNotMatch(html, /수령 정보 입력하기/);
    assert.doesNotMatch(html, /docs\.google\.com/);
});

test('등수가 없는 신청자는 미당첨 안내만 보고 양식 링크가 없다', () => {
    for (const confirmed of [true, false]) {
        const { html } = render({
            phase: 'done',
            status: {
                registered: true,
                entry_confirmed: confirmed,
                closed: true,
                prize_rank: null,
            },
        });
        assert.match(html, /이번 추첨에서는 당첨되지 않았습니다/);
        assert.doesNotMatch(html, /docs\.google\.com/);
        assert.doesNotMatch(html, /당첨을 축하/);
    }
});

test('신청 내역이 없으면 다른 계정으로 다시 로그인할 수 있다', () => {
    const { html, buttons, calls } = render({
        phase: 'done',
        status: { registered: false, closed: true },
    });
    assert.match(html, /신청한 내역이 없습니다/);
    assert.doesNotMatch(html, /docs\.google\.com/);
    const retry = buttons.find((b) => /다른 카카오 계정으로 확인/.test(renderToStaticMarkup(b)));
    assert.ok(retry);
    retry.props.onClick();
    assert.equal(calls.at(-1).prompt, 'login');
    assert.equal(calls.at(-1).state, EVENT.WINNERS_AUTH_STATE);
});

test('취소·SDK 오류·조회 오류를 안내한다', () => {
    assert.match(render({ cancelled: true }).html, /로그인 동의를 취소/);
    assert.match(render({ error: true, ready: false }).html, /로그인 화면을 불러오지 못/);
    const failed = render({ phase: 'error' });
    assert.match(failed.html, /당첨 여부를 확인하지 못했습니다/);
    assert.match(failed.html, /다시 시도하기/);
});
