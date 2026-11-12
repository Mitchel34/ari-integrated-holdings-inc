import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Cinzel } from 'next/font/google';
import styles from './AriLogo.module.css';

// Roman capitals for the wordmark only; everything else on the site stays in Inter.
const wordmarkFont = Cinzel({
    subsets: ['latin'],
    weight: ['600'],
    display: 'swap',
});

/** Where the lion mark lives. One vector file serves every size. */
export const ARI_MARK_SRC = '/brand/ari-mark.svg';

interface AriMarkProps {
    /** Rendered width and height in pixels. */
    size?: number;
    /** Load ahead of other images (the header and the hero). */
    priority?: boolean;
    /**
     * Text alternative. Empty by default because the mark usually sits beside
     * the wordmark or inside a labelled link, where repeating the name would
     * only make screen readers say it twice.
     */
    alt?: string;
    className?: string;
}

/** The lion mark on its own. */
export function AriMark({ size = 48, priority = false, alt = '', className = '' }: AriMarkProps) {
    return (
        <Image
            src={ARI_MARK_SRC}
            alt={alt}
            width={size}
            height={size}
            priority={priority}
            // An SVG needs no resizing or re-encoding; serve the file as it is.
            unoptimized
            className={`${styles.mark} ${className}`.trim()}
        />
    );
}

interface AriLogoProps {
    /** `compact` is the mark and "ARI"; `full` adds "Integrated Holdings". */
    variant?: 'compact' | 'full';
    /**
     * Height of the mark in pixels; the lettering scales with it. Leave it out
     * to size the lockup from CSS instead: set `--ari-logo-size` on any
     * ancestor (it can change per breakpoint). The default is 48px.
     */
    markSize?: number;
    priority?: boolean;
    className?: string;
}

/**
 * The lockup: lion mark, "ARI" in metallic capitals and, in the full variant,
 * a hairline rule with "Integrated Holdings". The parent supplies the
 * accessible name (for example a link labelled with the company name), so the
 * lettering here is hidden from assistive technology.
 */
export function AriLogo({ variant = 'full', markSize, priority = false, className = '' }: AriLogoProps) {
    const sizing = markSize ? ({ '--ari-logo-size': `${markSize}px` } as CSSProperties) : undefined;

    return (
        <span className={`${styles.logo} ${className}`.trim()} style={sizing} data-variant={variant}>
            <AriMark size={markSize ?? 48} priority={priority} />
            <span className={styles.lettering} aria-hidden="true">
                <span className={`${styles.name} ${wordmarkFont.className}`}>Ari</span>
                <span className={styles.descriptor}>
                    <span>Integrated</span>
                    <span>Holdings</span>
                </span>
            </span>
        </span>
    );
}
