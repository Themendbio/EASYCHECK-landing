'use client';
import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { Reveal } from './Reveal';

const data = [
    { year: 2019, temp: 24.1 },
    { year: 2020, temp: 23.6 },
    { year: 2021, temp: 24.7 },
    { year: 2022, temp: 24.5 },
    { year: 2023, temp: 24.9 },
    { year: 2024, temp: 25.6 },
    { year: 2025, temp: 25.8 },
    { year: 2026, temp: 26.4 },
];

// 연도별 여름 평균기온 라인 차트. 모바일/데스크톱 반응형 + 스크롤 진입 애니메이션.
export function TemperatureChart({ t, locale }) {
    const [chartRef, chartInView] = useInView(
        { threshold: 0.2, rootMargin: '0px 0px -100px 0px' },
        [locale],
    );
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 모바일과 데스크톱에서 다른 차트 설정
    const W = isMobile ? 600 : 1280;
    const H = isMobile ? 400 : 500;
    const P = isMobile
        ? { l: 50, r: 50, t: 40, b: 60 } // 모바일: 좌우 균등
        : { l: 80, r: 520, t: 60, b: 80 }; // 데스크톱: 우측 텍스트 공간
    const plotW = W - P.l - P.r;
    const plotH = H - P.t - P.b;
    const tMin = 22,
        tMax = 27;
    const yTicks = [24, 25, 26, 27];

    const x = (i) => P.l + (i / (data.length - 1)) * plotW;
    const y = (temp) => P.t + (1 - (temp - tMin) / (tMax - tMin)) * plotH;

    const pts = data.map((d, i) => ({ ...d, cx: x(i), cy: y(d.temp) }));
    const last = pts[pts.length - 1];

    const baseline = H - P.b;
    const spacing = plotW / (data.length - 1);
    const barW = spacing * 0.34;

    const linePath = pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx.toFixed(2)} ${p.cy.toFixed(2)}`)
        .join(' ');

    return (
        <>
            <svg
                ref={chartRef}
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="2019년부터 2026년까지 여름 평균기온 추이 — 2026년이 26.4도로 최고"
                className={`w-full h-auto ${chartInView ? 'chart-visible' : ''}`}
            >
                <defs>
                    <linearGradient id="blBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0068B7" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#0068B7" stopOpacity="0.06" />
                    </linearGradient>
                    <linearGradient id="blPeak" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F39800" />
                        <stop offset="100%" stopColor="#F39800" stopOpacity="0.18" />
                    </linearGradient>
                    <filter id="blGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="5" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 우측 텍스트 박스 (데스크톱만) */}
                {!isMobile && (
                    <foreignObject x={W - P.r + 44} y={P.t} width={P.r - 60} height={plotH}>
                        <div
                            xmlns="http://www.w3.org/1999/xhtml"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'center',
                                fontFamily:
                                    "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                            }}
                        >
                            {/* 큰 온도 숫자 (Tech 섹션 스타일) */}
                            <div
                                className="chart-axis-label"
                                style={{
                                    fontSize: 72,
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    color: '#F39800',
                                    margin: 0,
                                    marginBottom: 16,
                                    letterSpacing: '-0.03em',
                                    animationDelay: '1s',
                                }}
                            >
                                {t('stats.chart.temp')}
                            </div>

                            {/* 메인 헤드라인 */}
                            <h3
                                className="chart-axis-label"
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    color: '#1F2937',
                                    margin: 0,
                                    marginBottom: 12,
                                    letterSpacing: '-0.02em',
                                    animationDelay: '1.05s',
                                }}
                            >
                                {t('stats.chart.headline')}
                            </h3>

                            {/* 온도 정보 */}
                            <p
                                className="chart-axis-label"
                                style={{
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                    color: '#6B7280',
                                    margin: 0,
                                    marginBottom: 16,
                                    letterSpacing: '-0.01em',
                                    animationDelay: '1.1s',
                                }}
                            >
                                {t('stats.chart.comparison')}{' '}
                                <strong style={{ color: '#F39800', fontWeight: 700 }}>
                                    {t('stats.chart.comparisonValue')}
                                </strong>
                            </p>

                            {/* 추가 메시지 */}
                            <div
                                className="chart-axis-label"
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: '#9CA3AF',
                                    lineHeight: 1.5,
                                    letterSpacing: '-0.01em',
                                    animationDelay: '1.15s',
                                }}
                            >
                                {t('stats.chart.message')}
                            </div>
                        </div>
                    </foreignObject>
                )}

                {/* 가로 격자선 + Y축 라벨 */}
                {yTicks.map((tick, i) => (
                    <g
                        key={tick}
                        className="chart-axis-label"
                        style={{ animationDelay: `${0.2 + i * 0.03}s` }}
                    >
                        <line
                            x1={P.l}
                            x2={W - P.r}
                            y1={y(tick)}
                            y2={y(tick)}
                            stroke="#E5E9EF"
                            strokeWidth="1"
                        />
                        <text
                            x={P.l - (isMobile ? 10 : 16)}
                            y={y(tick)}
                            textAnchor="end"
                            dominantBaseline="central"
                            fontSize={isMobile ? '12' : '16'}
                            fill="#9CA3AF"
                            fontFamily="Pretendard Variable, Pretendard, sans-serif"
                            style={{ letterSpacing: '-0.01em' }}
                        >
                            {tick}°
                        </text>
                    </g>
                ))}

                {/* 막대 */}
                {pts.map((p, i) => {
                    const isLast = i === pts.length - 1;
                    return (
                        <rect
                            key={p.year}
                            x={p.cx - barW / 2}
                            y={p.cy}
                            width={barW}
                            height={baseline - p.cy}
                            rx={isMobile ? 5 : 7}
                            fill={isLast ? 'url(#blPeak)' : 'url(#blBar)'}
                            filter={isLast ? 'url(#blGlow)' : undefined}
                            className="chart-bar"
                            style={{
                                transformOrigin: `${p.cx}px ${baseline}px`,
                                animationDelay: `${0.1 + i * 0.06}s`,
                            }}
                        />
                    );
                })}

                {/* 라인 */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#003685"
                    strokeWidth={isMobile ? '2.5' : '3'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="1"
                    className="chart-line"
                    style={{ animationDelay: '0.65s' }}
                />

                {/* X축 라벨 */}
                {pts.map((p, i) => (
                    <text
                        key={p.year}
                        x={p.cx}
                        y={H - P.b + (isMobile ? 22 : 28)}
                        textAnchor="middle"
                        fontSize={isMobile ? '12' : '16'}
                        fill={i === pts.length - 1 ? '#F39800' : '#9CA3AF'}
                        fontWeight={i === pts.length - 1 ? 700 : 400}
                        fontFamily="Pretendard Variable, Pretendard, sans-serif"
                        className="chart-axis-label"
                        style={{
                            letterSpacing: '-0.01em',
                            animationDelay: `${0.3 + i * 0.04}s`,
                        }}
                    >
                        {p.year}
                    </text>
                ))}

                {/* 데이터 포인트 */}
                {pts.slice(0, -1).map((p, i) => (
                    <circle
                        key={p.year}
                        cx={p.cx}
                        cy={p.cy}
                        r={isMobile ? '4' : '5'}
                        fill="#FFFFFF"
                        stroke="#003685"
                        strokeWidth={isMobile ? '2' : '2.5'}
                        className="chart-dot"
                        style={{ animationDelay: `${0.85 + i * 0.05}s` }}
                    />
                ))}

                {/* 고점 강조 (2026) */}
                <g>
                    {/* 강조 점 */}
                    <circle
                        cx={last.cx}
                        cy={last.cy}
                        r={isMobile ? '6' : '8'}
                        fill="#F39800"
                        stroke="#FFFFFF"
                        strokeWidth={isMobile ? '2' : '2.5'}
                        className="chart-dot"
                        style={{ animationDelay: '1.25s' }}
                    />
                </g>
            </svg>

            {/* 모바일 텍스트 박스 (차트 아래) */}
            {isMobile && (
                <Reveal delay={200} className="mt-12 text-center px-4">
                    {/* 큰 온도 숫자 */}
                    <div
                        className="text-[56px] font-bold text-brand-accent mb-4"
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        {t('stats.chart.temp')}
                    </div>

                    {/* 메인 헤드라인 */}
                    <h3
                        className="text-[24px] md:text-[28px] font-bold text-text-primary mb-3"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        {t('stats.chart.headline')}
                    </h3>

                    {/* 온도 정보 */}
                    <p
                        className="text-[15px] text-text-secondary mb-4"
                        style={{ letterSpacing: '-0.01em' }}
                    >
                        {t('stats.chart.comparison')}{' '}
                        <strong className="text-brand-accent font-bold">
                            {t('stats.chart.comparisonValue')}
                        </strong>
                    </p>

                    {/* 추가 메시지 */}
                    <div className="text-[14px] font-semibold text-text-tertiary">
                        {t('stats.chart.message')}
                    </div>
                </Reveal>
            )}
        </>
    );
}
