'use client';
// 첫 방문 이벤트 안내 팝업 — /event 유도. '오늘 그만 보기'는 localStorage 에 당일 날짜 기록
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

// /event 히어로와 같은 광원(시안·오렌지 radial). 팝업을 그 페이지의 축소판으로 읽히게 한다.
const GLOW =
    'radial-gradient(120% 90% at 88% 0%, rgba(0,174,235,0.32) 0%, rgba(0,174,235,0) 60%), radial-gradient(90% 85% at 0% 100%, rgba(243,152,0,0.22) 0%, rgba(243,152,0,0) 65%)';

function EventPopup() {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(DISMISS_KEY) !== today()) setOpen(true);
    }, []);

    // ESC 닫기 + 배경 스크롤 잠금 (contact-modal 과 동일 패턴)
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    const dismissToday = () => {
        localStorage.setItem(DISMISS_KEY, today());
        setOpen(false);
    };

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-popup-title"
        >
            {/* Backdrop */}
            <div
                className="event-popup-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />

            {/* Panel — /event 히어로(딥 네이비 + 광원)를 카드 한 장으로 압축 */}
            <div className="event-popup-card relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-brand-deep shadow-lg">
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
                    className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-ring"
                    aria-label={t('eventPopup.close')}
                >
                    <IconX size={20} />
                </button>

                <div className="relative px-6 pt-8 pb-6 lg:px-8 lg:pt-9 lg:pb-7">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-brand-accent uppercase">
                        {t('eventPopup.badge')}
                    </span>

                    <h2
                        id="event-popup-title"
                        className="mt-3 text-[20px] leading-[1.4] font-bold tracking-[-0.025em] text-balance text-white lg:text-[23px]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        {t('eventPopup.title')}
                    </h2>

                    <p
                        className="mt-3 text-[14px] leading-[1.7]"
                        style={{ color: 'rgba(255,255,255,0.72)', wordBreak: 'keep-all' }}
                    >
                        {t('eventPopup.body')}
                    </p>

                    <Link
                        href="/event"
                        className="mt-7 flex w-full items-center justify-center gap-1 rounded-xl bg-brand-accent px-6 py-4 text-[16px] font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-px hover:bg-brand-accent-hover hover:shadow-lg focus-ring"
                    >
                        {t('eventPopup.cta')}
                        <IconChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
                    </Link>

                    <button
                        type="button"
                        onClick={dismissToday}
                        className="mx-auto mt-4 block rounded px-2 py-1 text-[13px] font-medium text-white/55 transition-colors duration-200 hover:text-white/85 focus-ring"
                    >
                        {t('eventPopup.dismissToday')}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export { EventPopup };
