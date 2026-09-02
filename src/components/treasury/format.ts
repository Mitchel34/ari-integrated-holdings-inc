/**
 * Numeric formatting contract for financial figures.
 * USD with two decimals, thousands separators, true minus sign (U+2212),
 * percentages with at most one decimal. Never abbreviate.
 */

const USD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const USD_PRECISE = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
});

const UNITS = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
});

const SHARES = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
});

const PERCENT = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
});

const MINUS = '−';

/** "$4,671.14" */
export function formatUsd(value: number): string {
    return USD.format(value);
}

/** Four-decimal USD for per-share figures that would round to zero at two decimals. */
export function formatUsdPrecise(value: number): string {
    return USD_PRECISE.format(value);
}

/** "+$12.00" / "−$1,068.03" / "$0.00" */
export function formatSignedUsd(value: number): string {
    const rounded = Math.round(value * 100) / 100;
    if (rounded === 0) {
        return USD.format(0);
    }
    const sign = rounded > 0 ? '+' : MINUS;
    return `${sign}${USD.format(Math.abs(rounded))}`;
}

/** "120" / "0.5" — ETF units. */
export function formatUnits(value: number): string {
    return UNITS.format(value);
}

/** "300,008.7" */
export function formatShares(value: number): string {
    return SHARES.format(value);
}

/** "60.9%" / "50%" — at most one decimal. */
export function formatPercent(value: number): string {
    return `${PERCENT.format(value)}%`;
}

/** Signed percentage points: "+10.9 pts" / "−4.2 pts". */
export function formatSignedPoints(value: number): string {
    const rounded = Math.round(value * 10) / 10;
    if (rounded === 0) {
        return '0 pts';
    }
    const sign = rounded > 0 ? '+' : MINUS;
    return `${sign}${PERCENT.format(Math.abs(rounded))} pts`;
}
