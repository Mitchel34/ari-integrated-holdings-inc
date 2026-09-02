import { useId, type CSSProperties } from 'react';
import { ALLOCATION, type AssetSymbol } from '@/lib/site';
import styles from './AllocationRing.module.css';

export interface RingSegment {
    symbol: AssetSymbol | string;
    label?: string;
    /** Share of the ring (any positive number; normalized to 100%). */
    value: number;
}

interface AllocationRingProps {
    /** Diameter in pixels. */
    size?: number;
    strokeWidth?: number;
    /** Defaults to the 50 / 30 / 20 target allocation. */
    segments?: RingSegment[];
    /** Text in the center (mono). */
    label?: string;
    sublabel?: string;
    /** Draw the outer orbital ring with the gold marker. */
    orbit?: boolean;
    /** Hide the center text (for small inline indicators). */
    compact?: boolean;
    className?: string;
    /** Accessible description; a sensible default is generated. */
    ariaLabel?: string;
}

const SEGMENT_STROKE: Record<string, string> = {
    BTC: 'var(--btc)',
    ETH: 'var(--eth)',
    SOL: 'url(#GRAD)',
    CASH: 'var(--silver-500)',
};

const DEFAULT_SEGMENTS: RingSegment[] = ALLOCATION.map((a) => ({
    symbol: a.symbol,
    label: a.name,
    value: a.weight,
}));

/**
 * The signature motif: a donut whose arcs equal the allocation weights,
 * wrapped by a thin orbital ring with a gold marker at 12 o'clock.
 * Segment colors are the only place asset colors appear at scale.
 */
export function AllocationRing({
    size = 280,
    strokeWidth,
    segments = DEFAULT_SEGMENTS,
    label,
    sublabel,
    orbit = true,
    compact = false,
    className = '',
    ariaLabel,
}: AllocationRingProps) {
    const gradientId = `ring-sol-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
    const viewBox = 100;
    const center = viewBox / 2;
    const stroke = strokeWidth ?? (size <= 40 ? 8 : size <= 120 ? 7 : 5.5);
    const radius = center - stroke / 2 - (orbit ? 7 : 1);
    const circumference = 2 * Math.PI * radius;
    const gap = segments.length > 1 ? Math.min(1.2, circumference * 0.008) : 0;
    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;

    const arcs = segments.reduce<
        Array<RingSegment & { length: number; offset: number; fraction: number; strokeColor: string }>
    >((acc, segment) => {
        const start = acc.reduce((sum, a) => sum + a.fraction, 0);
        const fraction = Math.max(0, segment.value) / total;
        const length = Math.max(0, fraction * circumference - gap);
        const offset = -start * circumference;
        const strokeColor = (SEGMENT_STROKE[segment.symbol.toUpperCase()] ?? 'var(--gold-500)').replace('GRAD', gradientId);
        acc.push({ ...segment, length, offset, fraction, strokeColor });
        return acc;
    }, []);

    const description =
        ariaLabel ??
        `Allocation: ${arcs
            .map((a) => `${a.label ?? a.symbol} ${Math.round(a.fraction * 100)} percent`)
            .join(', ')}`;

    const wrapperStyle = { '--ring-size': `${size}px` } as CSSProperties;

    return (
        <div className={`${styles.wrapper} ${className}`.trim()} style={wrapperStyle} role="img" aria-label={description}>
            <svg className={styles.svg} viewBox={`0 0 ${viewBox} ${viewBox}`} aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#9945FF" />
                        <stop offset="100%" stopColor="#14F195" />
                    </linearGradient>
                </defs>

                {orbit ? (
                    <g className={styles.orbitGroup}>
                        <circle className={styles.orbit} cx={center} cy={center} r={center - 0.5} />
                        <circle className={styles.orbitDot} cx={center} cy={0.5} r={1.6} />
                    </g>
                ) : null}

                <circle className={styles.track} cx={center} cy={center} r={radius} strokeWidth={stroke} />

                <g transform={`rotate(-90 ${center} ${center})`}>
                    {arcs.map((arc) => (
                        <circle
                            key={arc.symbol}
                            className={styles.segment}
                            cx={center}
                            cy={center}
                            r={radius}
                            strokeWidth={stroke}
                            stroke={arc.strokeColor}
                            strokeDashoffset={arc.offset}
                            style={
                                {
                                    '--dash': `${arc.length} ${circumference - arc.length}`,
                                    '--circ': `${circumference}`,
                                } as CSSProperties
                            }
                        />
                    ))}
                </g>
            </svg>

            {!compact && (label || sublabel) ? (
                <div className={styles.center} aria-hidden="true">
                    {label ? <span className={styles.label}>{label}</span> : null}
                    {sublabel ? <span className={styles.sublabel}>{sublabel}</span> : null}
                </div>
            ) : null}
        </div>
    );
}
