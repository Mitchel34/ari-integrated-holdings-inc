'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './BroadcastTool.module.css';

interface BroadcastToolProps {
    subscriberCount: number;
}

type SendState = 'idle' | 'preview' | 'sending' | 'sent' | 'error';

export default function BroadcastTool({ subscriberCount }: BroadcastToolProps) {
    const [sendState, setSendState] = useState<SendState>('idle');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sentCount, setSentCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSend() {
        setSendState('sending');
        setErrorMsg('');
        try {
            const res = await fetch('/api/executive/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message }),
            });
            const data = await res.json() as { ok?: boolean; sent?: number; error?: string };
            if (!res.ok || !data.ok) throw new Error(data.error || 'Broadcast failed.');
            setSentCount(data.sent ?? 0);
            setSendState('sent');
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Broadcast failed. Try again.');
            setSendState('error');
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        setSendState('preview');
    }

    if (sendState === 'sent') {
        return (
            <div className={styles.successBox} role="status">
                <div className={styles.successIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <div>
                    <h3>Alert Sent</h3>
                    <p>Delivered to {sentCount} active subscriber{sentCount !== 1 ? 's' : ''}.</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setSendState('idle'); setSubject(''); setMessage(''); }}>
                    Send Another
                </Button>
            </div>
        );
    }

    if (sendState === 'preview' || sendState === 'sending' || sendState === 'error') {
        return (
            <div className={styles.preview}>
                <h3 className={styles.previewTitle}>Preview</h3>
                <div className={styles.previewField}>
                    <span className={styles.previewLabel}>To</span>
                    <span>{subscriberCount} active subscriber{subscriberCount !== 1 ? 's' : ''}</span>
                </div>
                <div className={styles.previewField}>
                    <span className={styles.previewLabel}>Subject</span>
                    <strong>{subject}</strong>
                </div>
                <div className={styles.previewBody}>{message}</div>
                <div className={styles.previewActions}>
                    <Button size="md" onClick={handleSend} disabled={sendState === 'sending'}>
                        {sendState === 'sending' ? 'Sending…' : `Send to ${subscriberCount} subscriber${subscriberCount !== 1 ? 's' : ''}`}
                    </Button>
                    <Button size="md" variant="outline" onClick={() => setSendState('idle')}>Edit</Button>
                </div>
                {sendState === 'error' && errorMsg && (
                    <p className={styles.errorMsg} role="alert">{errorMsg}</p>
                )}
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {subscriberCount === 0 && (
                <p className={styles.noSubs}>
                    No active alert subscribers yet. Once investors sign up via the alert form, they will appear here.
                </p>
            )}
            <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="broadcast-subject">Subject</label>
                <input
                    id="broadcast-subject"
                    className={styles.input}
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Q1 2026 Treasury Update — ARI Integrated Holdings"
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="broadcast-message">Message</label>
                <textarea
                    id="broadcast-message"
                    className={styles.textarea}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Treasury NAV as of today stands at...&#10;&#10;Key highlights for this period...&#10;&#10;Next steps..."
                    required
                />
            </div>
            <div className={styles.footer}>
                <Button type="submit" size="md" disabled={!subject.trim() || !message.trim()}>
                    Preview Alert
                </Button>
                <span className={styles.footerNote}>
                    Will send to {subscriberCount} active subscriber{subscriberCount !== 1 ? 's' : ''}
                </span>
            </div>
        </form>
    );
}
