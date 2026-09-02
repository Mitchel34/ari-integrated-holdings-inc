import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { SITE } from '@/lib/site';
import styles from './Logo.module.css';

interface LogoProps {
    /** Pixel size of the emblem mark. */
    size?: number;
    /** Show the wordmark next to the emblem. */
    wordmark?: boolean;
    /** Wrap in a link to the home page. */
    href?: string | null;
    priority?: boolean;
    className?: string;
}

/** Emblem mark plus optional "Ari / Integrated Holdings" wordmark lockup. */
export function Logo({ size = 40, wordmark = true, href = '/', priority = false, className = '' }: LogoProps) {
    const style = {
        '--mark-size': `${size}px`,
        '--name-size': `${Math.max(0.95, size / 38)}rem`,
        '--sub-size': `${Math.max(0.56, size / 64)}rem`,
    } as CSSProperties;

    const inner = (
        <>
            <Image
                src="/brand/ari-mark-192.webp"
                alt={wordmark ? '' : SITE.name}
                width={size}
                height={size}
                className={styles.mark}
                priority={priority}
                aria-hidden={wordmark ? true : undefined}
            />
            {wordmark ? (
                <span className={styles.text}>
                    <span className={styles.name}>Ari</span>
                    <span className={styles.sub}>Integrated Holdings</span>
                </span>
            ) : null}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`${styles.lockup} ${className}`.trim()} style={style} aria-label={`${SITE.name} home`}>
                {inner}
            </Link>
        );
    }

    return (
        <span className={`${styles.lockup} ${className}`.trim()} style={style}>
            {inner}
        </span>
    );
}
