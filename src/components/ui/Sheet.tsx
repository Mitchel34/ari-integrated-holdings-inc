"use client";

import { useEffect, useRef } from 'react';
import styles from './Sheet.module.css';

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
    side?: 'left' | 'right';
}

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
        return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true';
    });
}

export function Sheet({
    open,
    onOpenChange,
    title,
    children,
    side = 'right',
}: SheetProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousActiveElement = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const panel = panelRef.current;

        if (!panel) {
            return;
        }

        const focusableElements = getFocusableElements(panel);
        (focusableElements[0] ?? panel).focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onOpenChange(false);
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            const updatedFocusableElements = getFocusableElements(panel);

            if (updatedFocusableElements.length === 0) {
                event.preventDefault();
                panel.focus();
                return;
            }

            const first = updatedFocusableElements[0];
            const last = updatedFocusableElements[updatedFocusableElements.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey && activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            previousActiveElement?.focus();
        };
    }, [open, onOpenChange]);

    if (!open) {
        return null;
    }

    return (
        <div
            className={styles.overlay}
            role="presentation"
            onClick={() => onOpenChange(false)}
        >
            <div
                ref={panelRef}
                className={`${styles.content} ${side === 'left' ? styles.left : styles.right}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
