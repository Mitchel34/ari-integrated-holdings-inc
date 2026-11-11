'use client';

import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass';
}

/** Track the pointer so the card's spotlight (see Card.module.css) follows it. */
function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
    return (
        <div className={`${styles.card} ${styles[variant]} ${className}`} onPointerMove={trackPointer}>
            {children}
        </div>
    );
}
