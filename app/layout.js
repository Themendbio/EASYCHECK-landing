'use client';
import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import ko from '../locales/ko.json';
import en from '../locales/en.json';

const translations = {
    ko,
    en,
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <head>
                <title>EASYCHECK</title>
                <meta
                    name="description"
                    content="몸이 보내는 SOS, 놓치고 계셨나요? EASYCHECK는 스마트워치의 PPG 신호를 AI로 분석해 체내 수분 지수를 즉각적으로 확인합니다."
                />
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
                <LanguageProvider translations={translations}>{children}</LanguageProvider>
            </body>
        </html>
    );
}
