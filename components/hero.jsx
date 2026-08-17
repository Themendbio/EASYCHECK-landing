'use client';
import React, { useState } from 'react';
import { IconMenu, IconPlay, IconCheck, IconChevronRight } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactModal } from './contact-modal';
import { EVENT } from '../lib/event-config';

// Nav
function Nav() {
    const [open, setOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const { locale, setLocale, t } = useLanguage();

    return (
        <header className="sticky top-0 z-30 nav-blur border-b border-border">
            <div className="mx-auto max-w-8xl container-x flex items-center justify-between h-16 lg:h-[72px]">
                {/* Wordmark */}
                <a href="#" className="focus-ring rounded-md" aria-label="EASYCHECK 홈으로">
                    <img
                        src="/images/easycheck-logo.webp"
                        alt="EASYCHECK"
                        className="h-6 lg:h-7 w-auto select-none"
                    />
                </a>

                {/* Desktop links */}
                <nav className="hidden lg:flex items-center gap-4" aria-label="주요 메뉴">
                    <a
                        href="/event"
                        className="text-[14px] font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200 px-1 py-1 rounded focus-ring"
                    >
                        {t('nav.event')}
                    </a>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-1 bg-bg-subtle rounded-lg p-1">
                        <button
                            onClick={() => setLocale('ko')}
                            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 focus-ring ${
                                locale === 'ko'
                                    ? 'bg-white text-text-primary shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                            aria-label="한국어"
                        >
                            한국어
                        </button>
                        <button
                            onClick={() => setLocale('en')}
                            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 focus-ring ${
                                locale === 'en'
                                    ? 'bg-white text-text-primary shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                            aria-label="English"
                        >
                            English
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setContactOpen(true)}
                        className="inline-flex items-center gap-2 bg-brand-accent text-white font-semibold text-[14px] px-4 py-2.5 rounded-lg shadow-sm hover:bg-brand-accent-hover hover:-translate-y-px hover:shadow-md transition-all duration-200 focus-ring"
                        aria-label={t('nav.contact')}
                    >
                        {t('nav.contact')}
                    </button>
                </nav>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-text-primary hover:bg-bg-subtle focus-ring"
                    aria-label={t('nav.menuOpen')}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <IconMenu size={22} />
                </button>
            </div>

            {/* Mobile menu — 햄버거로 열리는 패널. 데스크톱 메뉴와 같은 항목을 담는다. */}
            {open && (
                <nav
                    className="lg:hidden border-t border-border bg-white container-x py-4 flex flex-col gap-3"
                    aria-label="주요 메뉴"
                >
                    <a
                        href="/event"
                        onClick={() => setOpen(false)}
                        className="text-[15px] font-semibold text-text-primary py-2 rounded focus-ring"
                    >
                        {t('nav.event')}
                    </a>

                    <div className="flex items-center gap-1 bg-bg-subtle rounded-lg p-1 self-start">
                        <button
                            onClick={() => setLocale('ko')}
                            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 focus-ring ${
                                locale === 'ko'
                                    ? 'bg-white text-text-primary shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                            aria-label="한국어"
                        >
                            한국어
                        </button>
                        <button
                            onClick={() => setLocale('en')}
                            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 focus-ring ${
                                locale === 'en'
                                    ? 'bg-white text-text-primary shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                            aria-label="English"
                        >
                            English
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            setContactOpen(true);
                        }}
                        className="inline-flex items-center justify-center bg-brand-accent text-white font-semibold text-[15px] px-4 py-3 rounded-lg shadow-sm hover:bg-brand-accent-hover transition-all duration-200 focus-ring"
                    >
                        {t('nav.contact')}
                    </button>
                </nav>
            )}

            <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
        </header>
    );
}

// Hero
function Hero() {
    const { t } = useLanguage();

    // 출시 전에는 Play 대신 사전예약 이벤트로 보낸다
    const prereg = EVENT.PHASE === 'prereg';
    const ctaLabel = prereg ? t('hero.preregButton') : t('hero.downloadButton');

    const certifications = [
        t('hero.certifications.cert1'),
        t('hero.certifications.cert2'),
        t('hero.certifications.cert3'),
        t('hero.certifications.cert4'),
        t('hero.certifications.cert5'),
    ];

    const stagger = (i) => ({ animationDelay: `${i * 80}ms` });

    return (
        <>
            <section
                aria-labelledby="hero-headline"
                data-screen-label="01 Hero"
                className="relative overflow-hidden hero-video-section"
            >
                {/* 배경 영상 */}
                <video
                    className="hero-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                >
                    <source src={'/video/hero-video.mp4'} type="video/mp4" />
                </video>
                {/* 반투명 검정 오버레이 */}
                <div className="hero-video-overlay" aria-hidden="true" />

                <div
                    className="
            relative z-10
            mx-auto max-w-8xl px-6 lg:px-20
            py-28 lg:py-[160px]
            flex flex-col items-start justify-center
          "
                >
                    {/* 텍스트 + CTA + 인증 */}
                    <div className="w-full max-w-[820px] flex flex-col lg:pl-8 xl:pl-12">
                        {/* Headline */}
                        <h1
                            id="hero-headline"
                            className="
                anim-up hero-headline
                text-[44px] lg:text-[80px] font-bold leading-[1.13] tracking-[-0.025em]
                text-white mb-5
              "
                            style={{ ...stagger(1), wordBreak: 'keep-all' }}
                        >
                            <span className="block text-brand-accent">{t('hero.headline1')}</span>
                            <span className="block">{t('hero.headline2')}</span>
                        </h1>

                        {/* 설명 */}
                        <p
                            className="anim-up text-[17px] lg:text-[19px] leading-[1.6] max-w-[32em] mb-10"
                            style={{
                                ...stagger(2),
                                color: 'rgba(255,255,255,0.88)',
                                textShadow: '0 1px 12px rgba(0,16,40,0.4)',
                            }}
                        >
                            {t('hero.description')}
                        </p>

                        {/* CTA 버튼 영역 */}
                        <div className="anim-up" style={stagger(3)}>
                            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                                {/* 주 버튼 — 사전예약(출시 전) / Google Play(출시 후) */}
                                <a
                                    href={prereg ? '/event/prereg' : EVENT.PLAY_STORE_URL}
                                    aria-label={ctaLabel}
                                    className="
                    inline-flex items-center justify-center gap-2.5
                    w-full max-w-[360px] lg:w-auto lg:max-w-none
                    bg-white text-text-primary font-semibold text-[17px]
                    px-7 py-4 lg:px-8 lg:py-[18px]
                    rounded-lg shadow-md
                    transition-all duration-200 focus-ring cta-primary-btn
                  "
                                >
                                    {prereg ? (
                                        <IconChevronRight
                                            size={20}
                                            className="text-brand-accent order-last"
                                            strokeWidth={2.4}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <IconPlay
                                            size={20}
                                            className="text-brand-primary"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {ctaLabel}
                                </a>
                            </div>

                            {/* 캡션 */}
                            <p
                                className="mt-4 text-[13px] leading-snug"
                                style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                                {prereg ? t('hero.preregCaption') : t('hero.caption')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero 하단 신뢰 정보 띠지 */}
            <div className="trust-band" aria-label="인증 및 연구 정보">
                <div className="mx-auto max-w-8xl px-6 lg:px-12 py-5">
                    <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:gap-x-9">
                        {certifications.map((c, i) => (
                            <React.Fragment key={c}>
                                <li className="inline-flex items-center gap-2 whitespace-nowrap">
                                    <IconCheck
                                        size={15}
                                        className="text-brand-primary shrink-0"
                                        strokeWidth={2.4}
                                        aria-hidden="true"
                                    />
                                    <span className="text-[14px] lg:text-[15px] font-medium text-text-secondary tracking-[-0.01em]">
                                        {c}
                                    </span>
                                </li>
                                {i < certifications.length - 1 ? (
                                    <li aria-hidden="true" className="hidden lg:block">
                                        <span
                                            className="block w-[5px] h-[5px] rounded-full"
                                            style={{ backgroundColor: '#cbd2db' }}
                                        />
                                    </li>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export { Nav, Hero };
