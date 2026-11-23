export const dynamic = 'force-static';

// 색인 대상 주소 — 모두 200으로 바로 답하는 슬래시 없는 형태이며 각 페이지의 canonical과 같다.
const PATHS = [
    { path: '/', priority: 1 },
    { path: '/event', priority: 0.7 },
    { path: '/event/prereg', priority: 0.7 },
    { path: '/policy/privacy', priority: 0.3 },
    { path: '/policy/account-deletion', priority: 0.3 },
];

export default function sitemap() {
    return PATHS.map(({ path, priority }) => ({
        url: `https://themendbio.com${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority,
    }));
}
