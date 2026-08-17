'use client';
// 카카오 JS SDK v2 를 지연 로드하고 init 까지 마친 뒤 ready 를 알리는 훅
import { useEffect, useState } from 'react';
import { EVENT } from '../lib/event-config';

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';

// 모듈 스코프에 로딩 프로미스를 공유 — 여러 컴포넌트가 동시에 훅을 마운트해도
// 스크립트 삽입과 Kakao.init 은 한 번만 실행되고, 모든 소비자가 같은 결과를 받는다.
let loadPromise = null;

function loadKakaoSdk() {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        if (window.Kakao?.isInitialized?.()) {
            resolve();
            return;
        }

        // 다른 훅 인스턴스가 이미 삽입한 스크립트가 DOM에 있으면 재사용
        let script = document.querySelector(`script[src="${SDK_URL}"]`);
        if (!script) {
            script = document.createElement('script');
            script.src = SDK_URL;
            script.async = true;
            document.head.appendChild(script);
        }

        script.addEventListener('load', () => {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(EVENT.KAKAO_JS_KEY);
            }
            resolve();
        });
        script.addEventListener('error', () => {
            reject(new Error('Kakao SDK load failed'));
        });
    });

    return loadPromise;
}

export function useKakaoSdk() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        loadKakaoSdk()
            .then(() => {
                if (!cancelled) setReady(true);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return { ready, error };
}
