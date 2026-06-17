'use client';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { IconX } from './icons';

// MS Forms 임베드 URL (embed=true). 폼을 교체하려면 이 주소만 바꾸세요.
const FORM_EMBED_URL =
    'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=xCXwUnjFBUG5eSPiq7MwlxSRRgRddQJPvu9zxJ9JLihUQzE3SEZaTjdBVjZWRk9HUjNHS0pIMEVYUC4u&embed=true';

function ContactModal({ open, onClose }) {
    const { t } = useLanguage();

    // ESC 닫기 + 배경 스크롤 잠금
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    // backdrop-filter가 걸린 nav(header) 안에서 렌더하면 position:fixed 기준이 header로
    // 바뀌므로, body로 portal 해 viewport 전체 기준으로 띄운다.
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="relative w-full max-w-[680px] h-[85vh] max-h-[780px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <h2
                        id="contact-title"
                        className="text-[17px] font-bold text-text-primary tracking-[-0.02em]"
                    >
                        {t('nav.contact')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center w-9 h-9 -mr-2 rounded-md text-text-tertiary hover:bg-bg-subtle hover:text-text-primary focus-ring"
                        aria-label={t('contact.close')}
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <iframe
                    src={FORM_EMBED_URL}
                    title={t('nav.contact')}
                    className="flex-1 w-full border-0"
                    allowFullScreen
                />
            </div>
        </div>,
        document.body
    );
}

export { ContactModal };