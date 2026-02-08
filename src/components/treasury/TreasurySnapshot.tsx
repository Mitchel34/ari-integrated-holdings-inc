import Link from 'next/link';
import { getTreasurySnapshot } from '@/lib/treasury/snapshot';
import styles from './TreasurySnapshot.module.css';

interface TreasurySnapshotProps {
    withDisclosureLink?: boolean;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    signDisplay: 'always',
});

const unitFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
});

function formatAsOf(asOfIso: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    }).format(new Date(asOfIso));
}

export function TreasurySnapshot({ withDisclosureLink = false }: TreasurySnapshotProps) {
    const snapshot = getTreasurySnapshot();
    const premiumClassName = snapshot.totals.mnavPremiumPct >= 0 ? styles.metricValuePositive : styles.metricValueNegative;

    return (
        <article className={styles.wrapper} aria-label="Treasury snapshot">
            <div className={styles.header}>
                <div>
                    <p className={styles.headerLabel}>Data Timestamp</p>
                    <p className={styles.headerValue}>{formatAsOf(snapshot.asOfIso)}</p>
                </div>
                <div>
                    <p className={styles.headerLabel}>Shares Outstanding</p>
                    <p className={styles.headerValue}>{unitFormatter.format(snapshot.sharesOutstanding)}</p>
                </div>
            </div>

            <div className={styles.metrics}>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Market Value</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.marketValueUsd)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Cost Basis</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.costBasisUsd)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Net Asset Value</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.netAssetValueUsd)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>mNAV Premium / Discount</p>
                    <p className={`${styles.metricValue} ${premiumClassName}`.trim()}>
                        {percentFormatter.format(snapshot.totals.mnavPremiumPct)}%
                    </p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Implied Market Cap</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.marketCapUsd)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>NAV / Share</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.navPerShareUsd)}</p>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">Asset</th>
                            <th scope="col">Units</th>
                            <th scope="col">Spot Price</th>
                            <th scope="col">Market Value</th>
                            <th scope="col">Cost Basis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {snapshot.assets.map((asset) => (
                            <tr key={asset.symbol}>
                                <td>
                                    <span className={styles.assetSymbol}>{asset.symbol}</span>
                                    <span className={styles.assetName}>{asset.name}</span>
                                </td>
                                <td>{unitFormatter.format(asset.units)}</td>
                                <td>{currencyFormatter.format(asset.spotPriceUsd)}</td>
                                <td>{currencyFormatter.format(asset.marketValueUsd)}</td>
                                <td>{currencyFormatter.format(asset.costBasisUsd)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.footer}>
                <p className={styles.note}>
                    Treasury values are updated for investor communications and subject to change with market conditions.
                </p>
                {withDisclosureLink ? (
                    <Link href="/disclosures" className={styles.link}>
                        View all disclosures
                    </Link>
                ) : null}
            </div>
        </article>
    );
}
