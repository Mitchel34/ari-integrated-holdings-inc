import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AssetChip } from '@/components/brand/AssetChip';
import { AssetsNav } from '@/components/allocation/AssetsNav';
import { ALLOCATION, type AllocationTarget } from '@/lib/site';
import styles from './assets.module.css';

const DESCRIPTION =
    'The three assets behind the 50 / 30 / 20 target allocation, and the role each one plays in the treasury.';

export const metadata: Metadata = {
    title: 'Target Assets',
    description: DESCRIPTION,
    alternates: { canonical: '/assets' },
};

interface ComparisonRow {
    label: string;
    /** Numeric cells render in the mono face. */
    numeric?: boolean;
    value: (asset: AllocationTarget) => React.ReactNode;
}

const COMPARISON_ROWS: readonly ComparisonRow[] = [
    { label: 'Target weight', numeric: true, value: (asset) => `${asset.weight}%` },
    { label: 'Role', value: (asset) => asset.role },
    { label: 'Layer', value: (asset) => asset.layer },
    { label: 'Launched', numeric: true, value: (asset) => String(asset.launchedYear) },
    { label: 'Consensus', value: (asset) => asset.consensus },
    { label: 'Risk profile', value: (asset) => asset.riskTier },
    {
        label: 'Held through',
        value: (asset) => (
            <span className={styles.heldCell}>
                <AssetChip symbol={asset.etf} title={asset.etfName} />
                <span className={styles.heldName}>{asset.etfName}</span>
            </span>
        ),
    },
];

const DOT_CLASS: Record<AllocationTarget['key'], string> = {
    btc: styles.dotBtc,
    eth: styles.dotEth,
    sol: styles.dotSol,
};

export default function AssetsPage() {
    return (
        <>
            <PageHero eyebrow="Target allocation" title="Target Assets" lead={DESCRIPTION} />

            <Section flush aria-label="Target assets">
                <div className={styles.explorer}>
                    <aside className={styles.aside} aria-label="Allocation navigation">
                        <Card variant="glass" padding="sm" className={styles.navCard}>
                            <AssetsNav />
                        </Card>
                    </aside>

                    <div className={styles.sections}>
                        {ALLOCATION.map((asset) => (
                            <Card
                                key={asset.key}
                                as="section"
                                id={asset.key}
                                variant="glass"
                                accent={asset.key}
                                className={styles.asset}
                                aria-labelledby={`${asset.key}-title`}
                            >
                                <header className={styles.assetHeader}>
                                    <span className={`${styles.badge} glass-1`} aria-hidden="true">
                                        <span className={styles.glyph}>{asset.glyph}</span>
                                        <span className={`${styles.badgeDot} ${DOT_CLASS[asset.key]}`} />
                                    </span>
                                    <div className={styles.assetTitle}>
                                        <p className="eyebrow">{asset.role}</p>
                                        <h2 id={`${asset.key}-title`} className={styles.assetName}>
                                            {asset.name} <span className={`${styles.symbol} mono`}>{asset.symbol}</span>
                                        </h2>
                                    </div>
                                    <p className={styles.weight}>
                                        <span className={`${styles.weightValue} mono`}>{asset.weight}%</span>
                                        <span className={styles.weightLabel}>Target weight</span>
                                    </p>
                                </header>

                                <dl className={styles.facts}>
                                    <div className={styles.fact}>
                                        <dt>Launched</dt>
                                        <dd className="mono">{asset.launchedYear}</dd>
                                    </div>
                                    <div className={styles.fact}>
                                        <dt>Consensus</dt>
                                        <dd>{asset.consensus}</dd>
                                    </div>
                                    <div className={`${styles.fact} ${styles.factWide}`}>
                                        <dt>Held through</dt>
                                        <dd className={styles.heldCell}>
                                            <AssetChip symbol={asset.etf} title={asset.etfName} />
                                            <span className={styles.heldName}>{asset.etfName}</span>
                                        </dd>
                                    </div>
                                </dl>

                                <div className={styles.columns}>
                                    <div className={styles.column}>
                                        <h3 className={styles.columnTitle}>What it is</h3>
                                        <p className={styles.columnText}>{asset.whatItIs}</p>
                                    </div>
                                    <div className={styles.column}>
                                        <h3 className={styles.columnTitle}>Its role in the treasury</h3>
                                        <p className={styles.columnText}>{asset.roleInTreasury}</p>
                                    </div>
                                    <div className={styles.column}>
                                        <h3 className={styles.columnTitle}>What to weigh</h3>
                                        <p className={styles.columnText}>{asset.whatToWeigh}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Section>

            <Section id="compare" tone="alt" hairline aria-labelledby="compare-title">
                <SectionHeader
                    id="compare-title"
                    eyebrow="Comparison"
                    title="Side by side"
                    lead="How the three positions differ, at a glance."
                />

                <Card variant="glass" padding="none" className={styles.tableCard}>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <caption className="sr-only">
                                Comparison of Bitcoin, Ethereum, and Solana in the target allocation
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col" className={styles.attrHead}>
                                        <span className="sr-only">Attribute</span>
                                    </th>
                                    {ALLOCATION.map((asset) => (
                                        <th key={asset.key} scope="col" className={styles.assetHead}>
                                            <AssetChip symbol={asset.symbol} size="md" />
                                            <span className={styles.assetHeadName}>{asset.name}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON_ROWS.map((row) => (
                                    <tr key={row.label}>
                                        <th scope="row">{row.label}</th>
                                        {ALLOCATION.map((asset) => (
                                            <td key={asset.key} className={row.numeric ? `${styles.num} mono` : undefined}>
                                                {row.value(asset)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <ul className={styles.stackList} aria-label="Comparison of the three assets">
                    {ALLOCATION.map((asset) => (
                        <li key={asset.key}>
                            <Card variant="glass" accent={asset.key} padding="sm" className={styles.stackCard}>
                                <div className={styles.stackHead}>
                                    <AssetChip symbol={asset.symbol} size="md" />
                                    <span className={styles.stackName}>{asset.name}</span>
                                </div>
                                <dl className={styles.stackFacts}>
                                    {COMPARISON_ROWS.map((row) => (
                                        <div key={row.label} className={styles.stackRow}>
                                            <dt>{row.label}</dt>
                                            <dd className={row.numeric ? 'mono' : undefined}>{row.value(asset)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </Card>
                        </li>
                    ))}
                </ul>

                <div className={styles.next}>
                    <p className={styles.nextText}>See how the three positions work together as one portfolio.</p>
                    <Button asChild size="lg">
                        <Link href="/thesis">Read the thesis</Link>
                    </Button>
                </div>

                <p className={styles.risk}>Digital assets remain volatile; interim drawdowns can be substantial.</p>
            </Section>
        </>
    );
}
