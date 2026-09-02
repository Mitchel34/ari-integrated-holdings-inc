import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
    eyebrow?: string;
    title: ReactNode;
    lead?: ReactNode;
    /** Render the title as an h1 (page title) or h2 (section title). */
    level?: 1 | 2;
    align?: 'left' | 'center';
    compact?: boolean;
    /** Optional trailing element (badge, link, button) shown on the right at wide widths. */
    aside?: ReactNode;
    id?: string;
    className?: string;
}

export function SectionHeader({
    eyebrow,
    title,
    lead,
    level = 2,
    align = 'left',
    compact = false,
    aside,
    id,
    className = '',
}: SectionHeaderProps) {
    const Heading = level === 1 ? 'h1' : 'h2';
    const header = (
        <div
            className={[
                styles.header,
                align === 'center' ? styles.center : '',
                compact ? styles.compact : '',
                aside ? '' : className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <Heading id={id} className={`${styles.title} ${level === 1 ? styles.h1 : styles.h2}`}>
                {title}
            </Heading>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
        </div>
    );

    if (!aside) {
        return header;
    }

    return (
        <div className={`${styles.row} ${compact ? styles.compact : ''} ${className}`.trim()}>
            {header}
            <div className={styles.aside}>{aside}</div>
        </div>
    );
}
