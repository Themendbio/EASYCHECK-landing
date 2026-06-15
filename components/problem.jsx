'use client';
import React from 'react';
import {
    IconChevronRight,
    IconHardHat,
    IconSun,
    IconUsers,
    IconHeart,
    IconTarget,
    IconBuilding2,
} from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from './ui/Reveal';

// Easycheck — Section 2 "Problem / Personas"
// React component using design-system tokens.
// Entry animations: IntersectionObserver-driven, fade + slide-up.
// Carousel — desktop(lg+): prev/next buttons. mobile(<lg): native horizontal swipe (scroll-snap).

const { useEffect, useRef, useState } = React;

/* ─── small helpers ─── */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ─── Persona card — 모바일 가로 스와이프 트랙용 카드 ─── */
function PersonaCard({ persona }) {
    const { ImageIcon, LabelIcon, image, imageCaption, label, title, body, quote } = persona;

    return (
        <article
            className="
        snap-center shrink-0 w-[84%] sm:w-[64%]
        flex flex-col bg-white border border-border rounded-xl shadow-sm overflow-hidden
      "
        >
            {/* A. Image — 4:3, full card width */}
            {image ? (
                <img
                    src={image}
                    alt={imageCaption}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                />
            ) : (
                <div
                    className="ph-stripes w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 text-text-tertiary"
                    role="img"
                    aria-label={imageCaption}
                >
                    <ImageIcon size={32} strokeWidth={1.6} aria-hidden="true" />
                    <span className="text-[12px] font-medium tracking-normal">{imageCaption}</span>
                </div>
            )}

            {/* Body */}
            <div className="flex flex-col p-6">
                <div className="flex items-center gap-1.5">
                    <LabelIcon
                        size={16}
                        className="text-brand-primary shrink-0"
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-primary">
                        {label}
                    </span>
                </div>
                <h3 className="mt-2 text-[20px] font-semibold leading-[1.4] tracking-[-0.02em] text-text-primary">
                    {title}
                </h3>
                <p
                    className="mt-4 text-[15px] leading-[1.6] text-text-secondary"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {body}
                </p>
                <blockquote
                    className="mt-6 pl-4 text-[14px] leading-[1.6] italic text-text-tertiary"
                    style={{ borderLeft: '4px solid rgba(0,104,183,0.5)', wordBreak: 'keep-all' }}
                >
                    {quote}
                </blockquote>
            </div>
        </article>
    );
}

/* ─── 모바일/태블릿(<lg): 가로 스와이프 캐러셀 ─── */
function PersonaSwipe({ personas }) {
    const { t } = useLanguage();

    return (
        <section
            className="lg:hidden bg-bg-subtle"
            aria-labelledby="problem-headline-m"
            data-screen-label="Problem"
        >
            <div className="mx-auto max-w-8xl px-6 py-20">
                <Reveal y={16} className="js-hdr vary-left flex flex-col items-start text-left">
                    <h2
                        id="problem-headline-m"
                        className="text-[34px] md:text-[40px] lg:text-[52px] font-bold leading-[1.15] tracking-[-0.025em] text-text-primary mb-6"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        {t('problem.title')}
                    </h2>
                    <p
                        className="text-[17px] leading-[1.6] text-text-secondary max-w-[36em] mb-12"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        {t('problem.description')}
                    </p>
                </Reveal>

                {/* 가로 스와이프 트랙 — 네이티브 터치 스크롤 + 스냅 */}
                <div
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-2 scroll-smooth"
                    style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                    role="group"
                    aria-label="대상 사용자 목록 — 좌우로 스와이프하여 살펴보세요"
                >
                    {personas.map((p) => (
                        <PersonaCard key={p.label} persona={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── 데스크탑 페르소나 카드 (세로형 — 가로 스크롤 트랙 내부) ─── */
// Apple Health 스타일: 화면 너비보다 작은 카드 → 옆 카드가 살짝 걸쳐 보임(peek).
function PersonaCardLg({ persona, index, total }) {
    const { ImageIcon: Img, LabelIcon, image, imageCaption, label, title, body, quote } = persona;
    return (
        <article
            className="
        snap-start shrink-0 w-[clamp(380px,36vw,500px)]
        flex flex-col bg-white border border-border rounded-2xl shadow-sm overflow-hidden
      "
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${total} — ${label}`}
        >
            {/* 이미지 — 4:3 */}
            {image ? (
                <img
                    src={image}
                    alt={imageCaption}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                />
            ) : (
                <div
                    className="ph-stripes w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 text-text-tertiary"
                    role="img"
                    aria-label={imageCaption}
                >
                    <Img size={48} strokeWidth={1.4} aria-hidden="true" />
                    <span className="text-[13px] font-medium">{imageCaption}</span>
                </div>
            )}

            {/* 본문 */}
            <div className="flex flex-col flex-1 p-7 xl:p-8">
                {/* 인덱스 + 라벨 */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[13px] font-mono font-semibold text-text-disabled tracking-wider">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="block h-px w-7 bg-border-strong" aria-hidden="true" />
                    <div className="flex items-center gap-1.5">
                        <LabelIcon
                            size={16}
                            className="text-brand-primary shrink-0"
                            strokeWidth={2.2}
                            aria-hidden="true"
                        />
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-primary">
                            {label}
                        </span>
                    </div>
                </div>

                {/* 타이틀 */}
                <h3
                    className="text-[24px] xl:text-[26px] font-bold leading-[1.3] tracking-[-0.02em] text-text-primary mb-4"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {title}
                </h3>

                {/* 본문 */}
                <p
                    className="text-[16px] leading-[1.65] text-text-secondary mb-6"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {body}
                </p>

                {/* 인용 — 카드 하단 고정 */}
                <blockquote
                    className="mt-auto pl-4 text-[15px] leading-[1.6] italic text-text-tertiary"
                    style={{ borderLeft: '4px solid rgba(0,104,183,0.5)', wordBreak: 'keep-all' }}
                >
                    {quote}
                </blockquote>
            </div>
        </article>
    );
}

/* ─── 데스크탑(lg+): 버튼 제어 가로 스크롤 캐러셀 ─── */
// Apple Health 스타일 — 작은 세로 카드들이 가로로 스냅 스크롤. 옆 카드 peek.
function PersonaCarousel({ personas }) {
    const { t } = useLanguage();
    const N = personas.length;
    const trackRef = useRef(null);
    const [active, setActive] = useState(0);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    // 스크롤 위치로 활성 카드 + 양끝 도달 여부 계산
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        let raf = 0;
        const measure = () => {
            raf = 0;
            const cards = el.children;
            if (!cards.length) return;
            // 카드는 snap-start + scroll-padding-left 기준으로 정렬되므로
            // 좌측 패딩만큼 들어온 스냅 기준선에 가장 가까운 카드가 활성 카드다.
            const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
            const snapLine = el.scrollLeft + padLeft;
            let best = 0;
            let bestDist = Infinity;
            for (let i = 0; i < cards.length; i++) {
                const cStart = cards[i].offsetLeft - el.offsetLeft;
                const d = Math.abs(cStart - snapLine);
                if (d < bestDist) {
                    bestDist = d;
                    best = i;
                }
            }
            setActive(best);
            setAtStart(el.scrollLeft <= 2);
            setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
        };
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(measure);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        measure();
        window.addEventListener('resize', measure);
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', measure);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [N]);

    const scrollToCard = (i) => {
        const el = trackRef.current;
        if (!el) return;
        const idx = clamp(i, 0, N - 1);
        const card = el.children[idx];
        if (!card) return;
        // scroll-padding-left만큼 빼야 카드가 스냅 시작선에 정확히 정렬된다.
        const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        el.scrollTo({ left: card.offsetLeft - el.offsetLeft - padLeft, behavior: 'smooth' });
    };

    const prev = () => scrollToCard(active - 1);
    const next = () => scrollToCard(active + 1);

    // 키보드 ←/→ 지원 (섹션 내부에 포커스가 있을 때)
    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            next();
        }
    };

    const ArrowBtn = ({ dir, onClick, disabled, label }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="
        focus-ring grid place-items-center rounded-full bg-white border border-border
        text-text-primary shadow-sm transition-all duration-200 ease-out
        hover:border-brand-primary hover:text-brand-primary hover:shadow-md
        disabled:opacity-35 disabled:pointer-events-none
      "
            style={{ width: '52px', height: '52px' }}
        >
            <IconChevronRight
                size={22}
                strokeWidth={2.2}
                aria-hidden="true"
                style={{ transform: dir === 'prev' ? 'rotate(180deg)' : 'none' }}
            />
        </button>
    );

    return (
        <section
            id="problem"
            className="hidden lg:block bg-bg-subtle"
            aria-labelledby="problem-headline"
            data-screen-label="Problem"
            onKeyDown={onKeyDown}
        >
            <div className="py-24 xl:py-28">
                {/* ─── 헤더 ─── */}
                <div className="mx-auto max-w-8xl px-20">
                    <Reveal className="js-hdr vary-left text-left mb-14 xl:mb-16">
                        <h2
                            id="problem-headline"
                            className="text-[40px] lg:text-[52px] font-bold leading-[1.15] tracking-[-0.025em] text-text-primary"
                            style={{ wordBreak: 'keep-all' }}
                        >
                            {t('problem.title')}
                        </h2>
                        <p
                            className="mt-4 text-[17px] xl:text-[19px] leading-[1.6] text-text-secondary max-w-[40em]"
                            style={{ wordBreak: 'keep-all' }}
                        >
                            {t('problem.description')}
                        </p>
                    </Reveal>
                </div>

                {/* ─── 가로 스크롤 트랙 — 작은 카드들, 옆 카드 peek ─── */}
                {/* 좌우 px-20 패딩이 첫/마지막 카드의 스냅 정렬 기준이 됨 */}
                <Reveal y={28} delay={80}>
                    <div
                        ref={trackRef}
                        className="flex gap-6 xl:gap-7 overflow-x-auto snap-x snap-mandatory px-20 pb-3 scroll-smooth"
                        style={{
                            scrollbarWidth: 'none',
                            WebkitOverflowScrolling: 'touch',
                            scrollPaddingLeft: '5rem',
                        }}
                        role="group"
                        aria-label="대상 사용자 목록 — 좌우로 스크롤하여 살펴보세요"
                    >
                        {personas.map((p, i) => (
                            <PersonaCardLg key={p.label} persona={p} index={i} total={N} />
                        ))}
                    </div>
                </Reveal>

                {/* ─── 컨트롤: 이전·다음 버튼 ─── */}
                <div className="mx-auto max-w-8xl px-20">
                    <div className="mt-12 flex items-center justify-end gap-3">
                        <ArrowBtn dir="prev" onClick={prev} disabled={atStart} label={t('problem.controls.prev')} />
                        <ArrowBtn dir="next" onClick={next} disabled={atEnd} label={t('problem.controls.next')} />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Section ─── */
function ProblemSection() {
    const { t, locale } = useLanguage();

    // 로케일별 이미지 경로 — en 버전이 없는 경우 hasEn=false로 두면 placeholder가 렌더됨
    const localeImage = (base, hasEn = true) =>
        locale === 'en' && !hasEn ? null : `/images/persona-${base}-${locale}.png`;

    const personas = [
        {
            ImageIcon: IconHeart,
            LabelIcon: IconHeart,
            image: localeImage('athlete'),
            imageCaption: t('problem.personas.athlete.label'),
            label: t('problem.personas.athlete.label'),
            title: t('problem.personas.athlete.title'),
            body: t('problem.personas.athlete.body'),
            quote: t('problem.personas.athlete.quote'),
        },
        {
            ImageIcon: IconTarget,
            LabelIcon: IconTarget,
            image: localeImage('dieter'),
            imageCaption: t('problem.personas.dieter.label'),
            label: t('problem.personas.dieter.label'),
            title: t('problem.personas.dieter.title'),
            body: t('problem.personas.dieter.body'),
            quote: t('problem.personas.dieter.quote'),
        },
        {
            ImageIcon: IconHardHat,
            LabelIcon: IconSun,
            image: localeImage('outdoor'),
            imageCaption: t('problem.personas.outdoor.label'),
            label: t('problem.personas.outdoor.label'),
            title: t('problem.personas.outdoor.title'),
            body: t('problem.personas.outdoor.body'),
            quote: t('problem.personas.outdoor.quote'),
        },
        {
            ImageIcon: IconHeart,
            LabelIcon: IconUsers,
            image: localeImage('elderly'),
            imageCaption: t('problem.personas.elderly.label'),
            label: t('problem.personas.elderly.label'),
            title: t('problem.personas.elderly.title'),
            body: t('problem.personas.elderly.body'),
            quote: t('problem.personas.elderly.quote'),
        },
        {
            ImageIcon: IconBuilding2,
            LabelIcon: IconBuilding2,
            image: localeImage('office', false),
            imageCaption: t('problem.personas.office.label'),
            label: t('problem.personas.office.label'),
            title: t('problem.personas.office.title'),
            body: t('problem.personas.office.body'),
            quote: t('problem.personas.office.quote'),
        },
    ];

    return (
        <>
            {/* ─── lg 미만: 가로 스와이프 캐러셀 ─── */}
            <PersonaSwipe personas={personas} />

            {/* ─── lg 이상: 버튼 제어 캐러셀 ─── */}
            <PersonaCarousel personas={personas} />
        </>
    );
}

export { ProblemSection };
