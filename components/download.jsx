'use client';
import { IconPlay, IconChevronRight } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from './ui/Reveal';
import { EVENT } from '../lib/event-config';

// EASYCHECK — Final CTA (다운로드 유도) · 마지막 섹션
// 브랜드 컬러 패널 안에 헤드라인 + Google Play 버튼. 컴팩트.

function DownloadCTA() {
    const { t } = useLanguage();

    // 출시 전에는 Play 대신 사전예약 이벤트로 보낸다
    const prereg = EVENT.PHASE === 'prereg';
    const ctaLabel = prereg ? t('hero.preregButton') : t('hero.downloadButton');

    return (
        <section
            id="download"
            className="bg-white"
            aria-labelledby="download-headline"
            data-screen-label="Download"
        >
            <div className="mx-auto max-w-8xl px-6 lg:px-20 pb-20 lg:pb-[120px]">
                <Reveal y={16}>
                    <div
                        className="
              relative overflow-hidden
              bg-brand-deep rounded-2xl shadow-lg
              px-7 py-12 lg:px-16 lg:py-16
              flex flex-col items-center text-center
            "
                    >
                        <h2
                            id="download-headline"
                            className="text-[26px] md:text-[32px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.025em] text-white"
                            style={{ wordBreak: 'keep-all' }}
                        >
                            {t('download.title')}
                        </h2>

                        <p
                            className="mt-4 text-[15px] lg:text-[18px] leading-[1.6] text-white/85 max-w-[34em]"
                            style={{ wordBreak: 'keep-all' }}
                        >
                            {t('download.description')}
                        </p>

                        {/* 사전예약(출시 전) / Google Play(출시 후) 버튼 */}
                        <a
                            href={prereg ? '/event' : EVENT.PLAY_STORE_URL}
                            aria-label={ctaLabel}
                            className="
                mt-9 inline-flex items-center justify-center gap-2.5
                w-full max-w-[360px] lg:w-auto
                bg-white text-text-primary font-semibold text-[16px] lg:text-[17px]
                px-7 py-4 lg:px-8 lg:py-[18px]
                rounded-lg shadow-md
                hover:-translate-y-px hover:shadow-lg
                transition-all duration-200 focus-ring
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

                        <p className="mt-4 text-[13px] lg:text-[14px] text-white/90">
                            {prereg ? t('hero.preregCaption') : t('hero.caption')}
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

export { DownloadCTA };
