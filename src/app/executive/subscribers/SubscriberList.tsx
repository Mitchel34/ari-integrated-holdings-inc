'use client';

import { useState, useMemo } from 'react';
import { Check, Download, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import styles from './page.module.css';

interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
    isActive: boolean;
    source: string | null;
}

interface SubscriberListProps {
    initialSubscribers: Subscriber[];
}

export default function SubscriberList({ initialSubscribers }: SubscriberListProps) {
    const [subscribers, setSubscribers] = useState(initialSubscribers);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [updating, setUpdating] = useState<string | null>(null);
    const { addToast } = useToast();

    const filteredSubscribers = useMemo(() => {
        return subscribers.filter((sub) => {
            const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                filter === 'all' ||
                (filter === 'active' && sub.isActive) ||
                (filter === 'inactive' && !sub.isActive);
            return matchesSearch && matchesFilter;
        });
    }, [subscribers, search, filter]);

    async function toggleActive(id: string, currentStatus: boolean) {
        setUpdating(id);
        try {
            const res = await fetch(`/api/executive/subscribers/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            if (!res.ok) throw new Error('Failed to update');
            setSubscribers((prev) =>
                prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s))
            );
            addToast(currentStatus ? 'Subscriber deactivated' : 'Subscriber reactivated', 'success');
        } catch {
            addToast('Failed to update subscriber', 'error');
        } finally {
            setUpdating(null);
        }
    }

    function escapeCsvCell(value: string) {
        const escaped = value.replace(/"/g, '""');
        return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
    }

    function exportCsv() {
        const headers = ['Email', 'Status', 'Source', 'Subscribed Date'];
        const rows = filteredSubscribers.map((sub) => [
            sub.email,
            sub.isActive ? 'Active' : 'Inactive',
            sub.source || '',
            new Date(sub.subscribedAt).toLocaleDateString(),
        ]);
        const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        addToast(`Exported ${filteredSubscribers.length} subscribers`, 'success');
    }

    function formatDate(iso: string) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(iso));
    }

    return (
        <div className={styles.listSection}>
            <div className={styles.toolbar}>
                <input
                    type="text"
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className={styles.filterSelect}
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <Button size="sm" variant="outline" onClick={exportCsv}>
                    <Download aria-hidden="true" size={16} />
                    Export CSV
                </Button>
            </div>

            <div className={styles.resultsInfo}>
                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            </div>

            {filteredSubscribers.length === 0 ? (
                <div className={styles.empty}>
                    {search || filter !== 'all'
                        ? 'No subscribers match your filters.'
                        : 'No subscribers yet.'}
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Email</span>
                        <span>Status</span>
                        <span>Source</span>
                        <span>Date</span>
                        <span>Actions</span>
                    </div>
                    {filteredSubscribers.map((sub) => (
                        <div key={sub.id} className={styles.tableRow}>
                            <span className={styles.email}>{sub.email}</span>
                            <span className={`${styles.status} ${sub.isActive ? styles.active : styles.inactive}`}>
                                {sub.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={styles.source}>{sub.source || '—'}</span>
                            <span className={styles.date}>{formatDate(sub.subscribedAt)}</span>
                            <span className={styles.actions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => toggleActive(sub.id, sub.isActive)}
                                    disabled={updating === sub.id}
                                    title={sub.isActive ? 'Deactivate' : 'Reactivate'}
                                >
                                    {updating === sub.id ? (
                                        '...'
                                    ) : sub.isActive ? (
                                        <X aria-hidden="true" size={16} />
                                    ) : (
                                        <Check aria-hidden="true" size={16} />
                                    )}
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
