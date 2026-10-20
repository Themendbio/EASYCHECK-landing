'use client';
// 경품 이벤트 상세 화면과 카카오 신청·참여 현황 조회를 연결한다.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EVENT } from '../../../lib/event-config';
import { useEventClosed } from '../../../hooks/useEventClosed';
import { useKakaoSdk } from '../../../hooks/useKakaoSdk';
import { Footer } from '../../../components/footer';
import { IconPlay } from '../../../components/icons';
import styles from './event.module.css';

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

// 경품 사진 — 등수로 매칭. 원본 비율이 제각각이라 고정 박스 + object-contain 으로 담는다.
const PRIZE_IMAGES = {
    1: '/images/prize-watch.webp',
    2: '/images/prize-tumbler.webp',
    3: '/images/prize-battery.jpg',
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

export default function PreregEventPage() {
    const { ready, error } = useKakaoSdk();
    // idle | loading | done | error
    const [phase, setPhase] = useState('idle');
    const [status, setStatus] = useState(null);
    // 카카오 동의 화면에서 취소하고 돌아온 경우
    const [cancelled, setCancelled] = useState(false);
    // 마감 판정 — 정적 export 는 접수 UI 로 프리렌더되므로 hydration 이후에 계산한다
    const pastDeadline = useEventClosed() || Boolean(status?.closed);

    useEffect(() => {
        document.title = 'EASYCHECK 경품 이벤트';
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

    const registered = Boolean(status?.registered);
    const confirmed = Boolean(status?.entry_confirmed);
    const busy = phase === 'loading';
    const canCheck = ready && !busy;
    const showInstall = registered && !confirmed && !pastDeadline;
    const deadlineDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Seoul',
        month: '2-digit',
        day: '2-digit',
    })
        .format(new Date(EVENT.PREREG_DEADLINE))
        .replace('/', '.');
    const announcementDate = EVENT.ANNOUNCEMENT_LABEL.match(/(\d+)월\s*(\d+)일/);
    const announcementShort = announcementDate
        ? `${announcementDate[1].padStart(2, '0')}.${announcementDate[2].padStart(2, '0')}`
        : EVENT.ANNOUNCEMENT_LABEL;

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
                <Link href="/event">이벤트 목록</Link>
            </nav>
            <section className={styles.hero} aria-labelledby="event-heading">
                <div className={styles.heroGrid}>
                    <div>
                        <h1 id="event-heading">
                            <span>이지체크</span>
                            <span>경품 이벤트</span>
                        </h1>
                        <p className={styles.intro}>
                            앱 가입과 기본 정보 입력을 마치고
                            <br />
                            경품 추첨에 참여하세요.
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
                <div className={styles.actionBlock}>
                    <div className={styles.dates}>
                        <div>
                            <span>응모 마감</span>
                            <strong aria-label={EVENT.DEADLINE_LABEL}>{deadlineDate}</strong>
                            <small>23:59 · 한국시간</small>
                        </div>
                        <div>
                            <span>당첨자 발표</span>
                            <strong aria-label={EVENT.ANNOUNCEMENT_LABEL}>
                                {announcementShort}
                            </strong>
                            <small>이 페이지·카카오톡 채널</small>
                        </div>
                    </div>
                    <div className={styles.actionWrap}>
                        {showInstall ? (
                            <a
                                className={styles.mainAction}
                                data-style="blue"
                                href={EVENT.PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconPlay size={20} aria-hidden="true" />
                                Google Play에서 앱 설치
                            </a>
                        ) : (
                            <button
                                className={styles.mainAction}
                                data-style={pastDeadline || confirmed ? 'blue' : 'kakao'}
                                type="button"
                                onClick={startKakao}
                                disabled={!canCheck}
                            >
                                {!pastDeadline && !confirmed && <KakaoMark />}
                                {busy
                                    ? '확인 중입니다…'
                                    : pastDeadline || confirmed
                                      ? '내 참여 현황 확인'
                                      : phase === 'error'
                                        ? '다시 시도하기'
                                        : '카카오로 신청하기'}
                            </button>
                        )}
                        {!pastDeadline && !confirmed && (
                            <button
                                className={styles.secondary}
                                type="button"
                                onClick={startKakao}
                                disabled={!canCheck}
                            >
                                내 참여 현황 확인
                            </button>
                        )}
                    </div>
                    <p className={styles.accountNote}>
                        이벤트 신청과 앱 가입은 같은 카카오 계정으로 진행해 주세요.
                    </p>
                </div>
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
                <div id="entry" className={styles.status} aria-live="polite" aria-busy={busy}>
                    {phase === 'idle' && pastDeadline && (
                        <>
                            <h2>이벤트 신청이 마감되었습니다.</h2>
                            <p>
                                당첨 결과는 {EVENT.ANNOUNCEMENT_LABEL} 이 페이지와 카카오톡 채널에서
                                확인할 수 있습니다.
                            </p>
                        </>
                    )}
                    {busy && <p>참여 현황을 확인 중입니다…</p>}
                    {phase === 'error' && (
                        <p role="alert">
                            참여 현황을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.
                        </p>
                    )}
                    {phase === 'done' && status && (
                        <div role="status">
                            {!status.registered && status.closed ? (
                                <p className="text-[15px] font-semibold text-text-primary">
                                    이벤트 신청이 마감되었습니다.
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
                                        {status.prize_rank
                                            ? `${status.prize_rank}등에 당첨되었습니다.`
                                            : '이벤트 신청이 확인되었습니다.'}
                                    </p>
                                    <p
                                        className="mt-2 text-[14px] leading-[1.7] text-text-secondary"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {status.prize_rank
                                            ? `경품은 ${
                                                  EVENT.PRIZES.find(
                                                      (p) => p.rank === status.prize_rank,
                                                  )?.name ?? '경품'
                                              }입니다. 수령 안내는 카카오톡 채널과 가입 시 등록한 연락처로 전달됩니다.`
                                            : status.entry_confirmed
                                              ? '앱 가입과 기본 정보 입력이 확인되어 추첨 대상이 되었습니다.'
                                              : status.closed
                                                ? '마감일까지 같은 카카오 계정의 앱 가입과 기본 정보 입력이 확인되지 않아 추첨 대상에 포함되지 않았습니다.'
                                                : pastDeadline
                                                  ? '신청이 마감되었습니다. 앱 가입 확인 여부는 ‘내 참여 현황 다시 확인’을 눌러 확인해 주세요.'
                                                  : `${EVENT.DEADLINE_LABEL}까지 같은 카카오 계정으로 앱 가입과 기본 정보 입력을 완료하면 추첨 대상이 됩니다.`}
                                    </p>
                                    {!status.entry_confirmed && !status.closed && pastDeadline && (
                                        <button
                                            type="button"
                                            onClick={startKakao}
                                            disabled={!ready}
                                            className="focus-ring mt-4 rounded text-[14px] font-medium text-text-secondary underline underline-offset-4 disabled:opacity-50"
                                        >
                                            내 참여 현황 다시 확인
                                        </button>
                                    )}
                                    <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                                        {/* 가입 미완이면 다음 행동인 앱 설치를 바로 잇는다 — 채널 추가보다 앞 */}
                                        {!status.entry_confirmed && !pastDeadline && (
                                            <a
                                                href={EVENT.PLAY_STORE_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3.5 text-[14px] font-bold text-white shadow-sm transition-colors duration-150 hover:bg-brand-primary-hover lg:w-auto"
                                            >
                                                <IconPlay size={18} aria-hidden="true" />
                                                Google Play에서 앱 설치
                                            </a>
                                        )}
                                        {EVENT.KAKAO_CHANNEL_URL && (
                                            <a
                                                href={EVENT.KAKAO_CHANNEL_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-5 py-3.5 text-[14px] font-bold text-[#191919] shadow-sm transition-opacity duration-150 hover:opacity-90 lg:w-auto"
                                            >
                                                <KakaoMark />
                                                카카오톡 채널 추가
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
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
                <section className={styles.how} aria-labelledby="how-heading">
                    <h2 id="how-heading" className={styles.sectionHeading}>
                        참여 방법
                    </h2>
                    <p className={styles.howIntro}>
                        <strong>같은 카카오 계정으로</strong> 두 가지를 모두 완료해 주세요.
                    </p>
                    <ol className={styles.steps}>
                        <li className={styles.step}>
                            <div className={styles.stepTop}>
                                <span
                                    className={styles.stepNumber}
                                    aria-label={registered ? '1단계 완료' : '1단계'}
                                >
                                    {registered ? <CheckMark /> : '1'}
                                </span>
                                <span className={styles.stepPlace}>이 페이지에서</span>
                            </div>
                            <h3>카카오로 이벤트 신청</h3>
                            <p>
                                {registered ? (
                                    '이벤트 신청이 확인되었습니다.'
                                ) : pastDeadline ? (
                                    '이벤트 신청이 마감되었습니다.'
                                ) : (
                                    <>
                                        아래 버튼을 눌러 <br />
                                        이벤트에 신청해 주세요.
                                    </>
                                )}
                            </p>
                            <button
                                type="button"
                                className={styles.stepAction}
                                onClick={startKakao}
                                disabled={!canCheck || registered || pastDeadline}
                            >
                                {pastDeadline
                                    ? '이벤트 신청 마감'
                                    : registered
                                      ? '이벤트 신청 확인됨'
                                      : busy
                                        ? '확인 중입니다…'
                                        : '카카오로 신청하기'}
                            </button>
                            <span className={styles.stepFootnote}>카카오 계정당 1회 신청</span>
                        </li>
                        <li className={styles.step}>
                            <div className={styles.stepTop}>
                                <span
                                    className={styles.stepNumber}
                                    aria-label={confirmed ? '2단계 완료' : '2단계'}
                                >
                                    {confirmed ? <CheckMark /> : '2'}
                                </span>
                                <span className={styles.stepPlace}>EASYCHECK 앱에서</span>
                            </div>
                            <h3>앱 가입·기본 정보 입력</h3>
                            <p>
                                이벤트를 신청한 <strong>카카오 계정으로 가입</strong>하고 <br />
                                <strong>기본 정보 입력</strong>까지 마쳐 주세요.
                            </p>
                            <a
                                className={`${styles.stepAction} ${styles.stepInstall}`}
                                href={EVENT.PLAY_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google Play에서 앱 설치
                            </a>
                            <span className={styles.stepFootnote}>
                                Android 전용 · 측정에는 갤럭시 워치 필요
                            </span>
                        </li>
                    </ol>
                    <div className={styles.completion}>
                        <span className={styles.completionMark} aria-hidden="true">
                            <CheckMark size={22} />
                        </span>
                        <div>
                            <h3>
                                {confirmed
                                    ? '응모가 완료되었습니다.'
                                    : pastDeadline
                                      ? '이벤트 신청이 마감되었습니다.'
                                      : '두 가지를 마치면 응모 완료!'}
                            </h3>
                            <p>
                                {pastDeadline
                                    ? `당첨자 발표는 ${EVENT.ANNOUNCEMENT_LABEL}입니다.`
                                    : `${EVENT.DEADLINE_LABEL}까지 모두 완료하면 추첨 대상이 됩니다.`}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={styles.howStatus}
                            onClick={startKakao}
                            disabled={!canCheck}
                        >
                            내 참여 현황 확인
                        </button>
                    </div>
                    {!pastDeadline && (
                        <p className={styles.joinedNote}>
                            <strong>이미 앱에 가입하셨나요?</strong>기본 정보 입력까지 마쳤다면,
                            가입에 사용한 카카오 계정으로 이벤트에 신청해 주세요.
                        </p>
                    )}
                </section>
                <p className={styles.legal}>
                    만 14세 이상 · 카카오 계정당 1회 응모
                    <br />
                    신청과 앱 가입·기본 정보 입력을 마감일까지 모두 완료해야 합니다.
                </p>
                <p className={styles.legal} style={{ wordBreak: 'keep-all' }}>
                    ※ 앱 측정에는 갤럭시 워치가 필요합니다(워치 없이도 응모는 가능).
                </p>
                <details className={styles.terms}>
                    <summary>이벤트 유의사항</summary>
                    <ul className="ml-5 list-disc space-y-1.5" style={{ wordBreak: 'keep-all' }}>
                        <li>응모 자격: 만 14세 이상.</li>
                        <li>응모 기간: 2026년 8월 19일 ~ {EVENT.DEADLINE_LABEL}.</li>
                        <li>
                            응모 조건: {EVENT.DEADLINE_LABEL}까지 이벤트 신청과 앱 가입·기본 정보
                            입력을 모두 완료해야 합니다. 두 단계는 같은 카카오 계정으로 진행해야
                            하며, 카카오 계정당 1회만 응모할 수 있습니다.
                        </li>
                        <li>EASYCHECK 앱은 Android 전용이며 측정에는 스마트워치가 필요합니다.</li>
                        <li>
                            당첨자 발표: {EVENT.ANNOUNCEMENT_LABEL} 이 페이지와 카카오톡 채널에서
                            안내합니다.
                        </li>
                        <li>
                            응모 상태와 당첨 여부는 &lsquo;내 참여 현황 확인&rsquo;에서 확인할 수
                            있습니다.
                        </li>
                        <li>
                            응모 조건을 충족한 분 중에서 무작위 전산 추첨으로 당첨자를 선정합니다.
                        </li>
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
                </details>
            </div>
            <Footer />
        </main>
    );
}
