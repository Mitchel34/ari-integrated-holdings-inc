import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { AssetsNav } from '../../components/allocation/AssetsNav';
import { TARGET_ASSETS } from '@/lib/allocation';
import styles from '../page.module.css';
import assets from './assets.module.css';

export const metadata: Metadata = {
    title: 'Target Assets | Ari Integrated Holdings Inc.',
    description: 'The three assets behind the 50 / 30 / 20 target allocation, and the role each one plays in the treasury.',
};

const COMPARISON_ROWS: { label: string; value: (asset: (typeof TARGET_ASSETS)[number]) => string }[] = [
    { label: 'Target weight', value: (asset) => `${asset.targetPct}%` },
    { label: 'Role', value: (asset) => asset.role },
    { label: 'Layer', value: (asset) => asset.layer },
    { label: 'Launched', value: (asset) => String(asset.launchedYear) },
    { label: 'Consensus', value: (asset) => asset.consensus },
    { label: 'Risk profile', value: (asset) => asset.riskTier },
    { label: 'Held through', value: (asset) => `${asset.vehicle.ticker} (${asset.vehicle.name})` },
];

export default function AssetsPage() {
    return (
        <>
        <section className={styles.pageHeroSection}>
            <Container>
                <div className={styles.sectionHeader}>
                    <h1>Target Assets</h1>
                    <p>The three assets behind the 50 / 30 / 20 target, and the role each one plays in the treasury.</p>
                </div>
            </Container>
        </section>

        <Container className={assets.explorer}>
            <aside className={assets.nav} aria-label="Target allocation">
                <AssetsNav />
            </aside>

            <div className={assets.sections}>
                {TARGET_ASSETS.map((asset) => (
                    <section
                        key={asset.key}
                        id={asset.key}
                        className={assets.asset}
                        style={{ '--asset-color': asset.color } as React.CSSProperties}
                        aria-labelledby={`${asset.key}-title`}
                    >
                        <header className={assets.assetHeader}>
                            <span className={assets.badge} aria-hidden="true">{asset.glyph}</span>
                            <div className={assets.assetTitle}>
                                <p className={assets.kicker}>{asset.role}</p>
                                <h2 id={`${asset.key}-title`}>
                                    {asset.name} <span>{asset.symbol}</span>
                                </h2>
                            </div>
                            <p className={assets.weight}>
                                <strong>{asset.targetPct}%</strong>
                                <span>target weight</span>
                            </p>
                        </header>

                        <dl className={assets.facts}>
                            <div>
                                <dt>Launched</dt>
                                <dd>{asset.launchedYear}</dd>
                            </div>
                            <div>
                                <dt>Consensus</dt>
                                <dd>{asset.consensus}</dd>
                            </div>
                            <div>
                                <dt>Held through</dt>
                                <dd>{asset.vehicle.ticker} · {asset.vehicle.name}</dd>
                            </div>
                        </dl>

                        <div className={assets.columns}>
                            <div>
                                <h3>What it is</h3>
                                <p>{asset.whatItIs}</p>
                            </div>
                            <div>
                                <h3>Its role in the treasury</h3>
                                <p>{asset.roleInTreasury}</p>
                            </div>
                            <div>
                                <h3>What to weigh</h3>
                                <p>{asset.whatToWeigh}</p>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </Container>

        <Container className={assets.compare}>
            <div className={styles.sectionHeader}>
                <h2>Side by Side</h2>
                <p>How the three positions differ, at a glance.</p>
            </div>
            <div className={assets.tableWrap}>
                <table className={assets.table}>
                    <thead>
                        <tr>
                            <td />
                            {TARGET_ASSETS.map((asset) => (
                                <th key={asset.key} scope="col" style={{ color: asset.color }}>
                                    {asset.symbol}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARISON_ROWS.map((row) => (
                            <tr key={row.label}>
                                <th scope="row">{row.label}</th>
                                {TARGET_ASSETS.map((asset) => (
                                    <td key={asset.key}>{row.value(asset)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={assets.next}>
                <p>See how the three positions work together as one portfolio.</p>
                <Button asChild size="lg">
                    <Link href="/thesis">Read Our Thesis</Link>
                </Button>
            </div>

            <p className={styles.sectionNote}>Digital assets remain volatile; interim drawdowns can be substantial.</p>
        </Container>
        </>
    );
}
