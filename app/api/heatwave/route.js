import { REG_TO_SIDO } from '../../../components/ui/kmaRegionMap';

// 기상청 폭염 영향예보(발표현황)를 17개 시·도별 최대 위험수준으로 롤업해 반환.
// 응답: { asOf, levels: { '11': 0~4, ... }, active }
//  - levels 값 = ILVL (0 영향없음 · 1 관심 · 2 주의 · 3 경고 · 4 위험)
//  - 시·도 내 여러 특보구역 중 '최대 위험수준'을 대표값으로 사용

const KMA_URL = 'https://apihub.kma.go.kr/api/typ01/url/ifs_fct_pstt.php';

export const revalidate = 1800; // 30분 캐시

const ymd = (d) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

export async function GET() {
    const key = process.env.KMA_API_KEY;
    if (!key) {
        return Response.json({ error: 'KMA_API_KEY not configured' }, { status: 500 });
    }

    // ifs_fct_pstt는 발표시각 범위(tmfc1~tmfc2)가 있어야 데이터를 반환한다.
    // 폭염 영향예보가 매일 발표되진 않으므로 최근 14일을 받아 '최신 발표분'만 사용.
    const now = Date.now();
    const tmfc1 = ymd(new Date(now - 14 * 864e5));
    const tmfc2 = ymd(new Date(now + 864e5)); // +1일 (당일 발표분 누락 방지)
    const url = `${KMA_URL}?ifpar=hw&tmfc1=${tmfc1}&tmfc2=${tmfc2}&authKey=${key}`;

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

    // 1) 행 파싱 + 최신 발표시각(TM_FC) 탐색
    //    컬럼: TM_FC, TM_EF, STN, REG_ID, IFPAR, IFAREA, ILVL, EF_SN
    const rows = [];
    let latestFc = '';
    for (const line of text.split('\n')) {
        if (line.startsWith('#') || !line.includes('HW')) continue;
        const f = line.split(',').map((s) => s.trim());
        if (f.length < 7 || f[5] !== '1') continue; // IFAREA=1(보건)만
        const ilvl = Number(f[6]);
        if (Number.isNaN(ilvl)) continue;
        rows.push({ tmFc: f[0], regId: f[3], ilvl });
        if (f[0] > latestFc) latestFc = f[0];
    }

    // 2) 최신 발표분만 시·도별 최대 위험수준으로 롤업
    const levels = {};
    for (const r of rows) {
        if (r.tmFc !== latestFc) continue;
        const code = REG_TO_SIDO[r.regId];
        if (!code) continue;
        levels[code] = Math.max(levels[code] ?? 0, r.ilvl);
    }

    // 발효 구역이 없으면(비시즌·미발표) 빈 levels → active=false
    const active = Object.keys(levels).length > 0;

    return Response.json({ asOf: latestFc || null, levels, active });
}
