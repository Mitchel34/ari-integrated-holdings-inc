import { AlertTriangle, Database, ShieldCheck, WifiOff } from 'lucide-react';
import {
    DataTable,
    DashboardPanel,
    EmptyState,
    MetricCard,
    MetricGrid,
    StatusBadge,
} from '@/components/dashboard/Dashboard';
import styles from './TradingSystemStatus.module.css';

type TradingSignalStatus = 'not-connected' | 'planned';

interface TradingSystemSignal {
    label: string;
    value: string;
    status: TradingSignalStatus;
    detail: string;
}

const signals: TradingSystemSignal[] = [
    {
        label: 'Data Pipeline',
        value: 'Not connected',
        status: 'not-connected',
        detail: 'Awaiting backend market data status endpoint.',
    },
    {
        label: 'Execution Mode',
        value: 'No live controls',
        status: 'planned',
        detail: 'Frontend remains read-only until backend approval gates are available.',
    },
    {
        label: 'Risk State',
        value: 'Unavailable',
        status: 'not-connected',
        detail: 'Will display kill switch, drawdown, exposure, and leverage state.',
    },
    {
        label: 'Latest Model Run',
        value: 'Unavailable',
        status: 'not-connected',
        detail: 'Will display latest experiment and paper trading summary.',
    },
];

const futureEndpoints = [
    '/api/trading/status',
    '/api/trading/risk',
    '/api/trading/performance',
    '/api/trading/model-runs',
    '/api/trading/alerts',
];

export function TradingSystemStatus() {
    return (
        <DashboardPanel
            eyebrow="Systems"
            title="Trading system status"
            description="Read-only placeholder for the separate trading backend. No execution controls are connected."
            action={<StatusBadge tone="warning">Not connected</StatusBadge>}
        >
            <MetricGrid columns={3}>
                <MetricCard size="sm" icon={<WifiOff aria-hidden="true" />} label="Backend Link" value="Offline" sub="No frontend API route is active" />
                <MetricCard size="sm" icon={<ShieldCheck aria-hidden="true" />} label="Execution Safety" value="Read-only" sub="No order controls in this app" />
                <MetricCard size="sm" icon={<AlertTriangle aria-hidden="true" />} label="Alerts" value="Unavailable" sub="Backend alerts pending integration" />
            </MetricGrid>

            <div className={styles.statusGrid}>
                <DataTable
                    caption="Trading system signals"
                    columns={['Signal', 'State', { label: 'Detail', hideOnMobile: true }]}
                    rows={signals.map((signal) => [
                        <span key="label" className={styles.signalLabel}>{signal.label}</span>,
                        <StatusBadge key="status" tone={signal.status === 'not-connected' ? 'warning' : 'neutral'}>{signal.value}</StatusBadge>,
                        <span key="detail" className={styles.signalDetail}>{signal.detail}</span>,
                    ])}
                />
                <div className={styles.contractBox}>
                    <div className={styles.contractHeader}>
                        <span className={styles.contractIcon} aria-hidden="true">
                            <Database size={18} />
                        </span>
                        <h3 className={styles.contractTitle}>Future API contract</h3>
                    </div>
                    <p className={styles.contractCopy}>When the backend is ready, this panel should consume these read-only endpoints first.</p>
                    <ul className={styles.endpointList}>
                        {futureEndpoints.map((endpoint) => (
                            <li key={endpoint}>
                                <code className={styles.endpoint}>{endpoint}</code>
                            </li>
                        ))}
                    </ul>
                    <EmptyState
                        title="No paper/live state connected"
                        copy="Backend integration should start with status, risk, and model-run summaries before any execution controls are considered."
                    />
                </div>
            </div>
        </DashboardPanel>
    );
}
