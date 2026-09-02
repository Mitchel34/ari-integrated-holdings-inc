'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import styles from './Reveal.module.css';

interface RevealProps {
    children: ReactNode;
    /** Stagger delay in milliseconds. */
    delay?: number;
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
}

type RevealState = 'initial' | 'hidden' | 'visible';

const FALLBACK_REVEAL_MS = 1800;

/**
 * Fades content in the first time it scrolls into view.
 *
 * Content is rendered visible on the server and stays visible when
 * JavaScript or IntersectionObserver is unavailable; only elements that are
 * below the fold at mount time are hidden and then revealed on scroll.
 * Reduced-motion users always see content immediately (handled in CSS).
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style }: RevealProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [state, setState] = useState<RevealState>('initial');

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setState('visible');
                        observer.disconnect();
                        return;
                    }
                    // First callback for an off-screen element: arm the reveal.
                    setState((current) => (current === 'initial' ? 'hidden' : current));
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        );

        observer.observe(node);

        // Safety net: never leave content hidden (slow scroll listeners,
        // crawlers with tall viewports, print) — reveal after a short delay.
        const fallback = window.setTimeout(() => {
            setState('visible');
            observer.disconnect();
        }, FALLBACK_REVEAL_MS);

        return () => {
            observer.disconnect();
            window.clearTimeout(fallback);
        };
    }, []);

    const stateClass = state === 'hidden' ? styles.hidden : state === 'visible' ? styles.visible : '';

    return (
        <Tag
            ref={ref}
            className={`${styles.reveal} ${stateClass} ${className}`.trim()}
            style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
        >
            {children}
        </Tag>
    );
}
