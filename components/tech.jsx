'use client';
import { useEffect, useRef, useState } from 'react';
import { IconTarget, IconBuilding2, IconWatch, IconBellRing } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useInView } from '../hooks/useInView';
import { Reveal } from './ui/Reveal';

// Section 5 — Tech / Differentiation
// Header → Stats strip → 2×2 cards

// 카운팅 애니메이션 훅
function useCountUp(end, duration = 1000, inView) {
    const [count, setCount] = useState(0);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!inView || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // easeOutExpo 곡선
            const easeOut = 1 - Math.pow(2, -10 * percentage);
            const current = easeOut * end;

            setCount(current);

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, inView]);

    return count;
}

function StatItem({ value, label, caption, inView }) {
    // 값에서 숫자와 접미사(%, 건+, 명 등) 분리
    const numMatch = value.match(/[\d.]+/);
    const num = numMatch ? parseFloat(numMatch[0]) : 0;
    const suffix = value.replace(/[\d.]+/, '').trim();

    const count = useCountUp(num, 1000, inView);

    const hasDecimal = value.includes('.');
    const displayValue = hasDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();

    return (
        <div className="flex flex-col items-center text-center px-4 py-2">
            <span
                className="font-bold leading-[1.05] text-brand-primary text-[36px] md:text-[48px] lg:text-[56px]"
                style={{
                    letterSpacing: '-0.03em',
                }}
            >
                {displayValue}
                {suffix}
            </span>
            <span className="mt-4 text-[15px] lg:text-[16px] font-semibold text-text-primary">
                {label}
            </span>
            <span className="mt-1.5 text-[13px] lg:text-[14px] text-text-secondary">{caption}</span>
        </div>
    );
}

function TechCard({ card, delay }) {
    const isHL = card.isHighlight;
    return (
        <Reveal
            as="article"
            delay={delay}
            className={`
        flex flex-col rounded-xl border border-border shadow-sm
        p-7 lg:p-8
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-md
        ${isHL ? 'bg-brand-primary-soft' : 'bg-white'}
      `}
        >
            {/* 아이콘 + pill 라벨 */}
            <div className="flex items-center justify-between gap-3">
                <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center rounded-full shrink-0"
                    style={{
                        width: 56,
                        height: 56,
                        background: isHL ? 'rgba(0,104,183,0.12)' : '#E6F0F9',
                        color: '#0068B7',
                    }}
                >
                    <card.Icon size={32} strokeWidth={1.8} />
                </span>

                {card.pill ? (
                    <span
                        className={`
              inline-flex items-center shrink-0
              text-[12px] lg:text-[13px] font-semibold tracking-[-0.01em]
              px-3 py-1.5 rounded-full whitespace-nowrap
              ${
                  isHL
                      ? 'bg-brand-primary text-white'
                      : 'bg-white text-text-secondary border border-border'
              }
            `}
                    >
                        {card.pill}
                    </span>
                ) : null}
            </div>

            {/* 제목 */}
            <h3
                className="mt-6 text-[24px] lg:text-[36px] font-bold leading-[1.3] tracking-[-0.025em] text-text-primary"
                style={{ wordBreak: 'keep-all' }}
            >
                {card.title}
            </h3>

            {/* 본문 */}
            <p
                className="mt-3 text-[15px] lg:text-[17px] leading-[1.6] text-text-secondary"
                style={{ wordBreak: 'keep-all' }}
            >
                {card.body}
            </p>
        </Reveal>
    );
}

function TechSection() {
    const { t } = useLanguage();
    const [statsRef, statsInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -100px 0px' });

    const stats = [
        {
            value: t('tech.stats.accuracy.value'),
            label: t('tech.stats.accuracy.label'),
            caption: t('tech.stats.accuracy.caption'),
        },
        {
            value: t('tech.stats.data.value'),
            label: t('tech.stats.data.label'),
            caption: t('tech.stats.data.caption'),
        },
        {
            value: t('tech.stats.severance.value'),
            label: t('tech.stats.severance.label'),
            caption: t('tech.stats.severance.caption'),
        },
        {
            value: t('tech.stats.participants.value'),
            label: t('tech.stats.participants.label'),
            caption: t('tech.stats.participants.caption'),
        },
    ];

    const cards = [
        {
            isHighlight: true,
            pill: t('tech.cards.ai.pill'),
            Icon: IconTarget,
            title: t('tech.cards.ai.title'),
            body: t('tech.cards.ai.body'),
        },
        {
            pill: t('tech.cards.severance.pill'),
            Icon: IconBuilding2,
            title: t('tech.cards.severance.title'),
            body: t('tech.cards.severance.body'),
        },
        {
            pill: t('tech.cards.watch.pill'),
            Icon: IconWatch,
            title: t('tech.cards.watch.title'),
            body: t('tech.cards.watch.body'),
        },
        {
            pill: t('tech.cards.alert.pill'),
            Icon: IconBellRing,
            title: t('tech.cards.alert.title'),
            body: t('tech.cards.alert.body'),
        },
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

                {/* Stats strip */}
                <Reveal delay={100} y={16}>
                    <dl
                        className="
              bg-bg-subtle rounded-xl
              px-6 py-10 lg:px-12 lg:py-12
              grid grid-cols-2 lg:grid-cols-4
              gap-y-8 lg:gap-y-0
              mb-16 lg:mb-20
            "
                        ref={statsRef}
                        aria-label="연구 지표"
                    >
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className={`
                  ${i > 0 ? 'lg:border-l lg:border-border' : ''}
                `}
                            >
                                <dt className="sr-only">{s.label}</dt>
                                <dd className="m-0">
                                    <StatItem {...s} inView={statsInView} />
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>

                {/* 2×2 cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {cards.map((c, i) => (
                        <TechCard key={c.title} card={c} delay={200 + i * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export { TechSection };
