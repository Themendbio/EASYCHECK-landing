'use client';
// 정적 페이지가 열린 뒤에도 공통 이벤트 마감 상태를 갱신한다.
import { useSyncExternalStore } from 'react';
import { isEventClosed } from '../lib/event-config';

function subscribe(onChange) {
    const timer = window.setInterval(onChange, 1000);
    return () => window.clearInterval(timer);
}

export function useEventClosed() {
    return useSyncExternalStore(subscribe, isEventClosed, () => false);
}
