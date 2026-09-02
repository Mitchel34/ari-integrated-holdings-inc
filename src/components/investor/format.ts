/**
 * Date formatting for investor pages.
 * ISO ("2026-03-01") in tables and mono metadata; "1 Mar 2026" in prose.
 * All values are interpreted in UTC so server and client render identically.
 */

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

/** "2026-03-01" */
export function formatIsoDate(iso: string): string {
    return new Date(iso).toISOString().slice(0, 10);
}

/** "1 Mar 2026" */
export function formatProseDate(iso: string): string {
    return PROSE_DATE.format(new Date(iso));
}

/** "16:00 UTC" */
export function formatUtcTime(iso: string): string {
    return `${UTC_TIME.format(new Date(iso))} UTC`;
}
