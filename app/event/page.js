'use client';
// 전단지 사전예약·경품 응모 이벤트 페이지 — 카카오 인가 코드 리다이렉트 처리 포함
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EVENT } from '../../lib/event-config';
import { useKakaoSdk } from '../../hooks/useKakaoSdk';
import { Reveal } from '../../components/ui/Reveal';

// 응모/조회 공용 — 인가 코드를 서버로 보내 상태를 받는다
async function submitCode(code) {
    const res = await fetch(`${EVENT.API_BASE}/events/prereg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: `${window.location.origin}/event` }),
    });
    if (!res.ok) throw new Error(`prereg failed: ${res.status}`);
    return res.json();
}

const STEPS = [
    '아래 버튼을 눌러 카카오 계정으로 사전예약합니다.',
    '앱이 출시되면 같은 카카오 계정으로 가입을 완료합니다.',
    '가입까지 완료한 분들 중 추첨해 경품을 드립니다.',
];

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

export default function EventPage() {
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
                window.history.replaceState(null, '', '/event');
                setCancelled(true);
            }
            return;
        }
        // 코드는 일회용 — URL 에서 즉시 제거해 새로고침 재제출을 막는다
        window.history.replaceState(null, '', '/event');
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
        window.Kakao.Auth.authorize({ redirectUri: `${window.location.origin}/event` });
    };

    const stagger = (i) => ({ animationDelay: `${i * 90}ms` });

    return (
        <main className="bg-bg-base">
            {/* 상단 브랜드 바 — 랜딩 내비게이션과 동일한 흰 배경/로고로 사이트 연속성 유지 */}
            <div className="border-b border-border bg-white">
                <div className="mx-auto max-w-[960px] container-x flex h-14 items-center lg:h-16">
                    <Link href="/" className="focus-ring rounded-md" aria-label="EASYCHECK 홈으로">
                        <img
                            src="/images/easycheck-logo.webp"
                            alt="EASYCHECK"
                            className="h-[22px] w-auto select-none lg:h-6"
                        />
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

            <div className="mx-auto max-w-[960px] container-x pb-20 lg:pb-28">
                {/* 경품 — 히어로 위로 겹쳐 올려 스크롤 없이 보상이 먼저 눈에 들어오게 한다 */}
                <Reveal
                    as="section"
                    y={16}
                    aria-labelledby="prizes"
                    className="relative z-10 -mt-16 rounded-2xl border border-border bg-white p-6 shadow-lg lg:-mt-20 lg:p-9"
                >
                    <h2
                        id="prizes"
                        className="text-[13px] font-semibold tracking-[0.1em] text-brand-primary uppercase"
                    >
                        경품
                    </h2>
                    <ul className="mt-5 space-y-3">
                        {EVENT.PRIZES.map((p, i) => {
                            const featured = i === 0;
                            return (
                                <li
                                    key={p.rank}
                                    className={`relative flex items-center gap-4 overflow-hidden rounded-xl border px-5 ${
                                        featured
                                            ? 'border-brand-accent/35 bg-[#FFF9F0] py-6'
                                            : 'border-border bg-bg-subtle py-4'
                                    }`}
                                >
                                    {featured && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -right-3 -bottom-7 text-[104px] leading-none font-bold text-brand-accent/10 select-none"
                                        >
                                            {p.rank}
                                        </span>
                                    )}
                                    <span
                                        className={`inline-flex shrink-0 items-center justify-center rounded-lg text-[13px] font-bold ${
                                            featured
                                                ? 'bg-brand-accent px-3 py-1.5 text-white'
                                                : 'bg-brand-primary-soft px-2.5 py-1 text-brand-primary'
                                        }`}
                                    >
                                        {p.rank}등
                                    </span>
                                    <span
                                        className={`min-w-0 flex-1 font-semibold text-text-primary ${
                                            featured ? 'text-[20px] lg:text-[22px]' : 'text-[16px]'
                                        }`}
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {p.name}
                                    </span>
                                    <span className="relative shrink-0 text-[14px] font-medium text-text-tertiary">
                                        {p.count}명
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </Reveal>

                {/* 참여 방법 */}
                <Reveal as="section" y={16} aria-labelledby="how" className="mt-14 lg:mt-20">
                    <h2
                        id="how"
                        className="text-[22px] font-bold tracking-[-0.02em] text-text-primary lg:text-[26px]"
                    >
                        참여 방법
                    </h2>
                    <ol className="relative mt-6 space-y-6">
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
                </Reveal>

                {/* CTA / 결과 */}
                <Reveal
                    as="section"
                    id="entry"
                    y={16}
                    className="mt-10 scroll-mt-8 rounded-2xl border border-border bg-bg-subtle px-5 py-7 lg:mt-14 lg:px-9 lg:py-9"
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
                                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] px-8 py-4 lg:w-auto text-[16px] font-bold text-[#191919] shadow-md transition-all duration-200 hover:-translate-y-px hover:shadow-lg focus-ring disabled:translate-y-0 disabled:opacity-50 disabled:shadow-md lg:text-[17px]"
                            >
                                <KakaoMark />
                                카카오로 사전예약하고 응모하기
                            </button>
                            <p
                                className="mt-3 text-[13px] leading-[1.7] text-text-tertiary"
                                style={{ wordBreak: 'keep-all' }}
                            >
                                중복 응모 방지를 위해 본인 확인만 합니다. 연락처는 받지 않습니다.
                                로그인하면 응모가 접수됩니다.
                            </p>
                            <div className="mt-5 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={startKakao}
                                    disabled={!ready}
                                    className="rounded text-[14px] font-medium text-text-secondary underline underline-offset-4 focus-ring disabled:opacity-50"
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
                                className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] px-6 py-3.5 text-[15px] font-bold text-[#191919] shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md focus-ring disabled:translate-y-0 disabled:opacity-50 disabled:shadow-sm lg:w-auto"
                            >
                                <KakaoMark />
                                다시 시도하기
                            </button>
                        </div>
                    )}
                    {phase === 'done' && status && (
                        <div
                            role="status"
                            className="rounded-xl border border-border bg-white px-5 py-5 lg:px-6"
                        >
                            {!status.registered && status.closed ? (
                                <p className="text-[15px] font-semibold text-text-primary">
                                    사전예약 접수가 마감되었습니다.
                                </p>
                            ) : (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-success/10"
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                            <path
                                                d="m5 12.5 4.5 4.5L19 7.5"
                                                stroke="#16A34A"
                                                strokeWidth="2.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <p
                                        className="text-[17px] font-bold text-text-primary lg:text-[19px]"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {status.nickname ? `${status.nickname}님, ` : ''}사전예약이
                                        접수되었습니다.
                                    </p>
                                    <p
                                        className="mt-2 text-[14px] leading-[1.7] text-text-secondary"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {status.entry_confirmed
                                            ? '앱 가입까지 확인되어 응모가 확정되었습니다.'
                                            : '앱이 출시되면 같은 카카오 계정으로 가입해 주세요. 가입까지 완료해야 응모가 확정됩니다.'}
                                    </p>
                                    {EVENT.KAKAO_CHANNEL_URL && (
                                        <a
                                            href={EVENT.KAKAO_CHANNEL_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-5 py-3.5 text-[14px] font-bold text-[#191919] shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md focus-ring lg:w-auto"
                                        >
                                            <KakaoMark />
                                            카카오톡 채널 추가하고 출시·당첨 소식 받기
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </Reveal>

                {/* 유의사항 */}
                <section
                    aria-labelledby="terms"
                    className="mt-14 border-t border-border pt-8 text-[13px] leading-[1.8] text-text-tertiary lg:mt-20"
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
                        <li>
                            당첨 시 경품 수령을 위해 별도 안내에 따라 수령 정보를 제출해야 하며,
                            기한 내 미제출 시 당첨이 취소되고 재추첨할 수 있습니다. 당첨 안내는 가입
                            시 등록한 연락처로도 이루어질 수 있습니다.
                        </li>
                        <li>REPLACE_ME_제세공과금: 제세공과금 부담 주체 확정 후 문구 기입.</li>
                        <li>
                            경품은 다른 상품으로 대체되지 않으며, 부정 응모 시 취소될 수 있습니다.
                        </li>
                        <li>
                            개인정보 수집·이용: 응모 확인 목적으로 카카오 회원번호·닉네임을
                            수집하며, 이벤트 종료 후 파기합니다(당첨자는 경품 발송 완료 시까지).
                            자세한 내용은{' '}
                            <Link
                                href="/policy/privacy"
                                className="underline underline-offset-2 focus-ring rounded"
                            >
                                개인정보처리방침
                            </Link>
                            을 참고하세요.
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
}
