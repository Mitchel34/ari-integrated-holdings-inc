'use client';

import { useState, useMemo } from 'react';
import { Check, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { DataTable, EmptyState, StatusBadge, formatDateIso } from '@/components/dashboard/Dashboard';
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
            formatDateIso(sub.subscribedAt),
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

    return (
        <div className={styles.listSection}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarSearch}>
                    <Input
                        id="subscriber-search"
                        name="search"
                        type="search"
                        label="Search by email"
                        placeholder="name@example.com"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div className={styles.toolbarFilter}>
                    <Select
                        id="subscriber-filter"
                        name="filter"
                        label="Status"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>
                <div className={styles.toolbarAction}>
                    <Button size="md" variant="secondary" onClick={exportCsv} block>
                        <Download aria-hidden="true" size={16} />
                        Export CSV
                    </Button>
                </div>
            </div>

            <p className={styles.resultsInfo} aria-live="polite">
                Showing <span className="mono">{filteredSubscribers.length}</span> of{' '}
                <span className="mono">{subscribers.length}</span> subscriber{subscribers.length === 1 ? '' : 's'}
            </p>

            {filteredSubscribers.length === 0 ? (
                <EmptyState
                    title={search || filter !== 'all' ? 'No subscribers match your filters' : 'No subscribers yet'}
                    copy={
                        search || filter !== 'all'
                            ? 'Clear the search or choose a different status to see more records.'
                            : 'Investors who sign up for alerts on the public site will appear here.'
                    }
                />
            ) : (
                <DataTable
                    caption="Investor alert subscribers"
                    columns={[
                        'Email',
                        'Status',
                        { label: 'Source', hideOnMobile: true },
                        { label: 'Subscribed', mono: true, hideOnMobile: true },
                        { label: 'Action', align: 'right' },
                    ]}
                    rows={filteredSubscribers.map((sub) => [
                        <span key="email" className={styles.email}>{sub.email}</span>,
                        <StatusBadge key="status" tone={sub.isActive ? 'success' : 'danger'}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>,
                        sub.source || '—',
                        formatDateIso(sub.subscribedAt),
                        <Button
                            key="action"
                            size="sm"
                            variant={sub.isActive ? 'danger' : 'secondary'}
                            className={styles.actionBtn}
                            onClick={() => toggleActive(sub.id, sub.isActive)}
                            disabled={updating === sub.id}
                            aria-label={`${sub.isActive ? 'Deactivate' : 'Reactivate'} ${sub.email}`}
                            title={sub.isActive ? 'Deactivate' : 'Reactivate'}
                        >
                            {updating === sub.id ? (
                                <span className="mono" aria-hidden="true">…</span>
                            ) : sub.isActive ? (
                                <X aria-hidden="true" size={16} />
                            ) : (
                                <Check aria-hidden="true" size={16} />
                            )}
                        </Button>,
                    ])}
                />
            )}
        </div>
    );
}
