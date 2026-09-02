'use client';

import { useState, FormEvent } from 'react';
import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import styles from './BroadcastTool.module.css';

interface BroadcastToolProps {
    subscriberCount: number;
    onSent?: () => void;
}

type SendState = 'idle' | 'preview' | 'sent';
const SUBJECT_MAX = 120;
const MESSAGE_MAX = 4000;

function plural(count: number, noun: string) {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

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
            addToast(`Alert sent to ${plural(data.sent ?? 0, 'subscriber')}`, 'success');
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
                <span className={styles.successIcon} aria-hidden="true">
                    <Check />
                </span>
                <div className={styles.successText}>
                    <h3 className={styles.stateTitle}>Alert sent</h3>
                    <p className={styles.stateCopy}>Delivered to {plural(sentCount, 'active subscriber')}.</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => { setSendState('idle'); setSubject(''); setMessage(''); }}>
                    Send another
                </Button>
            </div>
        );
    }

    if (sendState === 'preview') {
        return (
            <div className={styles.preview}>
                <p className={`eyebrow eyebrow--plain ${styles.previewEyebrow}`}>Preview</p>
                <dl className={styles.previewFields}>
                    <div className={styles.previewField}>
                        <dt>To</dt>
                        <dd className="mono">{plural(subscriberCount, 'active subscriber')}</dd>
                    </div>
                    <div className={styles.previewField}>
                        <dt>Subject</dt>
                        <dd className={styles.previewSubject}>{subject}</dd>
                    </div>
                </dl>
                <div className={styles.previewBody}>{message}</div>
                <div className={styles.previewActions}>
                    <Button size="md" onClick={handleSend} disabled={isSending}>
                        {isSending ? 'Sending…' : `Send to ${plural(subscriberCount, 'subscriber')}`}
                    </Button>
                    <Button size="md" variant="secondary" onClick={() => setSendState('idle')} disabled={isSending}>
                        Edit
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {subscriberCount === 0 ? (
                <p className={styles.note}>
                    <span className={styles.noteIcon} aria-hidden="true"><Info /></span>
                    <span>No active alert subscribers yet. Once investors sign up via the alert form, they will appear here.</span>
                </p>
            ) : null}
            <Input
                id="broadcast-subject"
                name="subject"
                label="Subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Q1 2026 Treasury Update — Ari Integrated Holdings"
                maxLength={SUBJECT_MAX}
                hint={`${subject.length} / ${SUBJECT_MAX} characters`}
                required
            />
            <Textarea
                id="broadcast-message"
                name="message"
                label="Message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={'Treasury NAV as of today stands at…\n\nKey highlights for this period…\n\nNext steps…'}
                maxLength={MESSAGE_MAX}
                hint={`${message.length} / ${MESSAGE_MAX} characters`}
                required
            />
            <div className={styles.footer}>
                <Button type="submit" size="md" disabled={subscriberCount === 0 || !subject.trim() || !message.trim()}>
                    Preview alert
                </Button>
                <span className={styles.footerNote}>
                    Will send to <span className="mono">{plural(subscriberCount, 'active subscriber')}</span>
                </span>
            </div>
        </form>
    );
}
