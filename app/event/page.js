'use client';
// 이벤트 목록 — 진행 중인 이벤트를 카드로 보여주고 상세 페이지로 연결한다.
import { useEffect } from 'react';
import Link from 'next/link';
import { EVENT } from '../../lib/event-config';
import { Reveal } from '../../components/ui/Reveal';
import { Footer } from '../../components/footer';

// 이벤트가 늘어나면 이 배열에만 추가하면 목록이 확장된다.
const EVENTS = [
    {
        slug: '/event/prereg',
        state: '진행중',
        period: '2026.8.19 ~ 출시 후 한 달',
        title: '사전예약 경품 이벤트',
        summary: '예약 후 출시된 앱에 가입하면 추첨 대상이 됩니다.',
        image: '/images/prize-watch.webp',
        imageAlt: '갤럭시 워치8',
        prizes: EVENT.PRIZES,
    },
];

export default function EventListPage() {
    useEffect(() => {
        document.title = 'EASYCHECK 이벤트';
    }, []);

    return (
        <main className="bg-bg-base">
            {/* 상단 브랜드 바 — 랜딩 내비게이션과 동일한 흰 배경/로고로 사이트 연속성 유지 */}
            <div className="border-b border-border bg-white">
                <div className="mx-auto flex h-14 max-w-[960px] items-center container-x lg:h-16">
                    <Link href="/" className="focus-ring rounded-md" aria-label="EASYCHECK 홈으로">
                        <img
                            src="/images/easycheck-logo.webp"
                            alt="EASYCHECK"
                            className="h-[22px] w-auto select-none lg:h-6"
                        />
                    </Link>
                </div>
            </div>

            {/* 목록 헤더 — 상세 페이지 히어로와 같은 딥 패널로 두 화면을 한 흐름으로 묶는다 */}
            <section className="bg-brand-deep">
                <div className="mx-auto max-w-[960px] container-x py-11 lg:py-16">
                    <h1
                        className="anim-up text-[32px] leading-[1.16] font-bold tracking-[-0.03em] text-white lg:text-[44px]"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        이벤트
                    </h1>
                </div>
            </section>

            <div className="mx-auto max-w-[960px] container-x py-12 lg:py-16">
                <ul className="space-y-6">
                    {EVENTS.map((e) => (
                        <Reveal as="li" y={16} key={e.slug}>
                            <Link
                                href={e.slug}
                                className="focus-ring group grid gap-5 rounded-2xl border border-border bg-white p-5 transition-colors duration-150 hover:border-border-strong lg:grid-cols-[260px_1fr] lg:gap-7 lg:p-6"
                            >
                                {/* 썸네일 — 흰 배경 제품 사진이라 카드와 같은 흰 타일에 담아 경계를 없앤다.
                                    바깥 24px · 패딩 20px 이므로 안쪽 반경은 작게(6px) 잡아 모서리를 동심원으로 맞춘다 */}
                                <div className="flex h-[150px] items-center justify-center rounded-sm border border-border bg-white p-4 lg:h-[170px]">
                                    <img
                                        src={e.image}
                                        alt={e.imageAlt}
                                        loading="lazy"
                                        className="h-full w-full object-contain text-[12px] text-text-tertiary"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                        <span className="inline-flex items-center rounded-md bg-success/10 px-2.5 py-1 text-[12px] font-bold text-success">
                                            {e.state}
                                        </span>
                                        <span className="text-[13px] font-medium text-text-tertiary">
                                            {e.period}
                                        </span>
                                    </div>

                                    <h2
                                        className="mt-3 text-[21px] font-bold tracking-[-0.025em] text-text-primary lg:text-[25px]"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {e.title}
                                    </h2>
                                    <p
                                        className="mt-2 text-[14px] leading-[1.7] text-text-secondary lg:text-[15px]"
                                        style={{ wordBreak: 'keep-all' }}
                                    >
                                        {e.summary}
                                    </p>

                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {e.prizes.map((p) => (
                                            <li
                                                key={p.rank}
                                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-subtle px-3 py-1.5 text-[12.5px] text-text-secondary"
                                            >
                                                <span className="font-bold text-brand-primary">
                                                    {p.rank}등
                                                </span>
                                                <span className="font-medium">{p.name}</span>
                                                <span className="text-text-tertiary">
                                                    {p.count}명
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-primary">
                                        자세히 보기
                                        <span
                                            aria-hidden="true"
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        >
                                            →
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
            <Footer />
        </main>
    );
}
