'use client';
import Link from 'next/link';
import { IconInfo } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

// Footer — 단일 페이지용 단순 버전 (정적, 모션 없음)

// 면책 박스
function FooterDisclaimer() {
    const { t } = useLanguage();

    return (
        <section
            role="region"
            aria-label="앱 안내사항"
            className="
                flex items-start gap-3 lg:gap-4
                bg-bg-subtle border border-border
                rounded-lg
                px-5 py-5 lg:px-8 lg:py-6
                mb-10 lg:mb-12
            "
        >
            <span className="shrink-0 mt-0.5 text-text-secondary" aria-hidden="true">
                <IconInfo size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
                <p
                    className="
                        text-[12px] lg:text-[13px] font-semibold
                        uppercase tracking-[0.08em] text-text-tertiary
                        leading-none mb-1
                    "
                >
                    {t('footer.disclaimer.title')}
                </p>
                <p
                    className="text-[14px] lg:text-[15px] font-normal text-text-secondary leading-[1.6] m-0"
                    style={{ wordBreak: 'keep-all' }}
                >
                    {t('footer.disclaimer.text')}
                </p>
            </div>
        </section>
    );
}

// 푸터 본체
function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-white border-t border-border" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                사이트 푸터
            </h2>

            <div
                className="
                    mx-auto max-w-8xl px-6 lg:px-20
                    py-12 lg:py-16
                "
            >
                {/* 1. 면책 박스 */}
                <FooterDisclaimer />

                {/* 2. 브랜드 + 모회사 (좌측 정렬, 단순) */}
                <div className="flex flex-col gap-3 items-start">
                    <img
                        src="/images/easycheck-logo.webp"
                        alt="EASYCHECK"
                        className="h-8 lg:h-9 w-auto select-none"
                    />
                    <span
                        className="
                            inline-flex items-center self-start
                            h-8 px-3
                            bg-bg-muted rounded-md
                        "
                        aria-label="모회사"
                    >
                        <span className="text-[12px] lg:text-[13px] font-medium text-text-tertiary leading-none whitespace-nowrap">
                            {t('footer.company')}
                        </span>
                    </span>
                </div>

                {/* 3. 하단 영역 — 정책 링크 + 저작권 + 사업자 정보 */}
                <div
                    className="
                        mt-10 lg:mt-12 pt-6 lg:pt-8
                        border-t border-border
                        flex flex-col gap-2
                    "
                >
                    <nav
                        aria-label="약관"
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2"
                    >
                        <Link
                            href="/policy/privacy"
                            className="text-[12px] lg:text-[13px] font-medium text-text-secondary hover:text-text-primary hover:underline focus-ring rounded-sm"
                        >
                            {t('footer.privacy')}
                        </Link>
                        <span aria-hidden="true" className="text-text-disabled">
                            ·
                        </span>
                        <Link
                            href="/policy/account-deletion"
                            className="text-[12px] lg:text-[13px] font-medium text-text-secondary hover:text-text-primary hover:underline focus-ring rounded-sm"
                        >
                            {t('footer.dataDeletion')}
                        </Link>
                    </nav>
                    <p className="text-[12px] lg:text-[13px] font-normal text-text-tertiary leading-[1.6] m-0">
                        {t('footer.contact')}:{' '}
                        <a
                            href="mailto:themend_contact@mendbiosim.com"
                            className="text-text-secondary hover:text-text-primary hover:underline focus-ring rounded-sm"
                        >
                            themend_contact@mendbiosim.com
                        </a>
                    </p>
                    <p className="text-[12px] lg:text-[13px] font-normal text-text-tertiary leading-[1.6] m-0">
                        {t('footer.copyright')}
                    </p>
                    <p
                        className="text-[12px] lg:text-[13px] font-normal text-text-tertiary leading-[1.6] m-0"
                        style={{ wordBreak: 'keep-all' }}
                    >
                        {t('footer.businessInfo')}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export { Footer };
