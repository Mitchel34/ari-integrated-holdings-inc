'use client';

import { useCallback, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/Dashboard';
import styles from './BroadcastHistory.module.css';

interface BroadcastLogEntry {
    id: string;
    subject: string;
    message: string;
    sentByEmail: string;
    sentAt: string;
    recipientCount: number;
}

function formatSentAt(iso: string) {
    const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
    const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
    return `${date}, ${time}`;
}

export default function BroadcastHistory({ refreshKey = 0 }: { refreshKey?: number }) {
    const [logs, setLogs] = useState<BroadcastLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/executive/broadcast-history?limit=5&v=${refreshKey}`);
            const data = await res.json() as { ok?: boolean; logs?: BroadcastLogEntry[]; error?: string };
            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Failed to fetch history');
            }
            setLogs(data.logs ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch history');
        } finally {
            setLoading(false);
        }
    }, [refreshKey]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (loading) {
        return (
            <div className={styles.skeleton} role="status" aria-live="polite" aria-busy="true">
                <span className="sr-only">Loading broadcast history</span>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.skeletonRow} aria-hidden="true" />
                ))}
            </div>
        );
    }

    if (logs.length === 0) {
        return error ? (
            <EmptyState title="History unavailable" copy={error} />
        ) : (
            <EmptyState title="No broadcasts sent yet" copy="Send your first alert above. Each broadcast is logged here with its recipient count." />
        );
    }

    return (
        <ul className={styles.historyList}>
            {logs.map((log) => {
                const expanded = expandedId === log.id;
                return (
                    <li key={log.id} className={styles.historyItem}>
                        <button
                            type="button"
                            className={styles.historyHeader}
                            onClick={() => setExpandedId(expanded ? null : log.id)}
                            aria-expanded={expanded}
                            aria-controls={`broadcast-${log.id}`}
                        >
                            <span className={styles.historyMeta}>
                                <span className={styles.historySubject}>{log.subject}</span>
                                <span className={styles.historyDetails}>
                                    {log.recipientCount} recipient{log.recipientCount !== 1 ? 's' : ''} · {formatSentAt(log.sentAt)}
                                </span>
                            </span>
                            <ChevronDown className={`${styles.chevron} ${expanded ? styles.expanded : ''}`} aria-hidden="true" />
                        </button>
                        {expanded ? (
                            <div id={`broadcast-${log.id}`} className={styles.historyBody}>
                                <p className={styles.historySender}>Sent by {log.sentByEmail}</p>
                                <p className={styles.historyMessage}>{log.message}</p>
                            </div>
                        ) : null}
                    </li>
                );
            })}
        </ul>
    );
}
