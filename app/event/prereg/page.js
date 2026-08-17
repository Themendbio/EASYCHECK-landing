'use client';
// 사전예약·경품 응모 이벤트 상세 — 카카오 인가 코드 리다이렉트 처리와 2단계 응모 진행 표시 포함
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EVENT } from '../../../lib/event-config';
import { useKakaoSdk } from '../../../hooks/useKakaoSdk';
import { Reveal } from '../../../components/ui/Reveal';
import { Footer } from '../../../components/footer';

// 카카오 인가 코드 발급·교환에 쓰는 리다이렉트 주소 — 두 곳이 반드시 같아야 교환이 성공한다
const REDIRECT_PATH = '/event/prereg';

// 응모/조회 공용 — 인가 코드를 서버로 보내 상태를 받는다
async function submitCode(code) {
    const res = await fetch(`${EVENT.API_BASE}/events/prereg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}${REDIRECT_PATH}`,
        }),
    });
    if (!res.ok) throw new Error(`prereg failed: ${res.status}`);
    return res.json();
}

const STEPS = [
    '카카오 계정으로 사전예약합니다.',
    '출시 후 같은 계정으로 앱에 가입하고 기본 정보를 입력합니다.',
    '가입까지 마친 분들 중 추첨합니다.',
];

// 경품 사진 — 등수로 매칭. 원본 비율이 제각각이라 고정 박스 + object-contain 으로 담는다.
const PRIZE_IMAGES = {
    1: '/images/prize-watch.webp',
    2: '/images/prize-tumbler.webp',
    3: '/images/prize-battery.jpg',
};

// 어두운 패널 위 단계 상태 팔레트 — 완료(녹색) · 지금 가능(오렌지) · 대기(무채색)
const STAGE_STYLE = {
    done: {
        node: {
            background: 'var(--success)',
            color: '#FFFFFF',
            border: '1px solid var(--success)',
        },
        chip: { background: 'rgba(22,163,74,0.20)', color: '#8FE9B4' },
    },
    active: {
        node: {
            background: 'var(--brand-accent)',
            color: '#FFFFFF',
            border: '1px solid var(--brand-accent)',
        },
        chip: { background: 'rgba(243,152,0,0.20)', color: '#FFC96B' },
    },
    pending: {
        node: {
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.24)',
        },
        chip: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.62)' },
    },
};

// 카카오 말풍선 — 버튼 안 장식
function KakaoMark() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
            <path
                fill="currentColor"
                d="M12 3C6.9 3 2.8 6.3 2.8 10.3c0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.5.1 1.1.1 1.6.1 5.1 0 9.2-3.3 9.2-7.1S17.1 3 12 3Z"
            />
        </svg>
    );
}

// 완료 체크 — 단계 노드와 결과 카드에서 공용
function CheckMark({ size = 18 }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
            <path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 흰 배경 제품 사진을 흰 타일에 담아 어두운 패널 위에서 사각형 경계가 드러나지 않게 한다
function PrizePhoto({ src, alt, className }) {
    return (
        <div className={`rounded-lg bg-white p-3 lg:p-4 ${className}`}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-contain text-[12px] text-text-tertiary"
            />
        </div>
    );
}

export default function PreregEventPage() {
    const { ready, error } = useKakaoSdk();
    // idle | loading | done | error
    const [phase, setPhase] = useState('idle');
    const [status, setStatus] = useState(null);
    // 카카오 동의 화면에서 취소하고 돌아온 경우
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        document.title = 'EASYCHECK 사전예약 경품 이벤트';
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) {
            // 동의를 취소하면 code 없이 ?error=access_denied 로 돌아온다 — URL 을 정리하고 상황을 알린다
            if (params.get('error')) {
                window.history.replaceState(null, '', REDIRECT_PATH);
                setCancelled(true);
            }
            return;
        }
        // 코드는 일회용 — URL 에서 즉시 제거해 새로고침 재제출을 막는다
        window.history.replaceState(null, '', REDIRECT_PATH);
        setPhase('loading');
        submitCode(code)
            .then((s) => {
                setStatus(s);
                setPhase('done');
            })
            .catch(() => setPhase('error'));
    }, []);

    // 카카오에서 돌아오면 화면은 최상단이라 결과가 폴드 아래에 있다 — 결과가 그려진 뒤 그 영역으로 이동시킨다
    useEffect(() => {
        if (phase !== 'done' && phase !== 'error') return;
        document.getElementById('entry')?.scrollIntoView({ block: 'center' });
    }, [phase]);

    const startKakao = () => {
        if (!ready) return;
        window.Kakao.Auth.authorize({ redirectUri: `${window.location.origin}${REDIRECT_PATH}` });
    };

    const stagger = (i) => ({ animationDelay: `${i * 90}ms` });

    // 응모 진행도 — 로그인 전에는 1단계가 '지금 가능', 접수되면 1단계 완료·2단계 대기가 된다
    const registered = Boolean(status?.registered);
    const confirmed = Boolean(status?.entry_confirmed);
    const stages = [
        {
            no: '1단계',
            title: '사전예약',
            state: registered ? 'done' : 'active',
            // 상태는 배지 한 단어로만 말한다 — 같은 말을 문장으로 반복하지 않는다
            chip: registered ? '완료' : '지금 가능',
        },
        {
            no: '2단계',
            title: '출시 후 앱 가입',
            state: confirmed ? 'done' : 'pending',
            chip: confirmed ? '완료' : '대기',
        },
    ];

    return (
        <main className="bg-bg-base">
            {/* 상단 브랜드 바 — 랜딩 내비게이션과 동일한 흰 배경/로고로 사이트 연속성 유지 */}
            <div className="border-b border-border bg-white">
                <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between container-x lg:h-16">
                    <Link href="/" className="focus-ring rounded-md" aria-label="EASYCHECK 홈으로">
                        <img
                            src="/images/easycheck-logo.webp"
                            alt="EASYCHECK"
                            className="h-[22px] w-auto select-none lg:h-6"
                        />
                    </Link>
                    <Link
                        href="/event"
                        className="focus-ring rounded text-[13px] font-medium text-text-secondary hover:text-text-primary lg:text-[14px]"
                    >
                        <span aria-hidden="true">←</span> 이벤트 목록
                    </Link>
                </div>
            </div>

            {/* 히어로 — 고지 배너와 헤드라인을 브랜드 딥 패널에 얹어 첫 화면을 장악한다 */}
            <section className="relative overflow-hidden bg-brand-deep">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(120% 90% at 88% 0%, rgba(0,174,235,0.30) 0%, rgba(0,174,235,0) 60%), radial-gradient(80% 70% at 0% 100%, rgba(243,152,0,0.20) 0%, rgba(243,152,0,0) 65%)',
                    }}
                />
                <div className="relative mx-auto max-w-[960px] container-x pt-9 pb-24 lg:pt-14 lg:pb-32">
                    {/* 기간 — 전단지에 인쇄된 7월 일정이 이미 지났으므로 날짜 정정 표시는 남긴다 */}
                    <p
                        className="anim-up text-[13px] font-semibold lg:text-[14px]"
                        style={{ ...stagger(0), color: 'rgba(255,255,255,0.72)' }}
                    >
                        기간 · 2026.8.19 ~ 출시 후 2주
                    </p>

                    <h1
                        className="anim-up hero-headline mt-4 text-[38px] leading-[1.14] font-bold tracking-[-0.03em] text-white lg:mt-5 lg:text-[56px]"
                        style={{ ...stagger(1), wordBreak: 'keep-all' }}
                    >
                        사전예약
                        <br />
                        <span className="text-brand-accent">경품 이벤트</span>
                    </h1>
                    <p
                        className="anim-up mt-5 max-w-[26em] text-[16px] leading-[1.7] lg:text-[18px]"
                        style={{
                            ...stagger(2),
                            color: 'rgba(255,255,255,0.78)',
                            wordBreak: 'keep-all',
                        }}
                    >
                        예약 후 출시된 앱에 가입하면 추첨 대상이 됩니다.
                    </p>
                </div>
            </section>

            {/* A. 사전예약 — 지금 할 수 있는 것. 참여 방법·CTA·결과가 모두 이 섹션 안에만 있다. */}
            <div className="mx-auto max-w-[960px] container-x">
                <Reveal
                    as="section"
                    y={16}
                    aria-labelledby="prereg-heading"
                    className="relative z-10 -mt-16 rounded-xl border border-border bg-white p-6 shadow-lg lg:-mt-20 lg:p-9"
                >
                    <p className="text-[13px] font-semibold tracking-[0.1em] text-brand-primary uppercase">
                        지금 가능
                    </p>
                    <h2
                        id="prereg-heading"
                        className="mt-2 text-[24px] font-bold tracking-[-0.025em] text-text-primary lg:text-[30px]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        사전예약
                    </h2>
                    <p
                        className="mt-3 max-w-[34em] text-[15px] leading-[1.7] text-text-secondary lg:text-[16px]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        카카오 로그인으로 접수합니다.
                    </p>

                    {/* 참여 방법 */}
                    <h3 className="mt-8 text-[15px] font-bold text-text-primary">참여 방법</h3>
                    <ol className="relative mt-4 space-y-6">
                        <span
                            aria-hidden="true"
                            className="absolute top-4 bottom-4 left-[15px] w-px bg-border"
                        />
                        {STEPS.map((text, i) => (
                            <li key={i} className="relative flex gap-4">
                                <span
                                    aria-hidden="true"
                                    className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-[14px] font-bold text-brand-primary ring-4 ring-white"
                                >
                                    {i + 1}
                                </span>
                                <p
                                    className="pt-[5px] text-[15px] leading-[1.7] text-text-secondary lg:text-[16px]"
                                    style={{ wordBreak: 'keep-all' }}
                                >
                                    {text}
                                </p>
                            </li>
                        ))}
                    </ol>

                    {/* CTA / 결과 — 이 페이지의 유일한 신청 버튼 */}
                    <div
                        id="entry"
                        className="mt-8 scroll-mt-8 rounded-md border border-border bg-bg-subtle px-5 py-7 lg:px-7"
                    >
                        {phase === 'idle' && (
                            <>
                                {/* 상태 고지 — 상자나 색이 아니라 굵은 첫 문장으로 상황을 알린다 */}
                                {cancelled && (
                                    <p
                                        role="alert"
                                        className="mb-5 text-[13px] leading-[1.7] text-text-secondary"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        <strong className="font-bold text-text-primary">
                                            동의를 취소하셨습니다.
                                        </strong>{' '}
                                        다시 시도해 주세요.
                                    </p>
                                )}
                                {error && (
                                    <p
                                        role="alert"
                                        className="mb-5 text-[13px] leading-[1.7] text-text-secondary"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        <strong className="font-bold text-text-primary">
                                            카카오 로그인을 불러오지 못했습니다.
                                        </strong>{' '}
                                        새로고침해 주세요.
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={startKakao}
                                    disabled={!ready}
                                    className="focus-ring inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#FEE500] px-8 py-4 text-[16px] font-bold text-[#191919] shadow-sm transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 lg:w-auto lg:text-[17px]"
                                >
                                    <KakaoMark />
                                    카카오로 사전예약하기
                                </button>
                                <p
                                    className="mt-3 text-[13px] leading-[1.7] text-text-tertiary"
                                    style={{ wordBreak: 'keep-all' }}
                                >
                                    중복 응모 방지를 위해 본인 확인만 합니다. 연락처는 받지
                                    않습니다.
                                </p>
                                <div className="mt-5 border-t border-border pt-4">
                                    <button
                                        type="button"
                                        onClick={startKakao}
                                        disabled={!ready}
                                        className="focus-ring rounded text-[14px] font-medium text-text-secondary underline underline-offset-4 disabled:opacity-50"
                                    >
                                        내 응모 결과 확인
                                    </button>
                                </div>
                            </>
                        )}
                        {phase === 'loading' && (
                            <p className="text-[15px] text-text-secondary">확인 중입니다…</p>
                        )}
                        {phase === 'error' && (
                            <div role="alert">
                                <p
                                    className="text-[15px] leading-[1.7] text-text-secondary"
                                    style={{ wordBreak: 'keep-all' }}
                                >
                                    <strong className="font-bold text-text-primary">
                                        처리에 실패했습니다.
                                    </strong>{' '}
                                    잠시 후 다시 시도해 주세요.
                                </p>
                                <button
                                    type="button"
                                    onClick={startKakao}
                                    disabled={!ready}
                                    className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#FEE500] px-6 py-3.5 text-[15px] font-bold text-[#191919] shadow-sm transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 lg:w-auto"
                                >
                                    <KakaoMark />
                                    다시 시도하기
                                </button>
                            </div>
                        )}
                        {phase === 'done' && status && (
                            <div role="status">
                                {!status.registered && status.closed ? (
                                    <p className="text-[15px] font-semibold text-text-primary">
                                        사전예약 접수가 마감되었습니다.
                                    </p>
                                ) : (
                                    <>
                                        <span
                                            aria-hidden="true"
                                            className="mb-2 inline-flex text-success"
                                        >
                                            <CheckMark size={22} />
                                        </span>
                                        <p
                                            className="text-[17px] font-bold text-text-primary lg:text-[19px]"
                                            style={{ wordBreak: 'keep-all' }}
                                        >
                                            {status.nickname ? `${status.nickname}님, ` : ''}
                                            사전예약이 접수되었습니다.
                                        </p>
                                        <p
                                            className="mt-2 text-[14px] leading-[1.7] text-text-secondary"
                                            style={{ wordBreak: 'keep-all' }}
                                        >
                                            {status.entry_confirmed
                                                ? '앱 가입까지 확인되어 응모가 확정되었습니다.'
                                                : '출시 후 같은 카카오 계정으로 가입(기본 정보 입력)까지 마치면 응모가 확정됩니다.'}
                                        </p>
                                        {EVENT.KAKAO_CHANNEL_URL && (
                                            <a
                                                href={EVENT.KAKAO_CHANNEL_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-5 py-3.5 text-[14px] font-bold text-[#191919] shadow-sm transition-opacity duration-150 hover:opacity-90 lg:w-auto"
                                            >
                                                <KakaoMark />
                                                카카오톡 채널 추가
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </Reveal>
            </div>

            {/* B. 경품 응모 — 보상을 크게 보여주고, 응모가 2단계임을 진행도로 못 박는다. */}
            <section
                aria-labelledby="prizes-heading"
                className="mt-16 bg-brand-deep lg:mt-24"
            >
                <div className="mx-auto max-w-[960px] container-x py-14 lg:py-20">
                    <h2
                        id="prizes-heading"
                        className="text-[26px] font-bold tracking-[-0.025em] text-white lg:text-[34px]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        경품
                    </h2>

                    {/* 1등 — 사진을 크게 쓰는 홍보 영역. 흰 타일 자체가 면이라 바깥 카드는 두지 않는다. */}
                    <Reveal
                        y={16}
                        className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-7"
                    >
                        <PrizePhoto
                            src={PRIZE_IMAGES[1]}
                            alt={EVENT.PRIZES[0].name}
                            className="h-[190px] lg:h-[240px]"
                        />
                        <div>
                            <span className="inline-flex items-center rounded-md bg-brand-accent px-3 py-1.5 text-[13px] font-bold text-white">
                                1등
                            </span>
                            <p
                                className="mt-3 text-[26px] font-bold tracking-[-0.02em] text-white lg:text-[32px]"
                                style={{ wordBreak: 'keep-all' }}
                            >
                                {EVENT.PRIZES[0].name}
                            </p>
                            <p className="mt-1.5 text-[14px] font-medium text-white/60">
                                {EVENT.PRIZES[0].count}명
                            </p>
                        </div>
                    </Reveal>

                    {/* 2·3등 */}
                    <Reveal as="ul" y={16} className="mt-5 grid gap-5 sm:grid-cols-2">
                        {EVENT.PRIZES.slice(1).map((p) => (
                            <li key={p.rank}>
                                <PrizePhoto
                                    src={PRIZE_IMAGES[p.rank]}
                                    alt={p.name}
                                    className="h-[170px] lg:h-[200px]"
                                />
                                <div className="mt-4 flex items-baseline gap-2.5">
                                    <span className="inline-flex shrink-0 items-center rounded-md bg-white/15 px-2.5 py-1 text-[12px] font-bold text-white/85">
                                        {p.rank}등
                                    </span>
                                    <span
                                        className="min-w-0 flex-1 text-[17px] font-semibold text-white lg:text-[19px]"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {p.name}
                                    </span>
                                    <span className="shrink-0 text-[13px] font-medium text-white/55">
                                        {p.count}명
                                    </span>
                                </div>
                            </li>
                        ))}
                    </Reveal>

                    {/* 응모 2단계 진행 표시 — '예약 = 응모 완료' 오해를 막는 핵심 장치 */}
                    <div className="mt-12 border-t border-white/15 pt-10 lg:mt-16 lg:pt-12">
                        <h3
                            className="text-[20px] font-bold tracking-[-0.02em] text-white lg:text-[24px]"
                            style={{ wordBreak: 'keep-all' }}
                        >
                            {confirmed
                                ? '응모가 확정되었습니다.'
                                : '경품 응모는 2단계로 완료됩니다.'}
                        </h3>
                        <p
                            className="mt-2.5 max-w-[32em] text-[14px] leading-[1.7] text-white/70 lg:text-[15px]"
                            style={{ wordBreak: 'keep-all' }}
                        >
                            {confirmed
                                ? '추첨 결과는 카카오톡 채널과 이 페이지로 안내합니다.'
                                : '사전예약만으로는 응모가 확정되지 않습니다.'}
                        </p>

                        <div className="relative mt-9 max-w-[560px]">
                            {/* 두 단계를 잇는 레일 — 1단계를 마치면 오렌지에서 녹색으로 채워진다 */}
                            <div
                                aria-hidden="true"
                                className="absolute top-[23px] right-[calc(25%+30px)] left-[calc(25%+30px)] h-[2px] rounded-full bg-white/15"
                            >
                                <div
                                    className="h-full rounded-full transition-[width] duration-200 ease-out"
                                    style={{
                                        width: registered ? '100%' : '0%',
                                        background: 'var(--success)',
                                    }}
                                />
                            </div>
                            <ol className="relative grid grid-cols-2 gap-3">
                                {stages.map((s) => {
                                    const style = STAGE_STYLE[s.state];
                                    return (
                                        <li
                                            key={s.no}
                                            className="flex flex-col items-center text-center"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-bold"
                                                style={style.node}
                                            >
                                                {s.state === 'done' ? (
                                                    <CheckMark size={20} />
                                                ) : (
                                                    s.no.charAt(0)
                                                )}
                                            </span>
                                            <p className="mt-3 text-[12px] font-semibold tracking-[0.08em] text-white/50">
                                                {s.no}
                                            </p>
                                            <p
                                                className="mt-1 text-[16px] font-bold text-white lg:text-[18px]"
                                                style={{ wordBreak: 'keep-all' }}
                                            >
                                                {s.title}
                                            </p>
                                            <span
                                                className="mt-2.5 inline-flex items-center rounded-sm px-2.5 py-1 text-[12px] font-bold"
                                                style={style.chip}
                                            >
                                                {s.chip}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* 유의사항 — 두 섹션 공통 */}
            <div className="mx-auto max-w-[960px] container-x pb-20 lg:pb-28">
                <section
                    aria-labelledby="terms"
                    className="mt-14 text-[13px] leading-[1.8] text-text-tertiary lg:mt-20"
                >
                    <h2 id="terms" className="mb-3 text-[15px] font-bold text-text-secondary">
                        유의사항
                    </h2>
                    <ul className="ml-5 list-disc space-y-1.5" style={{ wordBreak: 'keep-all' }}>
                        <li>응모 자격: 만 14세 이상.</li>
                        <li>응모 기간: 2026년 8월 19일 ~ 정식 출시일로부터 2주.</li>
                        <li>
                            응모 확정 조건: 사전예약 후, 앱 출시일로부터 2주 이내에 같은 카카오
                            계정으로 앱 가입(회원가입·기본 정보 입력)을 완료해야 합니다.
                        </li>
                        <li>EASYCHECK 앱은 Android 전용이며 측정에는 스마트워치가 필요합니다.</li>
                        <li>
                            당첨자 발표: 응모 마감 후 본 페이지에 공지하며, 카카오톡 채널로도
                            안내합니다.
                        </li>
                        <li>
                            당첨 여부는 이 페이지의 &lsquo;내 응모 결과 확인&rsquo;으로 확인할 수
                            있습니다.
                        </li>
                        <li>추첨은 응모 확정자를 대상으로 무작위 전산 추첨으로 진행합니다.</li>
                        <li>
                            당첨 시 경품 수령을 위해 별도 안내에 따라 수령 정보를 제출해야 하며,
                            발표일로부터 14일 이내에 제출하지 않으면 당첨이 취소되고 재추첨할 수
                            있습니다. 당첨 안내는 가입 시 등록한 연락처로도 이루어질 수 있습니다.
                        </li>
                        <li>경품에 부과되는 제세공과금은 당사가 부담합니다.</li>
                        <li>
                            경품은 다른 상품으로 대체되지 않으며, 부정 응모 시 취소될 수 있습니다.
                        </li>
                        <li>
                            개인정보 수집·이용: 응모 확인 목적으로 카카오 회원번호·닉네임을
                            수집하며, 이벤트 종료 후 파기합니다(당첨자는 경품 발송 완료 시까지).
                            자세한 내용은{' '}
                            <Link
                                href="/policy/privacy"
                                className="focus-ring rounded underline underline-offset-2"
                            >
                                개인정보처리방침
                            </Link>
                            을 참고하세요.
                        </li>
                    </ul>
                </section>
            </div>
            <Footer />
        </main>
    );
}
