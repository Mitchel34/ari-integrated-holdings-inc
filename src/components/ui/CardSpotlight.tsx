'use client';

import { useEffect, useRef } from 'react';
import styles from './Card.module.css';

/**
 * Soft gold light that follows the pointer across its parent card.
 * Purely decorative: hidden on touch devices and under reduced motion (CSS).
 */
export function CardSpotlight() {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = ref.current;
        const card = node?.parentElement;
        if (!node || !card) return;

        const track = (event: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
            node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
        };

        card.addEventListener('pointermove', track, { passive: true });
        return () => card.removeEventListener('pointermove', track);
    }, []);

    return <span ref={ref} className={styles.spotlight} aria-hidden="true" />;
}
