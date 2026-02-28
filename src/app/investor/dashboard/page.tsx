import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { getInvestorDocuments, getInvestorEvents } from '@/lib/investor/disclosures';
import { Container } from '../../../components/ui/Container';
import { MeetingTypeSelector } from '../../../components/scheduling/MeetingTypeSelector';
import styles from './page.module.css';

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    createdAt?: string;
}

function formatUsd(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso));
}

function formatEventDate(iso: string) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    }).format(new Date(iso));
}

export default async function InvestorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/investor/dashboard');
    }

    const user = session.user as ExtendedUser;
    const snapshot = getTreasurySnapshot();
    const documents = getInvestorDocuments();
    const events = getInvestorEvents();
    const nextEvent = events[0];

    const navPct = snapshot.totals.mnavPremiumPct;
    const navColor = navPct >= 0 ? '#4ade80' : '#f87171';

    return (
        <div className={styles.dashboardPage}>
            <Container className={styles.dashboardContainer}>

                {/* Welcome card */}
                <div className={styles.welcomeCard}>
                    <div className={styles.welcomeHeader}>
                        <div className={styles.avatarLarge}>
                            {user?.name?.charAt(0) || 'I'}
                        </div>
                        <div className={styles.welcomeText}>
                            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Investor'}</h1>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Treasury stat cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Treasury NAV</span>
                            <span className={styles.statValue}>{formatUsd(snapshot.totals.netAssetValueUsd)}</span>
                            <span className={styles.statSub} style={{ color: navColor }}>
                                mNAV {snapshot.totals.mnavRatio.toFixed(2)}x ({navPct >= 0 ? '+' : ''}{navPct.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                <circle cx="12" cy="12" r="1" fill="currentColor" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>NAV per Share</span>
                            <span className={styles.statValue}>{formatUsd(snapshot.totals.navPerShareUsd)}</span>
                            <span className={styles.statSub}>{snapshot.sharesOutstanding.toLocaleString()} shares outstanding</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Next Event</span>
                            {nextEvent ? (
                                <>
                                    <span className={styles.statValue} style={{ fontSize: '1rem' }}>{nextEvent.title}</span>
                                    <span className={styles.statSub}>{formatEventDate(nextEvent.startsAtIso)}</span>
                                </>
                            ) : (
                                <span className={styles.statValue} style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                                    No upcoming events
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Holdings breakdown */}
                <div className={styles.panelSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Treasury Holdings</h2>
                        <p>As of {formatDate(snapshot.asOfIso)} · Target allocation 50% BTC / 30% ETH / 20% SOL</p>
                    </div>
                    <div className={styles.holdingsGrid}>
                        {snapshot.assets.map((asset) => (
                            <div key={asset.symbol} className={styles.holdingCard}>
                                <div className={styles.holdingSymbol}>{asset.symbol}</div>
                                <div className={styles.holdingDetails}>
                                    <div className={styles.holdingRow}>
                                        <span>Units</span>
                                        <strong>{asset.units.toLocaleString()}</strong>
                                    </div>
                                    <div className={styles.holdingRow}>
                                        <span>Spot price</span>
                                        <strong>{formatUsd(asset.spotPriceUsd)}</strong>
                                    </div>
                                    <div className={styles.holdingRow}>
                                        <span>Market value</span>
                                        <strong>{formatUsd(asset.marketValueUsd)}</strong>
                                    </div>
                                    <div className={styles.holdingRow}>
                                        <span>Unrealized P&L</span>
                                        <strong style={{ color: asset.unrealizedPnlUsd >= 0 ? '#4ade80' : '#f87171' }}>
                                            {asset.unrealizedPnlUsd >= 0 ? '+' : ''}{formatUsd(asset.unrealizedPnlUsd)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Document vault */}
                <div className={styles.panelSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Document Vault</h2>
                        <p>Investor documents, disclosures, and governance materials</p>
                    </div>
                    <div className={styles.docList}>
                        {documents.map((doc) => (
                            <a key={doc.id} href={doc.href} className={styles.docRow} target={doc.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                                <div className={styles.docIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14,2 14,8 20,8" />
                                    </svg>
                                </div>
                                <div className={styles.docInfo}>
                                    <span className={styles.docTitle}>{doc.title}</span>
                                    <span className={styles.docMeta}>{doc.type} · {formatDate(doc.dateIso)}</span>
                                </div>
                                <svg className={styles.docArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Schedule a meeting */}
                <div className={styles.panelSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Schedule a Meeting</h2>
                        <p>Book time directly with the ARI leadership team</p>
                    </div>
                    <div className={styles.schedulingWrapper}>
                        <MeetingTypeSelector />
                    </div>
                </div>

            </Container>
        </div>
    );
}
