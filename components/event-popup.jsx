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
            className="event-popup-card fixed right-4 bottom-4 left-4 z-40 rounded-xl border-t-[3px] border-brand-accent bg-brand-deep shadow-lg lg:right-auto lg:bottom-6 lg:left-6 lg:w-[320px]"
        >
            {/* 히트 영역은 before 로 44px 까지 넓히고 보이는 크기는 32px 로 둔다 */}
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring absolute top-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-white/55 transition-colors duration-150 before:absolute before:-inset-1.5 before:content-[''] hover:bg-white/10 hover:text-white"
                aria-label={t('eventPopup.close')}
            >
                <IconX size={18} />
            </button>

            <div className="relative px-4 pt-3 pb-3">
                <h2
                    id="event-promo-title"
                    className="pr-9 text-[17px] leading-[1.35] font-bold tracking-[-0.025em] text-balance text-white"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {t('eventPopup.title')}
                </h2>

                {/* 경품 사진 선반 — 흰 타일 한 장에 세 제품을 나란히 담는다.
                    1등 워치는 가로형이라 칸을 넓게 준다. 카드 16px · 좌우 패딩 16px 이므로 타일 반경은 8px */}
                <div className="relative mt-2.5 rounded-md bg-white p-2">
                    <span className="absolute top-0 left-0 z-10 inline-flex items-center rounded-tl-md rounded-br-md bg-brand-accent px-1.5 py-0.5 text-[11px] font-bold text-white">
                        {t('eventPopup.rank1')}
                    </span>
                    <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2">
                        <PrizeShot
                            src="/images/prize-watch.webp"
                            alt="갤럭시 워치8"
                            className="h-[60px] lg:h-[64px]"
                        />
                        <PrizeShot
                            src="/images/prize-tumbler.webp"
                            alt="스탠리 텀블러"
                            className="h-[60px] lg:h-[64px]"
                        />
                        <PrizeShot
                            src="/images/prize-battery.jpg"
                            alt="보조배터리"
                            className="h-[60px] lg:h-[64px]"
                        />
                    </div>
                </div>

                <p
                    className="mt-2.5 text-[12.5px] leading-[1.6] text-white/70 lg:text-[13px]"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {t('eventPopup.body')}
                </p>

                <Link
                    href="/event/prereg"
                    className="focus-ring mt-3 flex w-full items-center justify-center gap-1 rounded-md bg-brand-accent px-5 py-3 text-[15px] font-bold text-white shadow-sm transition-colors duration-150 hover:bg-brand-accent-hover"
                >
                    {t('eventPopup.cta')}
                    <IconChevronRight size={17} strokeWidth={2.4} aria-hidden="true" />
                </Link>

                <button
                    type="button"
                    onClick={dismissToday}
                    className="focus-ring mx-auto mt-1.5 block rounded px-2 py-1 text-[12.5px] font-medium text-white/55 transition-colors duration-150 hover:text-white/85"
                >
                    {t('eventPopup.dismissToday')}
                </button>
            </div>
        </section>,
        document.body,
    );
}

export { EventPopup };
