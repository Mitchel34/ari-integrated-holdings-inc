import type { ReactNode } from 'react';
import { Container } from '../ui/Container';
import styles from './Section.module.css';

interface SectionProps {
    children: ReactNode;
    /** `alt` adds a subtle raised band between sections. */
    tone?: 'default' | 'alt';
    /** Gold hairline along the top edge. */
    hairline?: boolean;
    /** Reduced vertical padding. */
    compact?: boolean;
    /** No top padding (directly after a PageHero). */
    flush?: boolean;
    narrow?: boolean;
    id?: string;
    className?: string;
    'aria-labelledby'?: string;
    'aria-label'?: string;
}

/** Vertical rhythm wrapper: padding, optional band, contained content. */
export function Section({
    children,
    tone = 'default',
    hairline = false,
    compact = false,
    flush = false,
    narrow = false,
    id,
    className = '',
    ...aria
}: SectionProps) {
    return (
        <section
            id={id}
            className={[
                styles.section,
                tone === 'alt' ? styles.alt : '',
                compact ? styles.compact : '',
                flush ? styles.flush : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...aria}
        >
            {hairline ? <div className={styles.hairline} aria-hidden="true" /> : null}
            <Container narrow={narrow}>{children}</Container>
        </section>
    );
}
