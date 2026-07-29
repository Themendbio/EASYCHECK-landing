'use client';
import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { MAP_WIDTH, MAP_HEIGHT, PROVINCES } from './koreaProvinces';

// 기상청 폭염 영향예보 위험수준(ILVL 0~4) → 단계별 색상.
// 0 영향없음 · 1 관심 · 2 주의 · 3 경고 · 4 위험
const LEVELS = [
    { key: 'none', color: '#E5EAF0' },
    { key: 'interest', color: '#FCD980' },
    { key: 'caution', color: '#F4A23C' },
    { key: 'warning', color: '#E8602C' },
    { key: 'danger', color: '#B42318' },
];

const levelOf = (lv) => LEVELS[lv] ?? LEVELS[0];

// 활성(호버/선택) 지역 강조 색 — 팔레트와 어울리는 진한 웜레드.
const HILITE = '#7A1208';

// 작은 광역시는 라벨 클러스터가 겹쳐 별도 콜아웃으로 표시.
const SMALL_METROS = new Set(['11', '23', '25', '29', '24', '26']);

// 발표시각(YYYYMMDDHHmm) → "M월 D일 발표" / "issued M/D"
function fmtIssued(asOf, locale) {
    if (!asOf || asOf.length < 8) return '';
    const m = Number(asOf.slice(4, 6));
    const d = Number(asOf.slice(6, 8));
    return locale === 'en' ? `issued ${m}/${d}` : `${m}월 ${d}일 발표`;
}

export function KoreaHeatMap({ t, locale }) {
    const [ref, inView] = useInView({ threshold: 0.2, rootMargin: '0px 0px -80px 0px' }, [locale]);
    const [active, setActive] = useState(null);
    const [data, setData] = useState({ status: 'loading', levels: {}, active: false });

    useEffect(() => {
        let alive = true;
        fetch('/api/heatwave')
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((d) => alive && setData({ status: 'ok', ...d }))
            .catch(() => alive && setData({ status: 'error', levels: {}, active: false }));
        return () => {
            alive = false;
        };
    }, []);

    const levelAt = (code) => data.levels[code] ?? 0;

    // 가장 위험한 지역 (최고 레벨)
    const hottest = PROVINCES.reduce((a, b) => (levelAt(b.code) > levelAt(a.code) ? b : a));
    const sel = active ? PROVINCES.find((p) => p.code === active) : hottest;
    const hasAlert = data.status === 'ok' && data.active;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
            {/* 지도 (모바일은 상단 여백을 둬 좌상단 날짜와 겹치지 않게) */}
            <div ref={ref} className="relative mx-auto w-full max-w-[780px] pt-12 lg:pt-0">
                {/* 발표일 + 출처 (좌상단 구석) */}
                {data.status !== 'loading' && (
                    <div className="absolute top-0 left-0 z-10 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-text-tertiary">
                            <span className="relative flex w-2 h-2">
                                <span
                                    className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping"
                                    style={{ background: hasAlert ? '#E8602C' : '#9CA3AF' }}
                                />
                                <span
                                    className="relative inline-flex w-2 h-2 rounded-full"
                                    style={{ background: hasAlert ? '#E8602C' : '#9CA3AF' }}
                                />
                            </span>
                            {t('heatmap.live')}
                        </span>
                        {data.asOf && (
                            <span
                                className="text-[20px] md:text-[24px] font-extrabold text-text-primary leading-none"
                                style={{ letterSpacing: '-0.02em' }}
                            >
                                {fmtIssued(data.asOf, locale)}
                            </span>
                        )}
                    </div>
                )}
                <svg
                    viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={t('heatmap.ariaLabel')}
                    className="w-full h-auto overflow-visible"
                >
                    {PROVINCES.map((p, i) => {
                        const lvl = levelOf(levelAt(p.code));
                        const dim = active && active !== p.code;
                        return (
                            // 진입 애니메이션(stagger)은 그룹에서만 처리.
                            <g
                                key={p.code}
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'scale(1)' : 'scale(0.96)',
                                    transformOrigin: 'center',
                                    transformBox: 'fill-box',
                                    transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${0.04 * i}s, transform 500ms cubic-bezier(0.22,1,0.36,1) ${0.04 * i}s`,
                                }}
                            >
                                <path
                                    d={p.d}
                                    fill={lvl.color}
                                    stroke="#FFFFFF"
                                    strokeWidth={1}
                                    strokeLinejoin="round"
                                    onMouseEnter={() => setActive(p.code)}
                                    onMouseLeave={() => setActive(null)}
                                    onClick={() => setActive(active === p.code ? null : p.code)}
                                    style={{
                                        cursor: 'pointer',
                                        // 호버 디밍은 지연 없이 일괄·즉시 적용.
                                        opacity: dim ? 0.45 : 1,
                                        transition: 'opacity 120ms linear, fill 400ms ease',
                                    }}
                                />
                            </g>
                        );
                    })}

                    {/* 활성 지역 테두리를 맨 위에 다시 그려 일관되게 강조 */}
                    {active &&
                        (() => {
                            const p = PROVINCES.find((x) => x.code === active);
                            return (
                                <path
                                    d={p.d}
                                    fill="none"
                                    stroke={HILITE}
                                    strokeWidth={2.4}
                                    strokeLinejoin="round"
                                    style={{ pointerEvents: 'none' }}
                                />
                            );
                        })()}

                    {/* 큰 시·도 라벨: 약칭 (색으로 단계 표현) */}
                    {PROVINCES.filter((p) => !SMALL_METROS.has(p.code)).map((p) => {
                        const dark = levelAt(p.code) >= 3; // 경고 이상은 흰 글씨가 잘 보임
                        return (
                            <g
                                key={p.code}
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transition: 'opacity 400ms ease 0.5s',
                                    pointerEvents: 'none',
                                }}
                            >
                                <text
                                    x={p.cx}
                                    y={p.cy + 4}
                                    textAnchor="middle"
                                    fontSize="15"
                                    fontWeight="700"
                                    fill={dark ? '#FFFFFF' : '#374151'}
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    {locale === 'en' ? p.nameEng.replace(/-do|si$/, '') : p.short}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* 작은 광역시 콜아웃 (지도 우상단) */}
                <div className="absolute top-12 right-0 lg:top-0 flex flex-col gap-1.5">
                    {PROVINCES.filter((p) => SMALL_METROS.has(p.code)).map((p) => {
                        const lvl = levelOf(levelAt(p.code));
                        const isActive = active === p.code;
                        return (
                            <button
                                key={p.code}
                                type="button"
                                onMouseEnter={() => setActive(p.code)}
                                onMouseLeave={() => setActive(null)}
                                onClick={() => setActive(isActive ? null : p.code)}
                                className="flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-0.5 text-[11px] font-semibold transition"
                                style={{
                                    background: isActive ? HILITE : 'rgba(255,255,255,0.85)',
                                    color: isActive ? '#FFFFFF' : '#4B5563',
                                    boxShadow: '0 1px 4px rgba(15,23,42,0.10)',
                                }}
                            >
                                <span
                                    className="inline-block w-2.5 h-2.5 rounded-full"
                                    style={{ background: lvl.color }}
                                />
                                {locale === 'en' ? p.nameEng : p.short}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 우측 패널: 선택/최고 지역 카드 + 범례 */}
            <div className="w-full lg:w-[300px] flex flex-col gap-6">
                {/* 선택/최고 지역 카드 */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    {data.status === 'loading' ? (
                        <div className="h-[92px] animate-pulse rounded-lg bg-bg-muted" />
                    ) : !hasAlert ? (
                        <div className="py-2">
                            <div className="text-[18px] font-bold text-text-primary mb-1">
                                {t('heatmap.noAlertTitle')}
                            </div>
                            <p className="text-[14px] text-text-secondary leading-relaxed">
                                {t('heatmap.noAlertDesc')}
                            </p>
                        </div>
                    ) : (
                        (() => {
                            const lvl = levelOf(levelAt(sel.code));
                            return (
                                <>
                                    <div className="text-[13px] font-semibold text-text-tertiary mb-1">
                                        {active ? t('heatmap.selected') : t('heatmap.hottest')}
                                    </div>
                                    <div
                                        className="text-[22px] font-bold text-text-primary mb-3"
                                        style={{ letterSpacing: '-0.02em' }}
                                    >
                                        {locale === 'en' ? sel.nameEng : sel.name}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-[40px] font-extrabold leading-none"
                                            style={{ color: lvl.color, letterSpacing: '-0.03em' }}
                                        >
                                            {t(`heatmap.level.${lvl.key}`)}
                                        </span>
                                    </div>
                                </>
                            );
                        })()
                    )}
                </div>

                {/* 범례 */}
                <div>
                    <div className="text-[13px] font-semibold text-text-tertiary mb-3">
                        {t('heatmap.legendTitle')}
                    </div>
                    <div className="flex flex-col gap-2">
                        {[...LEVELS]
                            .slice(1)
                            .reverse()
                            .map((l) => (
                                <div key={l.key} className="flex items-center gap-2.5">
                                    <span
                                        className="inline-block w-5 h-5 rounded"
                                        style={{ background: l.color }}
                                    />
                                    <span className="text-[14px] text-text-secondary">
                                        {t(`heatmap.level.${l.key}`)}
                                    </span>
                                </div>
                            ))}
                    </div>
                    <p className="mt-4 whitespace-pre-line text-[12px] leading-relaxed text-text-disabled">
                        {t('heatmap.note')}
                    </p>
                </div>
            </div>
        </div>
    );
}
