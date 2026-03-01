// ETF Prices - Static from CFO Reports
// No longer using live CoinGecko API
// Prices are updated manually when CFO provides new financial reports

export interface ETFPrices {
    arkb: number;
    fsol: number;
    feth: number;
    asOfDate: string;
}

// Current ETF prices from CFO Report (Mar 1, 2026)
// These are embedded in snapshot.ts holdings data
// This file is kept for potential future use if live pricing is needed

export const CURRENT_ETF_PRICES: ETFPrices = {
    arkb: 21.78,   // ARKB Bitcoin ETF
    fsol: 9.59,    // FSOL Solana ETF
    feth: 19.175,  // FETH Ethereum ETF
    asOfDate: '2026-03-01',
};

// Note: To update prices, modify the holdings in src/lib/treasury/snapshot.ts
// The snapshot.ts file is the single source of truth for financial data
