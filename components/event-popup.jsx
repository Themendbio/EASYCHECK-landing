'use client';
// 첫 방문 좌하단 고정 홍보 카드 — /event/prereg 유도. '오늘 그만 보기'는 localStorage 에 당일 날짜 기록
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { IconX, IconChevronRight } from './icons';

const DISMISS_KEY = 'event-popup-dismissed';
// 로컬 기준 당일 날짜. toISOString 은 UTC 라 KST 자정~오전 9시에 전날로 기록돼,
// 그 시간대에 '오늘 그만 보기'를 눌러도 같은 날 오전 9시에 팝업이 다시 뜬다.
const today = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
};

// /event 히어로와 같은 광원(시안·오렌지 radial). 카드를 그 페이지의 축소판으로 읽히게 한다.
const GLOW =
    'radial-gradient(120% 90% at 88% 0%, rgba(0,174,235,0.32) 0%, rgba(0,174,235,0) 60%), radial-gradient(90% 85% at 0% 100%, rgba(243,152,0,0.22) 0%, rgba(243,152,0,0) 65%)';

// 흰 배경 제품 사진이라 고정 높이 흰 타일에 담는다. 로드 실패해도 높이가 유지된다.
function PrizeShot({ src, alt, className }) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-contain text-[11px] text-text-tertiary"
            />
        </div>
    );
}

function EventPopup() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(DISMISS_KEY) !== today()) setOpen(true);
    }, []);

    const dismissToday = () => {
        localStorage.setItem(DISMISS_KEY, today());
        setOpen(false);
    };

    if (!open || typeof document === 'undefined') return null;

    // 고정 위치 기준을 viewport 로 잡기 위해 body 로 portal (헤더의 backdrop-filter 회피)
    return createPortal(
        <section
            aria-labelledby="event-promo-title"
            className="event-popup-card fixed right-4 bottom-4 left-4 z-40 overflow-hidden rounded-2xl bg-brand-deep shadow-lg lg:right-auto lg:bottom-6 lg:left-6 lg:w-[320px]"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: GLOW }}
            />
            {/* 상단 액센트 바 — /event 히어로의 오렌지·시안 두 광원을 한 줄로 압축 */}
            <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{
                    background:
                        'linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent) 45%, var(--brand-sky) 100%)',
                }}
            />

            <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring absolute top-2.5 right-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-white/55 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                aria-label={t('eventPopup.close')}
            >
                <IconX size={18} />
            </button>

            <div className="relative px-4 pt-3.5 pb-3.5">
                <span className="text-[11px] font-semibold tracking-[0.1em] text-brand-accent uppercase">
                    {t('eventPopup.badge')}
                </span>

                <h2
                    id="event-promo-title"
                    className="mt-1.5 pr-7 text-[17px] leading-[1.35] font-bold tracking-[-0.025em] text-balance text-white"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {t('eventPopup.title')}
                </h2>

                {/* 경품 사진 선반 — 흰 타일 한 장에 세 제품을 담아 전단지처럼 보여준다 */}
                <div className="relative mt-3 rounded-xl bg-white p-2.5">
                    <span className="absolute top-0 left-0 z-10 inline-flex items-center rounded-tl-xl rounded-br-lg bg-brand-accent px-2 py-1 text-[11px] font-bold text-white">
                        {t('eventPopup.rank1')}
                    </span>
                    <div className="grid grid-cols-[1.3fr_1fr] gap-2.5">
                        <PrizeShot
                            src="/images/prize-watch.webp"
                            alt="갤럭시 워치8"
                            className="h-[100px] lg:h-[108px]"
                        />
                        <div className="grid gap-2 border-l border-border pl-2.5">
                            <PrizeShot
                                src="/images/prize-tumbler.webp"
                                alt="스탠리 텀블러"
                                className="h-[46px] lg:h-[50px]"
                            />
                            <PrizeShot
                                src="/images/prize-battery.jpg"
                                alt="보조배터리"
                                className="h-[46px] lg:h-[50px]"
                            />
                        </div>
                    </div>
                </div>

                <p
                    className="mt-3 text-[12.5px] leading-[1.6] lg:text-[13px]"
                    style={{ color: 'rgba(255,255,255,0.72)', wordBreak: 'keep-all' }}
                >
                    {t('eventPopup.body')}
                </p>

                <Link
                    href="/event/prereg"
                    className="focus-ring mt-3.5 flex w-full items-center justify-center gap-1 rounded-xl bg-brand-accent px-5 py-3 text-[15px] font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-px hover:bg-brand-accent-hover hover:shadow-lg"
                >
                    {t('eventPopup.cta')}
                    <IconChevronRight size={17} strokeWidth={2.4} aria-hidden="true" />
                </Link>

                <button
                    type="button"
                    onClick={dismissToday}
                    className="focus-ring mx-auto mt-2 block rounded px-2 py-1 text-[12.5px] font-medium text-white/55 transition-colors duration-200 hover:text-white/85"
                >
                    {t('eventPopup.dismissToday')}
                </button>
            </div>
        </section>,
        document.body,
    );
}

export { EventPopup };
