'use client';

import { useCallback, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './BroadcastHistory.module.css';

interface BroadcastLogEntry {
    id: string;
    subject: string;
    message: string;
    sentByEmail: string;
    sentAt: string;
    recipientCount: number;
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

    function formatDate(iso: string) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(iso));
    }

    if (loading) {
        return (
            <div className={styles.skeleton}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.skeletonRow} />
                ))}
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className={styles.empty}>
                <p>{error ?? 'No broadcasts sent yet. Send your first alert above.'}</p>
            </div>
        );
    }

    return (
        <div className={styles.historyList}>
            {logs.map((log) => (
                <div key={log.id} className={styles.historyItem}>
                    <button
                        className={styles.historyHeader}
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                        aria-expanded={expandedId === log.id}
                    >
                        <div className={styles.historyMeta}>
                            <span className={styles.historySubject}>{log.subject}</span>
                            <span className={styles.historyDetails}>
                                {log.recipientCount} recipient{log.recipientCount !== 1 ? 's' : ''} • {formatDate(log.sentAt)}
                            </span>
                        </div>
                        <ChevronDown className={`${styles.chevron} ${expandedId === log.id ? styles.expanded : ''}`} aria-hidden="true" />
                    </button>
                    {expandedId === log.id && (
                        <div className={styles.historyBody}>
                            <p className={styles.historySender}>Sent by {log.sentByEmail}</p>
                            <p className={styles.historyMessage}>{log.message}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
