import type { ReactNode } from 'react';
import styles from './AssetChip.module.css';

export type ChipTone = 'btc' | 'eth' | 'sol' | 'gold' | 'neutral' | 'pos' | 'warn' | 'neg';

const TICKER_TONE: Record<string, ChipTone> = {
    BTC: 'btc',
    ARKB: 'btc',
    ETH: 'eth',
    FETH: 'eth',
    SOL: 'sol',
    FSOL: 'sol',
};

/** Resolve a chip tone for an asset or ETF ticker. */
export function toneForSymbol(symbol: string): ChipTone {
    return TICKER_TONE[symbol.toUpperCase()] ?? 'neutral';
}

interface AssetChipProps {
    /** Asset or ETF symbol (BTC, ETH, SOL, ARKB, FETH, FSOL) or any label. */
    symbol?: string;
    /** Override the automatically derived tone. */
    tone?: ChipTone;
    size?: 'sm' | 'md';
    children?: ReactNode;
    className?: string;
    title?: string;
}

/**
 * Small status/asset chip. Asset colors are used only here and in data marks,
 * never as page ambiance. The label always carries the ticker text so color
 * is never the sole signal.
 */
export function AssetChip({ symbol, tone, size = 'sm', children, className = '', title }: AssetChipProps) {
    const resolvedTone = tone ?? (symbol ? toneForSymbol(symbol) : 'neutral');
    return (
        <span
            className={`${styles.chip} ${styles[resolvedTone]} ${size === 'md' ? styles.md : ''} ${className}`.trim()}
            title={title}
        >
            <span className={styles.dot} aria-hidden="true" />
            {children ?? symbol}
        </span>
    );
}
