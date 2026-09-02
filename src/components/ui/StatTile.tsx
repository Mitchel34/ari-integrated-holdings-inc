import type { ReactNode } from 'react';
import { formatSignedNumber } from '@/lib/format';
import styles from './StatTile.module.css';

interface StatTileProps {
    label: string;
    value: ReactNode;
    /** Numeric delta; rendered with sign and color. */
    delta?: number;
    /** Formatter for the delta value (default: fixed 2 with sign). */
    formatDelta?: (delta: number) => string;
    /** Trailing footnote (e.g. "as of 1 Mar 2026"). */
    sub?: ReactNode;
    icon?: ReactNode;
    accent?: 'btc' | 'eth' | 'sol' | 'gold';
    size?: 'md' | 'sm';
    className?: string;
}

function defaultFormatDelta(delta: number): string {
    return formatSignedNumber(delta, 2);
}

/** Glass metric tile with a mono numeral, optional delta, and footnote. */
export function StatTile({
    label,
    value,
    delta,
    formatDelta = defaultFormatDelta,
    sub,
    icon,
    accent,
    size = 'md',
    className = '',
}: StatTileProps) {
    const deltaClass = delta === undefined ? '' : delta > 0 ? styles.deltaPos : delta < 0 ? styles.deltaNeg : styles.deltaFlat;
    const arrow = delta === undefined ? '' : delta > 0 ? '▲ ' : delta < 0 ? '▼ ' : '● ';

    return (
        <article
            className={`${styles.tile} ${accent ? styles[accent] : ''} ${size === 'sm' ? styles.sm : ''} ${className}`.trim()}
        >
            <div className={styles.head}>
                <span className={styles.label}>{label}</span>
                {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
            </div>
            <span className={styles.value}>{value}</span>
            {delta !== undefined || sub ? (
                <div className={styles.foot}>
                    {delta !== undefined ? (
                        <span className={`${styles.delta} ${deltaClass}`}>
                            <span aria-hidden="true">{arrow}</span>
                            {formatDelta(delta)}
                        </span>
                    ) : null}
                    {sub ? <span>{sub}</span> : null}
                </div>
            ) : null}
        </article>
    );
}
