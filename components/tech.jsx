'use client';
import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from './ui/Reveal';

// Section 5 — Tech / Differentiation
// Header → 연구 미디어(영상 + 플로팅 논문 표지) → 특허증

function TechSection() {
    const { t } = useLanguage();

    const patents = [
        '/images/patent-contactless-biosignal.webp',
        '/images/patent-watch-vascular.webp',
        '/images/patent-vascular-disease.webp',
    ];

    return (
        <section
            id="tech"
            className="bg-white"
            aria-labelledby="tech-headline"
            data-screen-label="Tech"
        >
            <div className="mx-auto max-w-8xl px-6 lg:px-20 py-20 lg:py-[120px]">
                {/* Header */}
                <Reveal y={16} className="js-hdr vary-left flex flex-col items-start text-left">
                    <h2
                        id="tech-headline"
                        className="text-[34px] md:text-[40px] lg:text-[52px] font-bold leading-[1.15] tracking-[-0.025em] text-text-primary mb-6"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        {t('tech.title')}
                    </h2>

                    <p
                        className="text-[17px] lg:text-[19px] leading-[1.6] text-text-secondary max-w-[40em] mb-16 lg:mb-20"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        {t('tech.description')}
                    </p>
                </Reveal>

                {/* 연구 미디어: 영상 + 플로팅 논문 표지(+캡션) */}
                <Reveal delay={100} y={16} className="mb-16 lg:mb-20">
                    <div className="relative mx-auto max-w-5xl">
                        {/* 영상 (모바일은 full, sm 이상에서 오른쪽 여유 공간 확보) */}
                        <div className="w-full sm:w-[84%] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/[0.06]">
                            <video
                                className="block w-full aspect-video object-cover bg-white"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                aria-hidden="true"
                            >
                                <source src="/video/tech-research.mp4" type="video/mp4" />
                            </video>
                        </div>

                        {/* 플로팅 논문 표지 + 하단 캡션 (모바일에서는 숨김, 하단 라인을 영상과 맞춤) */}
                        <div className="hidden sm:block absolute right-0 bottom-0 w-[26%]">
                            <img
                                src="/images/research-paper-cover.webp"
                                alt="CMPB 2025 논문 표지"
                                className="w-full rounded-lg shadow-2xl ring-1 ring-black/10"
                            />
                            <p
                                className="absolute top-full inset-x-0 mt-3 text-center text-[12px] lg:text-[13px] font-medium text-text-secondary"
                                style={{ wordBreak: 'keep-all' }}
                            >
                                SCIE 국제 학술지 게재 · CMPB 2025
                            </p>
                        </div>
                    </div>
                </Reveal>

                {/* 특허증 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                    {patents.map((src, i) => (
                        <Reveal key={src} delay={200 + i * 100} y={16}>
                            <img
                                src={src}
                                alt="특허증"
                                className="w-full rounded-lg shadow-md ring-1 ring-black/[0.06]"
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { TechSection };
