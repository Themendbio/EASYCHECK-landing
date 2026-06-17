import { REG_TO_SIDO } from '../../../components/ui/kmaRegionMap';

// 기상청 폭염 영향예보(발표현황)를 17개 시·도별 최대 위험수준으로 롤업해 반환.
// 응답: { asOf, levels: { '11': 0~4, ... }, active }
//  - levels 값 = ILVL (0 영향없음 · 1 관심 · 2 주의 · 3 경고 · 4 위험)
//  - 시·도 내 여러 특보구역 중 '최대 위험수준'을 대표값으로 사용

const KMA_URL = 'https://apihub.kma.go.kr/api/typ01/url/ifs_fct_pstt.php';

export const revalidate = 1800; // 30분 캐시 (영향예보는 하루 2회 갱신)

export async function GET() {
    const key = process.env.KMA_API_KEY;
    if (!key) {
        return Response.json({ error: 'KMA_API_KEY not configured' }, { status: 500 });
    }

    // ifpar=hw(폭염), ifarea=1(보건 일반인), ef_sn=3(내일+모레)
    // 주의: ilvl 파라미터는 생략해야 전체 레벨이 옴 (ilvl=0 은 '영향없음'만 필터링됨)
    const url = `${KMA_URL}?ifpar=hw&ifarea=1&ef_sn=3&authKey=${key}`;

    let text;
    try {
        const res = await fetch(url, { next: { revalidate } });
        if (!res.ok) throw new Error(`KMA ${res.status}`);
        // 응답은 EUC-KR 인코딩
        const buf = await res.arrayBuffer();
        text = new TextDecoder('euc-kr').decode(buf);
    } catch (e) {
        return Response.json({ error: 'KMA fetch failed', detail: String(e) }, { status: 502 });
    }

    const levels = {};
    let asOf = null;

    for (const line of text.split('\n')) {
        if (line.startsWith('#') || !line.includes('HW')) continue;
        const f = line.split(',').map((s) => s.trim());
        // TM_FC, TM_EF, STN, REG_ID, IFPAR, IFAREA, ILVL, EF_SN
        if (f.length < 7) continue;
        const regId = f[3];
        const ilvl = Number(f[6]);
        const code = REG_TO_SIDO[regId];
        if (!code || Number.isNaN(ilvl)) continue;
        asOf = asOf ?? f[0];
        levels[code] = Math.max(levels[code] ?? 0, ilvl);
    }

    // 발효 구역이 없으면(비시즌 등) 전 지역 0으로 간주
    const active = Object.keys(levels).length > 0;

    return Response.json({ asOf, levels, active });
}
