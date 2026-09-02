import type { ElementType, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'subtle' | 'glass' | 'elevated' | 'solid' | 'default';
export type CardAccent = 'btc' | 'eth' | 'sol' | 'gold';

interface CardProps {
    children: ReactNode;
    className?: string;
    /** `subtle` (tier 1), `glass` (tier 2, default), `elevated` (tier 3), `solid` (opaque). */
    variant?: CardVariant;
    /** Adds hover lift + gold edge. Use only when the whole card is a link/button. */
    interactive?: boolean;
    /** 3px top rail in an asset/brand color. */
    accent?: CardAccent;
    padding?: 'none' | 'sm' | 'md';
    as?: ElementType;
    id?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

const accentClass: Record<CardAccent, string> = {
    btc: styles.accentBtc,
    eth: styles.accentEth,
    sol: styles.accentSol,
    gold: styles.accentGold,
};

export function Card({
    children,
    className = '',
    variant = 'glass',
    interactive = false,
    accent,
    padding = 'md',
    as: Tag = 'div',
    ...rest
}: CardProps) {
    const classes = [
        styles.card,
        styles[variant],
        interactive ? styles.interactive : '',
        accent ? accentClass[accent] : '',
        padding === 'sm' ? styles.padSm : padding === 'none' ? styles.padNone : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Tag className={classes} {...rest}>
            {children}
        </Tag>
    );
}
