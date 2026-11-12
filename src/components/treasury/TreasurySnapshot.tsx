import Link from 'next/link';
import { getTreasurySnapshot } from '@/lib/treasury/snapshot';
import styles from './TreasurySnapshot.module.css';

interface TreasurySnapshotProps {
    withDisclosureLink?: boolean;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const sharesFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
});

export function TreasurySnapshot({ withDisclosureLink = false }: TreasurySnapshotProps) {
    const snapshot = getTreasurySnapshot();
    const pnlClassName = snapshot.totals.unrealizedPnlUsd >= 0 ? styles.metricValuePositive : styles.metricValueNegative;

    return (
        <article className={styles.wrapper} aria-label="Treasury snapshot">
            <div className={styles.header}>
                <div>
                    <p className={styles.headerLabel}>As Of</p>
                    <p className={styles.headerValue}>{snapshot.asOfDate}</p>
                </div>
                <div>
                    <p className={styles.headerLabel}>Shares Outstanding</p>
                    <p className={styles.headerValue}>{sharesFormatter.format(snapshot.sharesOutstanding)}</p>
                </div>
            </div>

            <div className={styles.metrics}>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Total Assets</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.totalAssets)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Capital Investments</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.capitalInvestments)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Cash Positions</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.cash.total)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Unrealized P&L</p>
                    <p className={`${styles.metricValue} ${pnlClassName}`.trim()}>
                        {snapshot.totals.unrealizedPnlUsd >= 0 ? '+' : ''}{currencyFormatter.format(snapshot.totals.unrealizedPnlUsd)}
                    </p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>NAV / Share</p>
                    <p className={styles.metricValue}>${snapshot.totals.navPerShareUsd.toFixed(4)}</p>
                </div>
                <div className={styles.metric}>
                    <p className={styles.metricLabel}>Shareholder Equity</p>
                    <p className={styles.metricValue}>{currencyFormatter.format(snapshot.totals.shareholderEquity)}</p>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <caption className={styles.caption}>ETF Holdings — {snapshot.asOfDate}</caption>
                    <thead>
                        <tr>
                            <th scope="col">ETF</th>
                            <th scope="col">Shares</th>
                            <th scope="col">Price</th>
                            <th scope="col">Market Value</th>
                            <th scope="col">Cost Basis</th>
                            <th scope="col">P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {snapshot.holdings.map((holding) => (
                            <tr key={holding.symbol}>
                                <td data-label="ETF">
                                    <span className={styles.assetSymbol}>{holding.symbol}</span>
                                    <span className={styles.assetName}>{holding.name}</span>
                                </td>
                                <td data-label="Shares">{holding.shares}</td>
                                <td data-label="Price">{currencyFormatter.format(holding.currentPricePerShare)}</td>
                                <td data-label="Market Value">{currencyFormatter.format(holding.marketValueUsd)}</td>
                                <td data-label="Cost Basis">{currencyFormatter.format(holding.costBasisUsd)}</td>
                                <td data-label="P&L" className={holding.unrealizedPnlUsd >= 0 ? styles.metricValuePositive : styles.metricValueNegative}>
                                    {holding.unrealizedPnlUsd >= 0 ? '+' : ''}{currencyFormatter.format(holding.unrealizedPnlUsd)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.footer}>
                <p className={styles.note}>
                    Treasury values are updated from CFO financial reports. Data as of {snapshot.asOfDate}.
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
