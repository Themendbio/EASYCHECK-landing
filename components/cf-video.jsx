'use client';
// Hero 하단 CF 영상 섹션 — 썸네일을 먼저 보여주고 클릭 시에만 YouTube 플레이어를 로드한다.
import { useState } from 'react';
import { IconPlay } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const VIDEO_ID = '_C-BR4NXRHg';

function CfVideoSection() {
    const { t } = useLanguage();
    const [playing, setPlaying] = useState(false);

    return (
        <section
            data-screen-label="01-1 CF 영상"
            aria-label={t('video.sectionLabel')}
            className="bg-white px-6 lg:px-20 py-16 lg:py-24"
        >
            <div className="mx-auto max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-xl">
                {playing ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                        title={t('video.sectionLabel')}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setPlaying(true)}
                        aria-label={t('video.playLabel')}
                        className="group relative block w-full h-full focus-ring"
                    >
                        <img
                            src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-200 group-hover:bg-black/35"
                        >
                            <span className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/95 shadow-lg transition-transform duration-200 group-hover:scale-105">
                                <IconPlay
                                    size={28}
                                    className="text-brand-accent translate-x-[2px]"
                                />
                            </span>
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}

export { CfVideoSection };
