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

/**
 * Fades content in the first time it scrolls into view.
 * Renders visible immediately when IntersectionObserver is unavailable
 * or the user prefers reduced motion (handled in CSS).
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style }: RevealProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`${styles.reveal} ${visible ? styles.visible : ''} ${className}`.trim()}
            style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
        >
            {children}
        </Tag>
    );
}
