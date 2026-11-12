import type { CSSProperties } from 'react';
import { Cinzel } from 'next/font/google';
import styles from './AriLogo.module.css';

// Roman capitals for the wordmark only; everything else on the site stays in Inter.
const wordmarkFont = Cinzel({
    subsets: ['latin'],
    weight: ['600'],
    display: 'swap',
});

interface AriLogoProps {
    /** `full` is "ARI" with "Integrated Holdings" behind a hairline; `compact` is "ARI" alone. */
    variant?: 'compact' | 'full';
    /**
     * Size of the wordmark in pixels: "ARI" is set at six tenths of it, and
     * the rest scales to match. Leave it out to size the wordmark from CSS
     * instead: set `--ari-logo-size` on any ancestor (it can change per
     * breakpoint). The default is 48px.
     */
    size?: number;
    className?: string;
}

/**
 * The company wordmark: "ARI" in metallic capitals and, in the full variant,
 * a champagne hairline with "Integrated Holdings". It is lettering only, and
 * it is hidden from assistive technology: whatever wraps it (a link, a
 * heading, an element with `role="img"`) supplies the company name.
 */
export function AriLogo({ variant = 'full', size, className = '' }: AriLogoProps) {
    const sizing = size ? ({ '--ari-logo-size': `${size}px` } as CSSProperties) : undefined;

    return (
        <span className={`${styles.logo} ${className}`.trim()} style={sizing} data-variant={variant} aria-hidden="true">
            <span className={`${styles.name} ${wordmarkFont.className}`}>Ari</span>
            <span className={styles.descriptor}>
                <span>Integrated</span>
                <span>Holdings</span>
            </span>
        </span>
    );
}
