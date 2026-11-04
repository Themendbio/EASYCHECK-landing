'use client';
// 경품 이벤트 당첨자 발표 — 카카오 로그인으로 본인 당첨 여부를 보여 주고 당첨자를 수령 양식으로 잇는다.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EVENT, claimFormUrl } from '../../../lib/event-config';
import { useClaimClosed } from '../../../hooks/useEventClosed';
import { useKakaoSdk } from '../../../hooks/useKakaoSdk';
import { Footer } from '../../../components/footer';
import styles from '../prereg/event.module.css';

// 카카오에 등록된 리다이렉트 주소 — 그 페이지가 state 를 보고 이 페이지로 넘겨 준다(winnersForwardUrl)
const KAKAO_REDIRECT_PATH = '/event/prereg';

async function fetchStatus(code) {
    const res = await fetch(`${EVENT.API_BASE}/events/prereg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}${KAKAO_REDIRECT_PATH}`,
        }),
    });
    if (!res.ok) throw new Error(`prereg status failed: ${res.status}`);
    return res.json();
}

const PRIZE_IMAGES = {
    1: '/images/prize-watch.webp',
    2: '/images/prize-tumbler.webp',
    3: '/images/prize-battery.jpg',
};

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

// 당첨 결과 — 등수를 가장 크게, 그 아래 기한과 양식 버튼
function WinnerResult({ status, claimClosed }) {
    const prize = EVENT.PRIZES.find((p) => p.rank === status.prize_rank);
    return (
        <div role="status">
            {/* .status p 의 공통 글자 크기를 피하려고 카드 안 글은 div 로 둔다 */}
            <div className="rounded-xl bg-brand-primary-soft px-5 py-6 text-center">
                <div className="text-[14px] text-text-secondary" style={{ wordBreak: 'keep-all' }}>
                    {status.nickname ? `${status.nickname}님, ` : ''}당첨을 축하드립니다
                </div>
                <div className="mt-1 text-[34px] font-black leading-tight text-brand-primary">
                    {status.prize_rank}등 당첨
                </div>
                {prize && (
                    <div className="mt-1 text-[16px] font-bold text-brand-deep">{prize.name}</div>
                )}
            </div>
            {claimClosed ? (
                <p className="mt-4" style={{ wordBreak: 'keep-all' }}>
                    수령 정보 제출 기한이 지났습니다({EVENT.CLAIM_DEADLINE_LABEL}까지). 이벤트
                    유의사항에 따라 기한까지 제출하지 않은 당첨은 취소될 수 있습니다.
                </p>
            ) : (
                <>
                    <p className="mt-4" style={{ wordBreak: 'keep-all' }}>
                        경품을 받으시려면 아래 버튼을 눌러 수령 정보를 입력해 주세요.
                    </p>
                    <p
                        className="mt-3 rounded-lg bg-[#FFF4E0] px-4 py-3 text-[14px] text-[#7A4A00]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        입력 기한 <strong>{EVENT.CLAIM_DEADLINE_LABEL}</strong>
                        <br />
                        기한까지 제출하지 않으면 당첨이 취소될 수 있습니다.
                    </p>
                    <a
                        className={`${styles.mainAction} mt-4`}
                        data-style="blue"
                        href={claimFormUrl(status.nickname, status.prize_rank)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        수령 정보 입력하기
                    </a>
                    <div
                        className="mt-2 text-[12px] text-text-tertiary"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        구글 폼으로 이동합니다. 닉네임과 등수는 미리 채워져 있습니다.
                    </div>
                </>
            )}
        </div>
    );
}

export default function WinnersPage() {
    const { ready, error } = useKakaoSdk();
    // idle | loading | done | error
    const [phase, setPhase] = useState('idle');
    const [status, setStatus] = useState(null);
    const [cancelled, setCancelled] = useState(false);
    const claimClosed = useClaimClosed();

    useEffect(() => {
        document.title = 'EASYCHECK 경품 이벤트 당첨자 발표';
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        // 동의를 취소하면 code 없이 ?error=access_denied 로 돌아온다
        if (!code && !params.get('error')) return;
        // 코드는 일회용 — URL 에서 즉시 제거해 새로고침 재제출을 막는다
        window.history.replaceState(null, '', EVENT.WINNERS_PATH);
        const check = async () => {
            if (!code) {
                setCancelled(true);
                return;
            }
            setPhase('loading');
            try {
                setStatus(await fetchStatus(code));
                setPhase('done');
            } catch {
                setPhase('error');
            }
        };
        check();
    }, []);

    useEffect(() => {
        if (phase !== 'done' && phase !== 'error') return;
        document.getElementById('result')?.scrollIntoView({ block: 'center' });
    }, [phase]);

    // 다른 계정으로 다시 확인할 때는 카카오 자동 로그인을 건너뛴다
    const startKakao = (switchAccount = false) => {
        if (!ready) return;
        window.Kakao.Auth.authorize({
            redirectUri: `${window.location.origin}${KAKAO_REDIRECT_PATH}`,
            state: EVENT.WINNERS_AUTH_STATE,
            ...(switchAccount ? { prompt: 'login' } : {}),
        });
    };

    const busy = phase === 'loading';
    const done = phase === 'done' && status;

    return (
        <main className={styles.page}>
            <nav className={styles.nav} aria-label="이벤트 페이지 메뉴">
                <Link href="/" aria-label="EASYCHECK 홈으로">
                    <img
                        className={styles.logo}
                        src="/images/easycheck-logo.webp"
                        alt="EASYCHECK"
                        width="144"
                        height="27"
                    />
                </Link>
                <Link href="/event/prereg">이벤트 안내</Link>
            </nav>
            <section className={styles.hero} aria-labelledby="winners-heading">
                <div className={styles.heroGrid}>
                    <div>
                        <p className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-[12px] font-bold text-brand-primary">
                            이벤트 종료 · 발표 완료
                        </p>
                        <h1 id="winners-heading">
                            <span>경품 이벤트</span>
                            <span>당첨자 발표</span>
                        </h1>
                        <p className={styles.intro}>
                            참여해 주셔서 감사합니다. 이벤트에 신청한 카카오 계정으로 로그인하면
                            당첨 여부를 바로 확인할 수 있습니다.
                        </p>
                    </div>
                    <img
                        className={styles.art}
                        src="/images/event-prizes-illustration.webp"
                        alt="갤럭시 워치, 텀블러, 보조배터리와 선물 상자 일러스트"
                        width="1536"
                        height="1024"
                        fetchPriority="high"
                    />
                </div>
                {!done && (
                    <div className="mx-auto mt-6 max-w-[420px]">
                        <button
                            className={styles.mainAction}
                            data-style="kakao"
                            type="button"
                            onClick={() => startKakao()}
                            disabled={!ready || busy}
                        >
                            <KakaoMark />
                            {busy
                                ? '확인 중입니다…'
                                : phase === 'error'
                                  ? '다시 시도하기'
                                  : '카카오로 당첨 확인하기'}
                        </button>
                    </div>
                )}
                {cancelled && (
                    <p className={styles.notice} role="alert">
                        카카오 로그인 동의를 취소하셨습니다. 다시 시도해 주세요.
                    </p>
                )}
                {error && (
                    <p className={styles.notice} role="alert">
                        카카오 로그인 화면을 불러오지 못했습니다. 새로고침해 주세요.
                    </p>
                )}
                {(busy || phase === 'error' || done) && (
                    <div
                        id="result"
                        className={`${styles.status} max-w-[520px]`}
                        aria-live="polite"
                        aria-busy={busy}
                    >
                        {busy && <p>당첨 여부를 확인 중입니다…</p>}
                        {phase === 'error' && (
                            <p role="alert">
                                당첨 여부를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.
                            </p>
                        )}
                        {done &&
                            (status.prize_rank ? (
                                <WinnerResult status={status} claimClosed={claimClosed} />
                            ) : status.registered ? (
                                <div role="status">
                                    <h2 style={{ wordBreak: 'keep-all' }}>
                                        이번 추첨에서는 당첨되지 않았습니다.
                                    </h2>
                                    <p>
                                        {status.nickname ? `${status.nickname}님, ` : ''}이벤트에
                                        참여해 주셔서 감사합니다.
                                    </p>
                                </div>
                            ) : (
                                <div role="status">
                                    <h2 style={{ wordBreak: 'keep-all' }}>
                                        이 카카오 계정으로 신청한 내역이 없습니다.
                                    </h2>
                                    <p>
                                        다른 카카오 계정으로 신청하셨다면 그 계정으로 다시 확인해
                                        주세요.
                                    </p>
                                    <button
                                        type="button"
                                        className={styles.secondary}
                                        onClick={() => startKakao(true)}
                                        disabled={!ready}
                                    >
                                        다른 카카오 계정으로 확인
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </section>
            <div className={styles.body}>
                <section aria-labelledby="prizes-heading">
                    <div className={styles.prizeHeading}>
                        <h2 id="prizes-heading" className={styles.sectionHeading}>
                            경품 안내
                        </h2>
                        <p>총 {EVENT.PRIZES.reduce((sum, prize) => sum + prize.count, 0)}명</p>
                    </div>
                    <div className={styles.prizes}>
                        {EVENT.PRIZES.map((prize) => (
                            <article
                                key={prize.rank}
                                className={`${styles.prize} ${prize.rank === 1 ? styles.prizeFirst : ''}`}
                            >
                                <div className={styles.prizeCopy}>
                                    <span className={styles.rank}>{prize.rank}등</span>
                                    <h3>{prize.name}</h3>
                                    <p className={styles.count}>
                                        <strong>{prize.count}</strong>명
                                    </p>
                                </div>
                                <img
                                    className={styles.product}
                                    src={PRIZE_IMAGES[prize.rank]}
                                    alt={`${prize.name} 상품 이미지`}
                                    loading="lazy"
                                />
                            </article>
                        ))}
                    </div>
                </section>
                <p className={styles.legal} style={{ wordBreak: 'keep-all' }}>
                    응모 조건을 충족한 분 중에서 무작위 전산 추첨으로 당첨자를 선정했습니다.
                    <br />
                    개인정보 보호를 위해 당첨자 명단은 공개하지 않습니다.
                </p>
                <p className={styles.legal} style={{ wordBreak: 'keep-all' }}>
                    경품에 부과되는 제세공과금은 당사가 부담합니다. 수령 정보 처리에 관한 내용은{' '}
                    <Link
                        href="/policy/privacy"
                        className="focus-ring rounded underline underline-offset-2"
                    >
                        개인정보처리방침
                    </Link>
                    과 수령 양식의 안내를 참고하세요.
                </p>
            </div>
            <Footer />
        </main>
    );
}
