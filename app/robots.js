export const dynamic = 'force-static';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // /cdn-cgi/ 는 Cloudflare 이메일 난독화 링크(/cdn-cgi/l/email-protection)가 404로 답해 색인 오류로 잡히는 경로.
            disallow: ['/api/', '/cdn-cgi/'],
        },
        sitemap: 'https://themendbio.com/sitemap.xml',
    };
}
