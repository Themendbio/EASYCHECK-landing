'use client';
import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from './ui/Reveal';
import { KoreaHeatMap } from './ui/KoreaHeatMap';

// Section — 지역별 폭염지수: 시·도 코로플레스 지도
function HeatmapSection() {
    const { t, locale } = useLanguage();

    return (
        <section
            id="heatmap"
            data-screen-label="03 지역별 폭염지수"
            aria-label="지역별 폭염지수 지도"
            className="relative z-10 px-6 lg:px-20 py-24 md:py-32"
        >
            <div className="mx-auto max-w-7xl rounded-3xl bg-white/85 backdrop-blur-sm shadow-xl ring-1 ring-white/60 px-6 py-10 md:px-12 md:py-14">
                <div className="text-left mb-10 md:mb-14">
                    <Reveal
                        as="h2"
                        delay={0}
                        className="text-[34px] md:text-[40px] lg:text-[52px] font-bold leading-tight text-text-primary mb-4"
                        style={{ letterSpacing: locale === 'en' ? '-0.01em' : '-0.02em' }}
                    >
                        {t('heatmap.title')}
                    </Reveal>
                    <Reveal
                        as="p"
                        delay={100}
                        className="text-[15px] lg:text-[17px] leading-[1.6] text-text-secondary max-w-2xl"
                    >
                        {t('heatmap.description')}
                    </Reveal>
                </div>

                <Reveal delay={200}>
                    <KoreaHeatMap t={t} locale={locale} />
                </Reveal>
            </div>
        </section>
    );
}

export { HeatmapSection };
