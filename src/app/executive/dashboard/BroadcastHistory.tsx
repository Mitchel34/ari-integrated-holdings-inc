'use client';

import { useState, useEffect } from 'react';
import styles from './BroadcastHistory.module.css';

interface BroadcastLogEntry {
    id: string;
    subject: string;
    message: string;
    sentByEmail: string;
    sentAt: string;
    recipientCount: number;
}

export default function BroadcastHistory() {
    const [logs, setLogs] = useState<BroadcastLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch('/api/executive/broadcast-history?limit=5');
                const data = await res.json() as { ok?: boolean; logs?: BroadcastLogEntry[] };
                if (data.ok && data.logs) {
                    setLogs(data.logs);
                }
            } catch (err) {
                console.error('Failed to fetch broadcast history:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

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
                <p>No broadcasts sent yet. Send your first alert above.</p>
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
                        <svg
                            className={`${styles.chevron} ${expandedId === log.id ? styles.expanded : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
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
