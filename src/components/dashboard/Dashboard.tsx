import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import styles from './Dashboard.module.css';

/* ────────────────────────────────────────────────────────────────────────
   Shared formatting helpers (server-safe; no client code in this module)
   ──────────────────────────────────────────────────────────────────────── */

/** USD with a fixed number of decimals ("$4,671.14"). */
export function formatUsd(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/** Plain number with thousands separators ("300,008.7"). */
export function formatNumber(value: number, maxDecimals = 2): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDecimals }).format(value);
}

/** Percent with one decimal at most ("56.0%" → "56%"). */
export function formatPercent(value: number): string {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)}%`;
}

/** ISO calendar date for tables ("2026-03-01"). */
export function formatDateIso(iso: string): string {
    return iso.slice(0, 10);
}

/** Prose date ("1 Mar 2026"). */
export function formatDateProse(iso: string): string {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(iso),
    );
}

/** Prose date-time ("12 Mar 2026, 16:00 UTC"). */
export function formatDateTimeProse(iso: string): string {
    const date = formatDateProse(iso);
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(iso));
    return `${date}, ${time} UTC`;
}

/**
 * Series colors for charts and legend swatches. Asset colors are data
 * encoding only; gold/silver are reserved for aggregates and cash.
 */
export const SERIES_COLORS = {
    BTC: '#F7931A',
    ARKB: '#F7931A',
    ETH: '#627EEA',
    FETH: '#627EEA',
    SOL: '#14F195',
    FSOL: '#14F195',
    CASH: '#C0C5CB',
    GOLD: '#C29B4E',
    SILVER: '#C0C5CB',
    POS: '#3DD68C',
    NEG: '#F0616D',
} as const;

export function seriesColorFor(symbol: string): string {
    const key = symbol.toUpperCase() as keyof typeof SERIES_COLORS;
    return SERIES_COLORS[key] ?? SERIES_COLORS.GOLD;
}

/* ────────────────────────────────────────────────────────────────────────
   Shell + header
   ──────────────────────────────────────────────────────────────────────── */

export function DashboardShell({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`${styles.shell} ${className}`.trim()}>{children}</div>;
}

export function DashboardHeader({
    eyebrow,
    title,
    description,
    meta,
    aside,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    /** Small mono line under the description (e.g. "as of 2026-03-01 · Manual CFO report"). */
    meta?: ReactNode;
    aside?: ReactNode;
}) {
    return (
        <header className={styles.header}>
            <div className={styles.headerMain}>
                {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
                <h1 className={styles.title}>{title}</h1>
                {description ? <p className={styles.description}>{description}</p> : null}
                {meta ? <p className={styles.headerMeta}>{meta}</p> : null}
            </div>
            {aside ? <div className={styles.headerAside}>{aside}</div> : null}
        </header>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   Metrics
   ──────────────────────────────────────────────────────────────────────── */

export function MetricGrid({
    children,
    columns,
    className = '',
}: {
    children: ReactNode;
    /** Force a column count at ≥1024px; defaults to an auto-fit grid. */
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}) {
    const columnClass = columns ? styles[`metricGridCols${columns}`] : '';
    return <div className={`${styles.metricGrid} ${columnClass} ${className}`.trim()}>{children}</div>;
}

type MetricAccent = 'btc' | 'eth' | 'sol' | 'gold';

const metricAccentClass: Record<MetricAccent, string> = {
    btc: styles.accentBtc,
    eth: styles.accentEth,
    sol: styles.accentSol,
    gold: styles.accentGold,
};

export function MetricCard({
    icon,
    label,
    value,
    sub,
    meta,
    accent,
    size = 'md',
}: {
    icon?: ReactNode;
    label: string;
    value: ReactNode;
    /** Supporting line (delta, share count, short note). */
    sub?: ReactNode;
    /** "as of <date> · <source>" line, rendered in mono --text-3. */
    meta?: ReactNode;
    /** 3px top rail in an asset/brand color (asset-specific tiles only). */
    accent?: MetricAccent;
    size?: 'md' | 'sm';
}) {
    return (
        <article
            className={`${styles.metricCard} ${accent ? metricAccentClass[accent] : ''} ${size === 'sm' ? styles.metricSm : ''}`.trim()}
        >
            <div className={styles.metricHead}>
                <span className={styles.metricLabel}>{label}</span>
                {icon ? (
                    <span className={styles.metricIcon} aria-hidden="true">
                        {icon}
                    </span>
                ) : null}
            </div>
            <span className={styles.metricValue}>{value}</span>
            {sub ? <span className={styles.metricSub}>{sub}</span> : null}
            {meta ? <span className={styles.metricMeta}>{meta}</span> : null}
        </article>
    );
}

/** Signed change with an arrow, a true minus sign, and --pos/--neg color. */
export function Delta({
    value,
    format = (n: number) => formatUsd(n, 2),
    className = '',
}: {
    value: number;
    /** Formats the absolute value; sign and arrow are added here. */
    format?: (absolute: number) => string;
    className?: string;
}) {
    const tone = value > 0 ? styles.deltaPos : value < 0 ? styles.deltaNeg : styles.deltaFlat;
    const arrow = value > 0 ? '▲' : value < 0 ? '▼' : '●';
    const sign = value > 0 ? '+' : value < 0 ? '−' : '';
    const word = value > 0 ? 'gain' : value < 0 ? 'loss' : 'unchanged';

    return (
        <span className={`${styles.delta} ${tone} ${className}`.trim()}>
            <span aria-hidden="true">{arrow}</span>
            <span>
                {sign}
                {format(Math.abs(value))}
            </span>
            <span className="sr-only"> {word}</span>
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   Panels
   ──────────────────────────────────────────────────────────────────────── */

export function DashboardPanel({
    eyebrow,
    title,
    description,
    action,
    children,
    id,
    className = '',
}: {
    /** Small gold label above the title (e.g. "Treasury"). */
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    id?: string;
    className?: string;
}) {
    return (
        <section className={`${styles.panel} ${className}`.trim()} id={id} aria-label={title}>
            <div className={styles.panelHeader}>
                <div className={styles.panelHeading}>
                    {eyebrow ? <p className={styles.panelEyebrow}>{eyebrow}</p> : null}
                    <h2 className={styles.panelTitle}>{title}</h2>
                    {description ? <p className={styles.panelDescription}>{description}</p> : null}
                </div>
                {action ? <div className={styles.panelAction}>{action}</div> : null}
            </div>
            <div className={styles.panelBody}>{children}</div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   Badges
   ──────────────────────────────────────────────────────────────────────── */

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

function toneClass(tone: BadgeTone) {
    switch (tone) {
        case 'success':
            return styles.badgeSuccess;
        case 'warning':
            return styles.badgeWarning;
        case 'danger':
            return styles.badgeDanger;
        case 'info':
            return styles.badgeInfo;
        default:
            return styles.badgeNeutral;
    }
}

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
    return (
        <span className={`${styles.badge} ${toneClass(tone)}`}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {children}
        </span>
    );
}

export function FreshnessBadge({ status, label }: { status: 'current' | 'stale'; label: string }) {
    return <StatusBadge tone={status === 'current' ? 'success' : 'warning'}>{label}</StatusBadge>;
}

/* ────────────────────────────────────────────────────────────────────────
   Empty / error states
   ──────────────────────────────────────────────────────────────────────── */

export function EmptyState({ title, copy, icon }: { title: string; copy: string; icon?: ReactNode }) {
    return (
        <div className={styles.emptyState}>
            <span className={styles.stateIcon} aria-hidden="true">
                {icon ?? <Inbox />}
            </span>
            <div>
                <p className={styles.emptyTitle}>{title}</p>
                <p className={styles.emptyCopy}>{copy}</p>
            </div>
        </div>
    );
}

export function ErrorState({ title, copy }: { title: string; copy: string }) {
    return (
        <div className={styles.errorState} role="alert">
            <span className={`${styles.stateIcon} ${styles.stateIconError}`} aria-hidden="true">
                <AlertTriangle />
            </span>
            <div>
                <p className={styles.errorTitle}>{title}</p>
                <p className={styles.errorCopy}>{copy}</p>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   Table
   ──────────────────────────────────────────────────────────────────────── */

export interface DataTableColumn {
    label: string;
    align?: 'left' | 'right' | 'center';
    /** Render cells in the mono, tabular-nums face. */
    mono?: boolean;
    /** Shorthand for `align: 'right'` + `mono: true`. */
    numeric?: boolean;
    /** Hide the column below 768px (the wrapper still scrolls if needed). */
    hideOnMobile?: boolean;
    width?: string;
}

/** A plain string column keeps the legacy `columns: string[]` signature working. */
export type DataTableColumnSpec = string | DataTableColumn;

function normalizeColumn(column: DataTableColumnSpec): DataTableColumn {
    return typeof column === 'string' ? { label: column } : column;
}

function columnClass(column: DataTableColumn): string {
    const align = column.numeric ? 'right' : column.align ?? 'left';
    return [
        align === 'right' ? styles.alignRight : align === 'center' ? styles.alignCenter : '',
        column.mono || column.numeric ? styles.cellMono : '',
        column.hideOnMobile ? styles.hideOnMobile : '',
    ]
        .filter(Boolean)
        .join(' ');
}

export function DataTable({
    columns,
    rows,
    caption,
    emphasizeLastRow = false,
}: {
    columns: DataTableColumnSpec[];
    rows: ReactNode[][];
    /** Visually hidden table caption for screen readers. */
    caption?: string;
    /** Style the final row as a total line. */
    emphasizeLastRow?: boolean;
}) {
    const normalized = columns.map(normalizeColumn);

    return (
        <div className={styles.tableWrap}>
            <table className={styles.table}>
                {caption ? <caption className="sr-only">{caption}</caption> : null}
                <thead>
                    <tr>
                        {normalized.map((column) => (
                            <th
                                key={column.label}
                                scope="col"
                                className={columnClass(column)}
                                style={column.width ? { width: column.width } : undefined}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={emphasizeLastRow && rowIndex === rows.length - 1 ? styles.totalRow : undefined}
                        >
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={columnClass(normalized[cellIndex] ?? { label: '' })}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export const dashboardStyles = styles;
