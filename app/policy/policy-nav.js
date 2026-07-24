'use client';
// 두 정책 페이지(개인정보처리방침·계정 삭제)를 오가는 본문 상단 사각 버튼 그룹
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
    { href: '/policy/privacy', label: '개인정보처리방침' },
    { href: '/policy/account-deletion', label: '계정·데이터 삭제' },
];

export default function PolicyNav() {
    const pathname = usePathname() || '';

    return (
        <nav aria-label="약관 탐색" className="mb-8">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
                {TABS.map((tab, i) => {
                    const active = pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={active ? 'page' : undefined}
                            className={[
                                'inline-flex items-center h-10 px-4 text-[14px] font-medium transition-colors focus-ring',
                                i > 0 ? 'border-l border-border' : '',
                                active
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-white text-text-secondary hover:bg-bg-subtle',
                            ].join(' ')}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
