'use client';
import React from 'react';
import { IconChevronRight, IconBellRing } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { Reveal } from './ui/Reveal';

// Easycheck — Section 3 "Solution"
// 3 STEP 영상 가로 흐름 + highlight box

/* ─── 세로형 STEP 영상 (흰/블루 배경 영상을 둥근 패널로) ─── */
function StepVideo({ src }) {
  return (
    <div className="mx-auto w-full max-w-[300px] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/[0.06]">
      <video
        className="block w-full aspect-[4/5] object-cover bg-white"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

/* ─── STEP 텍스트 (번호 배지 + 라벨 + 제목 + 본문) ─── */
function StepText({ step }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3 mb-4">
        <span
          aria-hidden="true"
          className="
            inline-flex items-center justify-center
            w-8 h-8 rounded-full
            bg-brand-primary-soft text-brand-primary
            text-[14px] font-bold
          "
        >
          {step.n}
        </span>
        <span className="text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.08em] text-brand-primary">
          STEP {step.n}
        </span>
      </div>
      <h3 className="text-[22px] lg:text-[26px] font-semibold leading-[1.35] tracking-[-0.02em] text-text-primary mb-3">
        {step.title}
      </h3>
      <p
        className="text-[15px] lg:text-[17px] leading-[1.6] text-text-secondary max-w-[28ch]"
        style={{ wordBreak: 'keep-all' }}
      >
        {step.body}
      </p>
    </div>
  );
}

/* ─── 데스크탑 흐름 화살표 (폰 사이) ─── */
function FlowArrow() {
  return (
    <div className="self-center text-text-tertiary" aria-hidden="true">
      <IconChevronRight size={28} strokeWidth={1.8} />
    </div>
  );
}

/* ─── Pulse dot (respects prefers-reduced-motion) ─── */
function PulseDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute rounded-full"
      style={{
        width: 12, height: 12,
        top: 6, right: 6,
        background: '#F39800',
        boxShadow: '0 0 0 0 rgba(243,152,0,0.6)',
        animation: 'pulseAccent 2s ease-in-out infinite',
      }}
    />
  );
}

/* ─── Highlight box ─── */
function HighlightBox() {
  const { t } = useLanguage();

  return (
    <Reveal
      delay={0}
      y={0}
      duration={700}
      className="
        relative overflow-hidden
        bg-brand-deep text-white
        rounded-2xl shadow-lg
        px-8 py-10 lg:px-20 lg:py-16
        mt-20 lg:mt-20
      "
      style={{
        // initial scale handled via inline override since Reveal default uses y-only
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
        {/* Left text */}
        <div className="lg:col-span-3">
          <span
            className="block text-[13px] lg:text-[14px] font-semibold uppercase tracking-[0.08em] mb-4"
            style={{ color: '#00AEEB' }}
          >
            {t('solution.highlight.badge')}
          </span>
          <h3
            className="text-[32px] lg:text-[48px] font-bold leading-[1.2] tracking-[-0.025em] text-white mb-4"
            style={{ wordBreak: 'keep-all' }}
          >
            {t('solution.highlight.title')}
          </h3>
          <p
            className="text-[17px] lg:text-[19px] leading-[1.6]"
            style={{ color: 'rgba(255,255,255,0.85)', wordBreak: 'keep-all' }}
          >
            {t('solution.highlight.description')}
          </p>
        </div>

        {/* Right visual (desktop only) */}
        <div className="hidden lg:flex lg:col-span-2 justify-center">
          <div className="relative" style={{ width: 200, height: 200 }}>
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <IconBellRing size={80} strokeWidth={1.6} />
            </div>
            <PulseDot />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Mobile connector (아래 화살표) ─── */
function MobileConnector() {
  return (
    <div className="lg:hidden flex justify-center py-6 text-text-tertiary" aria-hidden="true">
      <IconChevronRight size={24} strokeWidth={1.8} className="rotate-90" />
    </div>
  );
}

/* ─── Section ─── */
function SolutionSection() {
  const { t } = useLanguage();

  const steps = [
    {
      n: 1,
      title: t('solution.steps.step1.title'),
      body: t('solution.steps.step1.body'),
      video: '/video/usage-step1-connect.mp4',
    },
    {
      n: 2,
      title: t('solution.steps.step2.title'),
      body: t('solution.steps.step2.body'),
      video: '/video/usage-step2-measure.mp4',
    },
    {
      n: 3,
      title: t('solution.steps.step3.title'),
      body: t('solution.steps.step3.body'),
      video: '/video/usage-step3-result.mp4',
    },
  ];

  return (
    <section
      id="solution"
      className="bg-white"
      aria-labelledby="solution-headline"
      data-screen-label="Solution"
    >
      <div className="mx-auto max-w-8xl px-6 lg:px-20 py-20 lg:py-[120px]">
        {/* Header */}
        <Reveal y={16} className="flex flex-col items-start text-left">
          <h2
            id="solution-headline"
            className="text-[34px] md:text-[40px] lg:text-[52px] font-bold leading-[1.15] tracking-[-0.025em] text-text-primary mb-6"
            style={{ wordBreak: 'keep-all' }}
          >
            {t('solution.title')}
          </h2>

          <p
            className="text-[17px] lg:text-[19px] leading-[1.6] text-text-secondary max-w-[40em] mb-16 lg:mb-20"
            style={{ wordBreak: 'keep-all' }}
          >
            {t('solution.description')}
          </p>
        </Reveal>

        {/* STEP — lg 이상: 영상 3단 가로 흐름 / lg 미만: 세로 스택 */}
        <div className="relative">
          {/* Desktop flow: 영상 행 + 텍스트 행 (화살표로 연결) */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-8 xl:gap-x-12 gap-y-8">
            {/* row 1 — STEP 영상 + 화살표 */}
            <Reveal delay={0}><StepVideo src={steps[0].video} /></Reveal>
            <FlowArrow />
            <Reveal delay={120}><StepVideo src={steps[1].video} /></Reveal>
            <FlowArrow />
            <Reveal delay={240}><StepVideo src={steps[2].video} /></Reveal>

            {/* row 2 — 텍스트 (화살표 칸은 빈 셀) */}
            <Reveal delay={80}><StepText step={steps[0]} /></Reveal>
            <span aria-hidden="true" />
            <Reveal delay={200}><StepText step={steps[1]} /></Reveal>
            <span aria-hidden="true" />
            <Reveal delay={320}><StepText step={steps[2]} /></Reveal>
          </div>

          {/* Mobile stack w/ connectors */}
          <div className="lg:hidden flex flex-col items-center">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <Reveal delay={i * 120} className="w-full flex flex-col items-center gap-6">
                  <StepVideo src={s.video} />
                  <StepText step={s} />
                </Reveal>
                {i < steps.length - 1 && <MobileConnector />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Highlight box */}
        <HighlightBox />
      </div>

      {/* keyframes for pulse */}
      <style>{`
        @keyframes pulseAccent {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%      { transform: scale(1.25); opacity: 0.6; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pulseAccent"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}


export { SolutionSection };
