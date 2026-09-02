/**
 * Single numeric and date formatting contract for the whole site.
 *
 * - USD with two decimals and thousands separators ("$4,671.14"); never abbreviated.
 * - Signed figures carry a leading "+" or a true minus sign (U+2212), never a hyphen.
 * - Share counts with thousands separators and at most one decimal ("300,008.7").
 * - Percentages with at most one decimal ("50%", "60.9%").
 * - Dates as ISO ("2026-03-01") in tables and mono metadata, "1 Mar 2026" in prose,
 *   and "12 Mar 2026, 16:00 UTC" for timestamps. Everything is interpreted in UTC
 *   so server and client render identically.
 */

export const MINUS_SIGN = '−';

const LOCALE = 'en-US';

const usdFormatters = new Map<number, Intl.NumberFormat>();
const numberFormatters = new Map<number, Intl.NumberFormat>();

function usdFormatter(decimals: number): Intl.NumberFormat {
    let formatter = usdFormatters.get(decimals);
    if (!formatter) {
        formatter = new Intl.NumberFormat(LOCALE, {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
        usdFormatters.set(decimals, formatter);
    }
    return formatter;
}

function numberFormatter(maxFractionDigits: number): Intl.NumberFormat {
    let formatter = numberFormatters.get(maxFractionDigits);
    if (!formatter) {
        formatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: maxFractionDigits });
        numberFormatters.set(maxFractionDigits, formatter);
    }
    return formatter;
}

function roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

function signFor(rounded: number): string {
    return rounded > 0 ? '+' : rounded < 0 ? MINUS_SIGN : '';
}

/* ── Money ─────────────────────────────────────────────────────────────── */

/** "$4,671.14" — fixed number of decimals (default 2). */
export function formatUsd(value: number, decimals = 2): string {
    return usdFormatter(decimals).format(value);
}

/** Four-decimal USD for per-share figures that would round to zero at two decimals ("$0.0156"). */
export function formatUsdPrecise(value: number): string {
    return formatUsd(value, 4);
}

/** "+$12.00" / "−$1,068.03" / "$0.00" — true minus, explicit plus. */
export function formatSignedUsd(value: number, decimals = 2): string {
    const rounded = roundTo(value, decimals);
    return `${signFor(rounded)}${formatUsd(Math.abs(rounded), decimals)}`;
}

/* ── Plain numbers ─────────────────────────────────────────────────────── */

/** Thousands separators, up to `maxFractionDigits` decimals ("1,234.5"). */
export function formatNumber(value: number, maxFractionDigits = 2): string {
    return numberFormatter(maxFractionDigits).format(value);
}

/** "+12.00" / "−3.50" / "0.00" — fixed decimals with a true minus sign. */
export function formatSignedNumber(value: number, decimals = 2): string {
    const rounded = roundTo(value, decimals);
    const magnitude = new Intl.NumberFormat(LOCALE, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(Math.abs(rounded));
    return `${signFor(rounded)}${magnitude}`;
}

/** "300,008.7" — share counts, at most one decimal. */
export function formatShares(value: number): string {
    return formatNumber(value, 1);
}

/** "120" / "0.5" — ETF units held, up to four decimals. */
export function formatUnits(value: number): string {
    return formatNumber(value, 4);
}

/* ── Percentages ───────────────────────────────────────────────────────── */

/** "60.9%" / "50%" — at most `decimals` decimals (default 1). */
export function formatPercent(value: number, decimals = 1): string {
    return `${formatNumber(value, decimals)}%`;
}

/** "+10.9%" / "−4.2%" / "0%". */
export function formatSignedPercent(value: number, decimals = 1): string {
    const rounded = roundTo(value, decimals);
    return `${signFor(rounded)}${formatPercent(Math.abs(rounded), decimals)}`;
}

/** Signed percentage points: "+10.9 pts" / "−4.2 pts" / "0 pts". */
export function formatSignedPoints(value: number, decimals = 1): string {
    const rounded = roundTo(value, decimals);
    return `${signFor(rounded)}${formatNumber(Math.abs(rounded), decimals)} pts`;
}

/* ── Dates (always UTC) ────────────────────────────────────────────────── */

const PROSE_DATE = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
});

const UTC_TIME = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
});

/** "2026-03-01" — ISO calendar date for tables, `<time dateTime>`, and mono metadata. */
export function formatDateIso(iso: string): string {
    return new Date(iso).toISOString().slice(0, 10);
}

/** "1 Mar 2026" — prose date. */
export function formatDateProse(iso: string): string {
    return PROSE_DATE.format(new Date(iso));
}

/** "16:00 UTC" — wall-clock time in UTC. */
export function formatUtcTime(iso: string): string {
    return `${UTC_TIME.format(new Date(iso))} UTC`;
}

/** "12 Mar 2026, 16:00 UTC" — prose timestamp. */
export function formatDateTimeUtc(iso: string): string {
    return `${formatDateProse(iso)}, ${formatUtcTime(iso)}`;
}
