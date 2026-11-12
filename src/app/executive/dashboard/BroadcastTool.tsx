'use client';

import { useState, FormEvent } from 'react';
import { Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import styles from './BroadcastTool.module.css';

interface BroadcastToolProps {
    subscriberCount: number;
    onSent?: () => void;
}

type SendState = 'idle' | 'preview' | 'sent';
const SUBJECT_MAX = 120;
const MESSAGE_MAX = 4000;

export default function BroadcastTool({ subscriberCount, onSent }: BroadcastToolProps) {
    const [sendState, setSendState] = useState<SendState>('idle');
    const [isSending, setIsSending] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sentCount, setSentCount] = useState(0);
    const { addToast } = useToast();

    async function handleSend() {
        setIsSending(true);
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
            onSent?.();
            addToast(`Alert sent to ${data.sent ?? 0} subscribers`, 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Broadcast failed. Try again.';
            addToast(errorMessage, 'error');
        } finally {
            setIsSending(false);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (subscriberCount === 0) {
            addToast('No active subscribers are available for this broadcast.', 'warning');
            return;
        }
        if (!subject.trim() || !message.trim()) return;
        if (subject.trim().length > SUBJECT_MAX || message.trim().length > MESSAGE_MAX) {
            addToast('Subject or message exceeds the allowed length.', 'error');
            return;
        }
        setSendState('preview');
    }

    if (sendState === 'sent') {
        return (
            <div className={styles.successBox} role="status">
                <div className={styles.successIcon}>
                    <Check aria-hidden="true" />
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

    if (sendState === 'preview') {
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
                    <Button size="md" onClick={handleSend} disabled={isSending}>
                        {isSending ? 'Sending…' : `Send to ${subscriberCount} subscriber${subscriberCount !== 1 ? 's' : ''}`}
                    </Button>
                    <Button size="md" variant="outline" onClick={() => setSendState('idle')} disabled={isSending}>Edit</Button>
                </div>
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
                    maxLength={SUBJECT_MAX}
                    required
                />
                <span className={styles.charCount}>{subject.length}/{SUBJECT_MAX}</span>
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
                    maxLength={MESSAGE_MAX}
                    required
                />
                <span className={styles.charCount}>{message.length}/{MESSAGE_MAX}</span>
            </div>
            <div className={styles.footer}>
                <Button type="submit" size="md" disabled={subscriberCount === 0 || !subject.trim() || !message.trim()}>
                    Preview Alert
                </Button>
                <span className={styles.footerNote}>
                    Will send to {subscriberCount} active subscriber{subscriberCount !== 1 ? 's' : ''}
                </span>
            </div>
        </form>
    );
}
