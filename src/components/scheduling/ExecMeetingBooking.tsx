'use client';

import { useState } from 'react';
import { CalendlyEmbed } from './CalendlyEmbed';
import { Button } from '@/components/ui/Button';
import styles from './ExecMeetingBooking.module.css';

const CALENDLY_EXEC_ZOOM_URL = process.env.NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL ?? '';

export function ExecMeetingBooking() {
    const [notifyStatus, setNotifyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    async function handleNotifyAll() {
        setNotifyStatus('sending');
        try {
            const res = await fetch('/api/executive/meeting-notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meetingType: 'Executive Zoom Meeting',
                    message: 'A new executive Zoom meeting has been scheduled via Calendly. Please check your email for the Calendly invitation and Zoom link.',
                }),
            });
            const data = (await res.json()) as { ok?: boolean; error?: string };
            if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to notify.');
            setNotifyStatus('sent');
        } catch {
            setNotifyStatus('error');
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                        <path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                </div>
                <div className={styles.infoText}>
                    <h3>Executive Zoom Meetings</h3>
                    <p>
                        Book a Zoom meeting via Calendly. Once scheduled, click &quot;Notify All Executives&quot;
                        to send an email notification with meeting details to Mitchel, Judy, and Curtis.
                    </p>
                </div>
            </div>

            {/* Calendly booking embed */}
            <div className={styles.actions}>
                <Button
                    variant="outline"
                    onClick={handleNotifyAll}
                    disabled={notifyStatus === 'sending'}
                >
                    {notifyStatus === 'sending'
                        ? 'Sending...'
                        : notifyStatus === 'sent'
                            ? 'Notified!'
                            : 'Notify All Executives'}
                </Button>
            </div>

            {notifyStatus === 'sent' && (
                <div className={styles.successMsg}>
                    Meeting notification sent to all executives.
                </div>
            )}
            {notifyStatus === 'error' && (
                <div className={styles.errorMsg}>
                    Failed to send notifications. Please try again.
                </div>
            )}

            <div className={styles.embedContainer}>
                {CALENDLY_EXEC_ZOOM_URL ? (
                    <CalendlyEmbed url={CALENDLY_EXEC_ZOOM_URL} />
                ) : (
                    <div className={styles.placeholder}>
                        <div className={styles.placeholderIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <h4>Calendly Not Yet Configured</h4>
                        <p>
                            Set the <code>NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL</code> environment variable
                            to your Calendly event link with Zoom integration enabled.
                        </p>
                        <p className={styles.placeholderHint}>
                            Example: <code>https://calendly.com/your-org/executive-zoom</code>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
