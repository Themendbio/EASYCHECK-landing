'use client';
// /policy 하위 법적 고지 페이지(개인정보처리방침·계정 삭제)의 공통 틀 — 랜딩과 동일 헤더 + 푸터
import { Nav } from '../../components/hero';
import { Footer } from '../../components/footer';

export default function PolicyLayout({ children }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
