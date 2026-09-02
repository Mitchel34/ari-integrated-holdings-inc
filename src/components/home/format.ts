/** Formatting helpers shared by the Home page components (numeric contract: precise, no abbreviations). */

export function formatUsd(value: number, decimals = 2): string {
    return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}

export function formatShares(value: number): string {
    return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
}

/** "1 Mar 2026" style for prose. Uses UTC so the calendar date never shifts. */
export function formatProseDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

/** ISO calendar date for mono table-like rows. */
export function formatIsoDate(iso: string): string {
    return iso.slice(0, 10);
}
