'use client';

import { Nav, Hero } from '../components/hero';
import { StatsSection } from '../components/stats';
import { HeatmapSection } from '../components/heatmap';
import { ProblemSection } from '../components/problem';
import { SolutionSection } from '../components/solution';
import { TechSection } from '../components/tech';
import { DownloadCTA } from '../components/download';
import { Footer } from '../components/footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Nav />
            <Hero />
            <div className="relative isolate">
                {/* 두 섹션 높이에 딱 맞는 배경 레이어 (다음 섹션 침범 방지) */}
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                    {/* 처음엔 내용과 함께 위로 스크롤되다가, 화면 상단에 닿으면 고정 */}
                    <div
                        className="sticky top-0 h-screen w-full bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/summer-sky-bg.png')" }}
                    />
                </div>
                <StatsSection />
                <HeatmapSection />
            </div>
            <ProblemSection />
            <SolutionSection />
            <TechSection />
            <DownloadCTA />
            <Footer />
        </div>
    );
}
