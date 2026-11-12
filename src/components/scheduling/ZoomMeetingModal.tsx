'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink, Video, X } from 'lucide-react';
import { CalendlyEmbed } from './CalendlyEmbed';
import { ContactEmail } from '@/components/brand/ContactEmail';
import { CONTACT } from '@/lib/site';
import { ZOOM_MEETING_DURATION } from '@/lib/scheduling';
import styles from './ZoomMeetingModal.module.css';

interface ZoomMeetingModalProps {
    open: boolean;
    onClose: () => void;
    /** What the visitor wants to talk about, shown as the modal title. */
    topic: string;
    /** Calendly scheduling link for this booking. */
    url: string;
}

/**
 * Modal scheduler for a Zoom meeting. Uses the native <dialog>, which sits in
 * the browser's top layer: no z-index or stacking-context concerns, and focus
 * trapping, Escape to close, and focus return come built in. The page scroll
 * lock is global (`html:has(dialog[open])` in globals.css).
 */
export function ZoomMeetingModal({ open, onClose, topic, url }: ZoomMeetingModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-labelledby="zoom-meeting-title"
            onClose={onClose}
            onClick={(event) => {
                // The dialog has no padding, so a click on the element itself is a click on the backdrop.
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className={styles.panel}>
                <header className={styles.header}>
                    <span className={styles.icon} aria-hidden="true">
                        <Video size={22} strokeWidth={1.75} />
                    </span>
                    <div className={styles.heading}>
                        <p className="eyebrow">Zoom meeting · {ZOOM_MEETING_DURATION}</p>
                        <h2 id="zoom-meeting-title" className={styles.title}>{topic}</h2>
                        <p className={styles.subtitle}>
                            Pick a time. A Zoom link is generated automatically and sent with your confirmation email.
                        </p>
                    </div>
                    <button type="button" className={styles.close} aria-label="Close scheduler" onClick={onClose}>
                        <X size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                </header>

                <div className={styles.body}>
                    <p className={styles.loading}>Loading the calendar…</p>
                    {/* Mounted only while open so each opening starts on a fresh calendar. */}
                    {open ? (
                        <div className={styles.embed}>
                            <CalendlyEmbed url={url} label={`Schedule a Zoom meeting: ${topic}`} />
                        </div>
                    ) : null}
                </div>

                <footer className={styles.footer}>
                    <p>
                        Trouble booking? Email{' '}
                        <a href={CONTACT.mailto} className={`${styles.link} mono`}>
                            <ContactEmail />
                        </a>
                    </p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        Open in a new tab
                        <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                </footer>
            </div>
        </dialog>
    );
}
