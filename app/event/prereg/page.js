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
    '아래 버튼을 눌러 카카오 계정으로 사전예약합니다.',
    '앱이 출시되면 같은 카카오 계정으로 가입하고 기본 정보 입력까지 마칩니다.',
    '가입까지 완료한 분들 중 추첨해 경품을 드립니다.',
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
        node: { background: '#16A34A', color: '#FFFFFF', border: '1px solid #16A34A' },
        chip: { background: 'rgba(22,163,74,0.20)', color: '#8FE9B4' },
    },
    active: {
        node: { background: '#F39800', color: '#FFFFFF', border: '1px solid #F39800' },
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
function CheckMark({ size = 18, stroke = 'currentColor' }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
            <path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke={stroke}
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
        <div className={`overflow-hidden rounded-xl bg-white p-3 lg:p-4 ${className}`}>
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
            note: registered ? '접수되었습니다.' : '지금 하실 수 있습니다.',
            chip: registered ? '완료' : '지금 가능',
        },
        {
            no: '2단계',
            title: '출시 후 앱 가입',
            state: confirmed ? 'done' : 'pending',
            note: confirmed ? '가입이 확인되었습니다.' : '앱 출시 후에 하실 수 있습니다.',
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
                    {/* 고지 배너 — 전단지의 7월 일정·"지금 다운로드" 문구와의 차이를 최상단에서 정정 */}
                    <div
                        className="anim-up rounded-r-xl border-l-[3px] border-brand-accent bg-white/[0.08] py-4 pr-5 pl-4 text-[14px] leading-[1.7]"
                        style={{ ...stagger(0), color: 'rgba(255,255,255,0.82)' }}
                    >
                        <p className="font-bold text-brand-accent">이벤트 기간이 연장되었습니다.</p>
                        <p className="mt-1" style={{ wordBreak: 'keep-all' }}>
                            전단지에 안내된 7월 일정은 연장 전 안내입니다. 앱은 현재 출시 준비
                            중이며, 지금은{' '}
                            <strong className="font-semibold text-white">사전예약으로 응모</strong>
                            하실 수 있습니다.
                        </p>
                        <p className="mt-2 text-[13px] text-white/70">
                            기간 — 2026년 8월 19일 ~ 정식 출시일로부터 2주
                        </p>
                    </div>

                    <h1
                        className="anim-up hero-headline mt-9 text-[38px] leading-[1.14] font-bold tracking-[-0.03em] text-white lg:mt-12 lg:text-[56px]"
                        style={{ ...stagger(1), wordBreak: 'keep-all' }}
                    >
                        사전예약하고
                        <br />
                        <span className="text-brand-accent">경품 응모하세요</span>
                    </h1>
                    <p
                        className="anim-up mt-5 max-w-[26em] text-[16px] leading-[1.7] lg:text-[18px]"
                        style={{
                            ...stagger(2),
                            color: 'rgba(255,255,255,0.78)',
                            wordBreak: 'keep-all',
                        }}
                    >
                        오늘 내 컨디션, 가볍게 체크. EASYCHECK 출시를 사전예약하면 추첨을 통해
                        경품을 드립니다.
                    </p>
                </div>
            </section>

            {/* A. 사전예약 — 지금 할 수 있는 것. 참여 방법·CTA·결과가 모두 이 섹션 안에만 있다. */}
            <div className="mx-auto max-w-[960px] container-x">
                <Reveal
                    as="section"
                    y={16}
                    aria-labelledby="prereg-heading"
                    className="relative z-10 -mt-16 rounded-2xl border border-border bg-white p-6 shadow-lg lg:-mt-20 lg:p-9"
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
                        카카오 로그인 한 번으로 사전예약이 접수됩니다. 앱은 아직 출시 전이라 지금은
                        여기까지 하시면 됩니다.
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
                        className="mt-8 scroll-mt-8 rounded-2xl border border-border bg-bg-subtle px-5 py-7 lg:px-7"
                    >
                        {phase === 'idle' && (
                            <>
                                {cancelled && (
                                    <p
                                        role="alert"
                                        className="mb-4 rounded-lg border border-brand-accent/35 bg-[#FFF9F0] px-4 py-3 text-[13px] leading-[1.7] text-text-secondary"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        <strong className="font-semibold text-text-primary">
                                            동의를 취소하셨습니다.
                                        </strong>{' '}
                                        아래 버튼으로 다시 시도해 주세요.
                                    </p>
                                )}
                                {error && (
                                    <p
                                        role="alert"
                                        className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-[1.7] text-red-700"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        <strong className="font-semibold">
                                            카카오 로그인을 불러오지 못했습니다.
                                        </strong>{' '}
                                        네트워크 연결을 확인한 뒤 페이지를 새로고침해 주세요.
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={startKakao}
                                    disabled={!ready}
                                    className="focus-ring inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] px-8 py-4 text-[16px] font-bold text-[#191919] shadow-md transition-all duration-200 hover:-translate-y-px hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 disabled:shadow-md lg:w-auto lg:text-[17px]"
                                >
                                    <KakaoMark />
                                    카카오로 사전예약하고 응모하기
                                </button>
                                <p
                                    className="mt-3 text-[13px] leading-[1.7] text-text-tertiary"
                                    style={{ wordBreak: 'keep-all' }}
                                >
                                    중복 응모 방지를 위해 본인 확인만 합니다. 연락처는 받지
                                    않습니다. 로그인하면 응모가 접수됩니다.
                                </p>
                                <div className="mt-5 border-t border-border pt-4">
                                    <button
                                        type="button"
                                        onClick={startKakao}
                                        disabled={!ready}
                                        className="focus-ring rounded text-[14px] font-medium text-text-secondary underline underline-offset-4 disabled:opacity-50"
                                    >
                                        이미 예약하셨나요? 내 응모 결과 확인
                                    </button>
                                </div>
                            </>
                        )}
                        {phase === 'loading' && (
                            <p className="flex items-center gap-3 text-[15px] text-text-secondary">
                                <span
                                    aria-hidden="true"
                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border-strong border-t-brand-primary"
                                />
                                확인 중입니다…
                            </p>
                        )}
                        {phase === 'error' && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-5 py-4"
                            >
                                <p
                                    className="text-[15px] leading-[1.7] text-red-600"
                                    style={{ wordBreak: 'keep-all' }}
                                >
                                    처리에 실패했습니다. 잠시 후 다시 시도해 주세요.
                                </p>
                                <button
                                    type="button"
                                    onClick={startKakao}
                                    disabled={!ready}
                                    className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] px-6 py-3.5 text-[15px] font-bold text-[#191919] shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:translate-y-0 disabled:opacity-50 disabled:shadow-sm lg:w-auto"
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
                                            className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success"
                                        >
                                            <CheckMark stroke="#16A34A" />
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
                                                : '앱이 출시되면 같은 카카오 계정으로 가입하고 기본 정보 입력까지 마쳐 주세요. 여기까지 완료해야 응모가 확정됩니다.'}
                                        </p>
                                        {EVENT.KAKAO_CHANNEL_URL && (
                                            <a
                                                href={EVENT.KAKAO_CHANNEL_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-5 py-3.5 text-[14px] font-bold text-[#191919] shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md lg:w-auto"
                                            >
                                                <KakaoMark />
                                                카카오톡 채널 추가하고 출시·당첨 소식 받기
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
                className="relative mt-16 overflow-hidden bg-brand-deep lg:mt-24"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(90% 70% at 12% 0%, rgba(243,152,0,0.22) 0%, rgba(243,152,0,0) 62%), radial-gradient(90% 80% at 100% 100%, rgba(0,174,235,0.26) 0%, rgba(0,174,235,0) 60%)',
                    }}
                />
                <div className="relative mx-auto max-w-[960px] container-x py-14 lg:py-20">
                    <p className="text-[13px] font-semibold tracking-[0.1em] text-brand-accent uppercase">
                        경품 응모
                    </p>
                    <h2
                        id="prizes-heading"
                        className="mt-2 text-[26px] font-bold tracking-[-0.025em] text-white lg:text-[34px]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        추첨으로 드리는 경품
                    </h2>

                    {/* 1등 — 사진을 크게 쓰는 홍보 영역. 흰 타일에 담아 제품 배경이 패널과 충돌하지 않게 한다. */}
                    <Reveal
                        y={16}
                        className="mt-8 grid gap-5 rounded-2xl border border-white/15 bg-white/[0.06] p-5 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:p-7"
                    >
                        <PrizePhoto
                            src={PRIZE_IMAGES[1]}
                            alt={EVENT.PRIZES[0].name}
                            className="h-[190px] lg:h-[240px]"
                        />
                        <div>
                            <span className="inline-flex items-center rounded-lg bg-brand-accent px-3 py-1.5 text-[13px] font-bold text-white">
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
                            <li
                                key={p.rank}
                                className="rounded-2xl border border-white/15 bg-white/[0.06] p-5"
                            >
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
                                ? '두 단계를 모두 마치셨습니다. 추첨 결과는 카카오톡 채널과 이 페이지로 안내드립니다.'
                                : '사전예약만으로는 응모가 확정되지 않습니다. 앱 출시 후 같은 카카오 계정으로 가입까지 마쳐야 추첨 대상이 됩니다.'}
                        </p>

                        <div className="relative mt-9 max-w-[560px]">
                            {/* 두 단계를 잇는 레일 — 1단계를 마치면 오렌지에서 녹색으로 채워진다 */}
                            <div
                                aria-hidden="true"
                                className="absolute top-[23px] right-[calc(25%+30px)] left-[calc(25%+30px)] h-[2px] rounded-full bg-white/15"
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: registered ? '100%' : '0%',
                                        background: '#16A34A',
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
                                                    <CheckMark size={20} stroke="#FFFFFF" />
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
                                                className="mt-2.5 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold"
                                                style={style.chip}
                                            >
                                                {s.chip}
                                            </span>
                                            <p
                                                className="mt-2 text-[13px] leading-[1.6] text-white/60"
                                                style={{ wordBreak: 'keep-all' }}
                                            >
                                                {s.note}
                                            </p>
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
