'use client';

import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from './DashboardCharts.module.css';

interface AllocationDatum {
    name: string;
    value: number;
    color: string;
}

interface BarDatum {
    name: string;
    value: number;
    color?: string;
}

const tooltipStyle = {
    background: '#081424',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    borderRadius: 8,
    color: '#f8fafc',
};

function formatUsd(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

export function AllocationChart({ data }: { data: AllocationDatum[] }) {
    return (
        <div className={styles.chartBlock}>
            <div className={styles.pieWrap}>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatUsd(Number(value))} contentStyle={tooltipStyle} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.legend}>
                {data.map((item) => (
                    <div key={item.name} className={styles.legendRow}>
                        <span className={styles.swatch} style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                        <strong>{formatUsd(item.value)}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ValueBarChart({ data }: { data: BarDatum[] }) {
    return (
        <div className={styles.barWrap}>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => formatUsd(Number(value))} contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color ?? '#E8C87A'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
