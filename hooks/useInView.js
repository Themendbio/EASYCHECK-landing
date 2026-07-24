'use client';
import { useEffect, useRef, useState } from 'react';

// IntersectionObserver 기반 useInView 훅 (재진입 시마다 재실행).
// 진입/이탈마다 inView를 토글하므로 재스크롤 시 애니메이션이 다시 재생됨.
export function useInView(
    options = { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    deps = [],
) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Reduce motion: skip observer, show immediately.
        if (
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            setInView(true);
            return;
        }
        const io = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, options);
        io.observe(el);
        return () => io.disconnect();
    }, deps);
    return [ref, inView];
}
