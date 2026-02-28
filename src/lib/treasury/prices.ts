export interface SpotPrices {
    btc: number;
    eth: number;
    sol: number;
    asOfIso: string;
    source: 'live' | 'fallback';
}

// Fallback prices (last known good — updated at build time or last successful fetch)
const FALLBACK: SpotPrices = {
    btc: 96200,
    eth: 3290,
    sol: 188,
    asOfIso: new Date().toISOString(),
    source: 'fallback',
};

let _cached: SpotPrices | null = null;
let _cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchSpotPrices(): Promise<SpotPrices> {
    const now = Date.now();

    // Return in-memory cache if fresh
    if (_cached && now - _cachedAt < CACHE_TTL_MS) {
        return _cached;
    }

    try {
        const apiKey = process.env.COINGECKO_API_KEY;
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (apiKey) headers['x-cg-demo-api-key'] = apiKey;

        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Csolana&vs_currencies=usd';
        const res = await fetch(url, {
            headers,
            next: { revalidate: 300 }, // Next.js fetch cache: 5 min
        });

        if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);

        const data = await res.json() as {
            bitcoin?: { usd: number };
            ethereum?: { usd: number };
            solana?: { usd: number };
        };

        if (!data.bitcoin?.usd || !data.ethereum?.usd || !data.solana?.usd) {
            throw new Error('Unexpected CoinGecko response shape');
        }

        const prices: SpotPrices = {
            btc: data.bitcoin.usd,
            eth: data.ethereum.usd,
            sol: data.solana.usd,
            asOfIso: new Date().toISOString(),
            source: 'live',
        };

        _cached = prices;
        _cachedAt = now;
        return prices;
    } catch (err) {
        console.warn('[Treasury] CoinGecko fetch failed, using fallback prices:', err);
        return FALLBACK;
    }
}
