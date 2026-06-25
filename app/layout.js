'use client';
import './globals.css';
import Script from 'next/script';
import { LanguageProvider } from '../contexts/LanguageContext';
import ko from '../locales/ko.json';
import en from '../locales/en.json';

const translations = {
    ko,
    en,
};

const GA_ID = 'G-GFLHHYT04D';
const SITE_URL = 'https://easycheck-landing.netlify.app';
const OG_IMAGE = `${SITE_URL}/images/og-image.png`;
const SITE_TITLE = 'EASYCHECK | 스마트워치로 확인하는 체내 수분 지수';
const SITE_DESCRIPTION =
    '몸이 보내는 SOS, 놓치고 계셨나요? EASYCHECK는 스마트워치의 PPG 신호를 AI로 분석해 체내 수분 지수를 즉각적으로 확인합니다.';

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <head>
                <title>{SITE_TITLE}</title>
                <meta name="description" content={SITE_DESCRIPTION} />
                <meta
                    name="keywords"
                    content="EASYCHECK, 이지체크, 수분 지수, 탈수, 수분 부족, 스마트워치, PPG, 폭염, 건강관리"
                />
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#0068B7" />
                <link rel="canonical" href={`${SITE_URL}/`} />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="EASYCHECK" />
                <meta property="og:title" content={SITE_TITLE} />
                <meta property="og:description" content={SITE_DESCRIPTION} />
                <meta property="og:url" content={`${SITE_URL}/`} />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:alt" content="EASYCHECK — 스마트워치로 확인하는 체내 수분 지수" />
                <meta property="og:locale" content="ko_KR" />
                <meta property="og:locale:alternate" content="en_US" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={SITE_TITLE} />
                <meta name="twitter:description" content={SITE_DESCRIPTION} />
                <meta name="twitter:image" content={OG_IMAGE} />

                <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
                    crossOrigin="anonymous"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                />
            </head>
            <body>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="ga-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}');
                    `}
                </Script>
                <LanguageProvider translations={translations}>{children}</LanguageProvider>
            </body>
        </html>
    );
}
