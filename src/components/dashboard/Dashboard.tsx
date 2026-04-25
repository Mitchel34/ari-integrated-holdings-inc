import type { ReactNode } from 'react';
import styles from './Dashboard.module.css';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

function toneClass(tone: BadgeTone) {
    switch (tone) {
        case 'success':
            return styles.badgeSuccess;
        case 'warning':
            return styles.badgeWarning;
        case 'danger':
            return styles.badgeDanger;
        default:
            return styles.badgeNeutral;
    }
}

export function DashboardShell({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`${styles.shell} ${className}`.trim()}>{children}</div>;
}

export function DashboardHeader({
    eyebrow,
    title,
    description,
    aside,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    aside?: ReactNode;
}) {
    return (
        <header className={styles.header}>
            <div>
                {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                <h1 className={styles.title}>{title}</h1>
                {description ? <p className={styles.description}>{description}</p> : null}
            </div>
            {aside ? <div className={styles.headerAside}>{aside}</div> : null}
        </header>
    );
}

export function MetricGrid({ children }: { children: ReactNode }) {
    return <div className={styles.metricGrid}>{children}</div>;
}

export function MetricCard({
    icon,
    label,
    value,
    sub,
}: {
    icon?: ReactNode;
    label: string;
    value: ReactNode;
    sub?: ReactNode;
}) {
    return (
        <article className={styles.metricCard}>
            {icon ? <div className={styles.metricIcon}>{icon}</div> : <span aria-hidden="true" />}
            <div>
                <span className={styles.metricLabel}>{label}</span>
                <span className={styles.metricValue}>{value}</span>
                {sub ? <span className={styles.metricSub}>{sub}</span> : null}
            </div>
        </article>
    );
}

export function DashboardPanel({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <h2 className={styles.panelTitle}>{title}</h2>
                    {description ? <p className={styles.panelDescription}>{description}</p> : null}
                </div>
                {action}
            </div>
            <div className={styles.panelBody}>{children}</div>
        </section>
    );
}

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
    return <span className={`${styles.badge} ${toneClass(tone)}`}>{children}</span>;
}

export function FreshnessBadge({
    status,
    label,
}: {
    status: 'current' | 'stale';
    label: string;
}) {
    return <StatusBadge tone={status === 'current' ? 'success' : 'warning'}>{label}</StatusBadge>;
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
    return (
        <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{title}</p>
            <p className={styles.emptyCopy}>{copy}</p>
        </div>
    );
}

export function ErrorState({ title, copy }: { title: string; copy: string }) {
    return (
        <div className={styles.errorState} role="alert">
            <p className={styles.errorTitle}>{title}</p>
            <p className={styles.errorCopy}>{copy}</p>
        </div>
    );
}

export function DataTable({
    columns,
    rows,
}: {
    columns: string[];
    rows: ReactNode[][];
}) {
    return (
        <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export const dashboardStyles = styles;
