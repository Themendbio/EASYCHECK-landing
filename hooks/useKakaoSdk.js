// 카카오 JS SDK v2 를 지연 로드하고 init 까지 마친 뒤 ready 를 알리는 훅
'use client';
import { useEffect, useState } from 'react';
import { EVENT } from '../lib/event-config';

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';

export function useKakaoSdk() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (window.Kakao?.isInitialized?.()) {
            setReady(true);
            return;
        }
        const script = document.createElement('script');
        script.src = SDK_URL;
        script.async = true;
        script.onload = () => {
            window.Kakao.init(EVENT.KAKAO_JS_KEY);
            setReady(true);
        };
        document.head.appendChild(script);
    }, []);

    return { ready };
}
