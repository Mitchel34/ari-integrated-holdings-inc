import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ALLOCATION, SITE } from '@/lib/site';

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const ASSET_COLORS: Record<string, string> = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#14F195',
};

export default async function OpenGraphImage() {
    const mark = await readFile(path.join(process.cwd(), 'public', 'brand', 'ari-mark-512.png'));
    const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '64px 72px',
                    background: 'linear-gradient(135deg, #0A1324 0%, #0E1A30 60%, #15253F 100%)',
                    color: '#F4F7FB',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                    <img src={markSrc} width={96} height={96} alt="" style={{ borderRadius: 22 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Ari</div>
                        <div style={{ fontSize: 16, letterSpacing: 5, color: '#8492AA', textTransform: 'uppercase' }}>
                            Integrated Holdings
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ fontSize: 20, letterSpacing: 5, color: '#C29B4E', textTransform: 'uppercase' }}>
                        Digital-asset treasury
                    </div>
                    <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
                        {SITE.tagline}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                        {ALLOCATION.map((asset) => (
                            <div
                                key={asset.symbol}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '10px 18px',
                                    borderRadius: 999,
                                    border: '1px solid rgba(255,255,255,0.16)',
                                    background: 'rgba(255,255,255,0.06)',
                                    fontSize: 22,
                                    color: '#F4F7FB',
                                }}
                            >
                                <div
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 999,
                                        background: ASSET_COLORS[asset.symbol],
                                    }}
                                />
                                {asset.symbol} {asset.weight}%
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: 22, color: '#8492AA' }}>{SITE.domain}</div>
                </div>
            </div>
        ),
        { ...size },
    );
}
