'use client';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from './ui/Reveal';
import { TemperatureChart } from './ui/TemperatureChart';

// Section 2 — 통계: 연도별 여름 평균기온

function StatsSection() {
    const { t, locale } = useLanguage();

    return (
        <section
            id="stats"
            data-screen-label="02 통계"
            aria-label="연도별 여름 평균기온"
            className="relative z-10 px-6 lg:px-20 py-24 md:py-32"
        >
            <div className="mx-auto max-w-7xl rounded-3xl bg-white/85 backdrop-blur-sm shadow-xl ring-1 ring-white/60 px-6 py-10 md:px-12 md:py-14">
                {/* 섹션 헤더 */}
                <div className="text-left mb-8 md:mb-10">
                    {/* 제목 */}
                    <Reveal
                        as="h2"
                        delay={0}
                        className="text-[34px] md:text-[40px] lg:text-[52px] font-bold leading-tight text-text-primary mb-4"
                        style={{ letterSpacing: locale === 'en' ? '-0.01em' : '-0.02em' }}
                    >
                        {t('stats.title')}
                    </Reveal>

                    {/* 설명 */}
                    <Reveal
                        as="p"
                        delay={100}
                        className="text-[15px] lg:text-[17px] leading-[1.6] text-text-secondary max-w-2xl"
                    >
                        {t('stats.description')}
                    </Reveal>
                </div>

                {/* 영어일 때 Placeholder */}
                {locale === 'en' ? (
                    <Reveal delay={200} className="flex items-center justify-center py-20 lg:py-32">
                        <div className="text-center max-w-2xl px-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bg-muted mb-6">
                                <svg
                                    className="w-10 h-10 text-text-tertiary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-[24px] lg:text-[32px] font-bold text-text-primary mb-4"
                                style={{ letterSpacing: '-0.01em' }}
                            >
                                Global Climate Data
                            </h3>
                            <p
                                className="text-[15px] lg:text-[17px] text-text-secondary leading-[1.6]"
                                style={{ wordBreak: 'keep-all' }}
                            >
                                Chart visualization with global temperature trends will be displayed
                                here.
                            </p>
                        </div>
                    </Reveal>
                ) : (
                    <TemperatureChart t={t} locale={locale} />
                )}
            </div>
        </section>
    );
}

export { StatsSection };
