import { ALLOCATION } from '@/lib/site';
import styles from './AllocationBar.module.css';

export interface BarSegment {
    symbol: string;
    label?: string;
    value: number;
    /** Formatted value for the legend (defaults to a percentage). */
    display?: string;
}

interface AllocationBarProps {
    segments?: BarSegment[];
    showLegend?: boolean;
    className?: string;
    ariaLabel?: string;
}

const TONE: Record<string, string> = {
    BTC: styles.btc,
    ARKB: styles.btc,
    ETH: styles.eth,
    FETH: styles.eth,
    SOL: styles.sol,
    FSOL: styles.sol,
    CASH: styles.cash,
};

const DEFAULT_SEGMENTS: BarSegment[] = ALLOCATION.map((a) => ({
    symbol: a.symbol,
    label: a.name,
    value: a.weight,
}));

/** Horizontal stacked allocation bar with legend. */
export function AllocationBar({ segments = DEFAULT_SEGMENTS, showLegend = true, className = '', ariaLabel }: AllocationBarProps) {
    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;
    const description =
        ariaLabel ??
        `Allocation: ${segments.map((s) => `${s.label ?? s.symbol} ${Math.round((s.value / total) * 100)} percent`).join(', ')}`;

    return (
        <div className={`${styles.root} ${className}`.trim()}>
            <div className={styles.bar} role="img" aria-label={description}>
                {segments.map((s) => (
                    <span
                        key={s.symbol}
                        className={`${styles.seg} ${TONE[s.symbol.toUpperCase()] ?? styles.other}`}
                        style={{ width: `${(Math.max(0, s.value) / total) * 100}%` }}
                    />
                ))}
            </div>
            {showLegend ? (
                <ul className={styles.legend}>
                    {segments.map((s) => (
                        <li key={s.symbol} className={styles.item}>
                            <span className={`${styles.swatch} ${TONE[s.symbol.toUpperCase()] ?? styles.other}`} aria-hidden="true" />
                            <span>{s.label ?? s.symbol}</span>
                            <span className={styles.value}>{s.display ?? `${Math.round((s.value / total) * 100)}%`}</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
