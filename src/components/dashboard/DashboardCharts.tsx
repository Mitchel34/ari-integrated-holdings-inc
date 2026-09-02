'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { AssetChip, toneForSymbol } from '@/components/brand/AssetChip';
import { formatPercent, formatUsd } from '@/lib/format';
import { SERIES_COLORS } from './Dashboard';
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

interface ChartA11yProps {
    /** Accessible name for the chart svg (recharts renders it as an svg <title>). */
    title?: string;
    /** Longer accessible description, e.g. the as-of date and source. */
    description?: string;
}

function describeSeries(data: { name: string; value: number }[]): string {
    return data.map((item) => `${item.name} ${formatUsd(item.value, 2)}`).join(', ');
}

const NAVY = '#0E1A30';

const tooltipStyle = {
    background: NAVY,
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: 10,
    boxShadow: '0 8px 24px -8px rgba(2, 6, 16, 0.55)',
    color: '#F4F7FB',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    padding: '0.6rem 0.8rem',
};

const tooltipLabelStyle = {
    color: '#8492AA',
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    marginBottom: 4,
};

const tooltipItemStyle = {
    color: '#F4F7FB',
    padding: 0,
};

function formatTooltipUsd(value: unknown) {
    return formatUsd(Number(value), 2);
}

function formatAxisUsd(value: unknown) {
    return formatUsd(Number(value), 0);
}

/** Donut of market value by holding plus a legend with asset chips. */
export function AllocationChart({ data, title, description }: { data: AllocationDatum[] } & ChartA11yProps) {
    const total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;
    const chartTitle = title ?? 'Allocation by market value';
    const chartDesc = description ?? describeSeries(data);

    return (
        <div className={styles.chartBlock}>
            <div className={styles.pieWrap}>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart title={chartTitle} desc={chartDesc}>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={62}
                            outerRadius={94}
                            paddingAngle={2}
                            stroke={NAVY}
                            strokeWidth={2}
                            isAnimationActive={false}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={formatTooltipUsd}
                            contentStyle={tooltipStyle}
                            labelStyle={tooltipLabelStyle}
                            itemStyle={tooltipItemStyle}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <ul className={styles.legend} aria-label="Allocation legend">
                {data.map((item) => {
                    const known = toneForSymbol(item.name) !== 'neutral';
                    return (
                        <li key={item.name} className={styles.legendRow}>
                            {known ? (
                                <AssetChip symbol={item.name} />
                            ) : (
                                <span className={styles.legendLabel}>
                                    <span className={styles.swatch} style={{ backgroundColor: item.color }} aria-hidden="true" />
                                    {item.name}
                                </span>
                            )}
                            <span className={styles.legendShare}>{formatPercent((item.value / total) * 100)}</span>
                            <span className={styles.legendValue}>{formatUsd(item.value, 2)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

/** Vertical bars of USD values; series colors come from the data (tokens). */
export function ValueBarChart({ data, title, description }: { data: BarDatum[] } & ChartA11yProps) {
    const chartTitle = title ?? 'Value by series';
    const chartDesc = description ?? describeSeries(data);

    return (
        <div className={styles.barWrap}>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={data}
                    margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
                    barCategoryGap="28%"
                    title={chartTitle}
                    desc={chartDesc}
                >
                    <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#8492AA', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.14)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={formatAxisUsd}
                        tick={{ fill: '#8492AA', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={64}
                    />
                    <Tooltip
                        formatter={formatTooltipUsd}
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={tooltipItemStyle}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64} isAnimationActive={false}>
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color ?? SERIES_COLORS.GOLD} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
