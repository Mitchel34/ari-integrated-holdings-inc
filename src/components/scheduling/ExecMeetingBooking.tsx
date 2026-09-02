'use client';

import { useState } from 'react';
import { Bell, CalendarDays, Video } from 'lucide-react';
import { CalendlyEmbed } from './CalendlyEmbed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './ExecMeetingBooking.module.css';

const CALENDLY_EXEC_ZOOM_URL = process.env.NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL ?? '';

type NotifyStatus = 'idle' | 'sending' | 'sent' | 'error';

export function ExecMeetingBooking() {
    const [notifyStatus, setNotifyStatus] = useState<NotifyStatus>('idle');

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

    const buttonLabel =
        notifyStatus === 'sending' ? 'Sending…' : notifyStatus === 'sent' ? 'Notification sent' : 'Notify all executives';

    return (
        <div className={styles.wrapper}>
            <Card variant="glass" padding="sm" className={styles.infoCard}>
                <span className={styles.infoIcon} aria-hidden="true">
                    <Video size={20} strokeWidth={1.75} />
                </span>
                <div className={styles.infoText}>
                    <h3 className={styles.infoTitle}>Executive Zoom meetings</h3>
                    <p className={styles.infoBody}>
                        Book a Zoom meeting through Calendly. Once scheduled, &ldquo;Notify all executives&rdquo;
                        sends an email notification to all executives and the CTO correspondence inbox.
                    </p>
                </div>
            </Card>

            <div className={styles.actions}>
                <Button
                    variant="secondary"
                    onClick={handleNotifyAll}
                    disabled={notifyStatus === 'sending' || notifyStatus === 'sent'}
                >
                    <Bell aria-hidden="true" />
                    {buttonLabel}
                </Button>
                {notifyStatus === 'sent' ? (
                    <p className={`${styles.status} ${styles.statusOk}`} role="status">
                        Meeting notification sent to all executives and the CTO correspondence inbox.
                    </p>
                ) : null}
                {notifyStatus === 'error' ? (
                    <p className={`${styles.status} ${styles.statusError}`} role="alert">
                        The notification could not be sent. Please try again.
                    </p>
                ) : null}
            </div>

            <div className={styles.embedContainer}>
                {CALENDLY_EXEC_ZOOM_URL ? (
                    <CalendlyEmbed url={CALENDLY_EXEC_ZOOM_URL} />
                ) : (
                    <div className={styles.placeholder}>
                        <span className={styles.placeholderIcon} aria-hidden="true">
                            <CalendarDays size={20} strokeWidth={1.75} />
                        </span>
                        <p className={styles.placeholderTitle}>Calendly is not yet configured</p>
                        <p className={styles.placeholderBody}>
                            Set the <code className="mono">NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL</code> environment variable
                            to your Calendly event link with Zoom integration enabled.
                        </p>
                        <p className={styles.placeholderHint}>
                            Example: <code className="mono">https://calendly.com/your-org/executive-zoom</code>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
