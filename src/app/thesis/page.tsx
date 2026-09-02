import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Info, X } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AssetChip } from '@/components/brand/AssetChip';
import { AllocationRing } from '@/components/brand/AllocationRing';
import { ThesisSection } from '@/components/thesis/ThesisSection';
import { ALLOCATION, CONTACT } from '@/lib/site';
import styles from './thesis.module.css';

export const metadata: Metadata = {
    title: 'Investment Thesis',
    description:
        'A ten-year, disciplined treasury approach to long-term digital asset holdings: the 50 / 30 / 20 BTC, ETH, and SOL framework, why it works, its risk profile, and an illustrative 5-year CAGR analysis.',
    alternates: { canonical: '/thesis' },
};

const SECTIONS = [
    { id: 'target-allocation', title: 'Target allocation' },
    { id: 'why-this-mix', title: 'Why this mix' },
    { id: 'construction-lens', title: 'Portfolio construction lens' },
    { id: 'why-it-works', title: 'Why it works' },
    { id: 'risk-profile', title: 'Risk profile' },
    { id: 'cagr-analysis', title: 'Illustrative 5-year CAGR analysis' },
    { id: 'ten-year-cagr', title: 'Why not 10-year CAGR yet' },
] as const;

const CAGR_ROWS = [
    { symbol: 'BTC', label: 'Bitcoin', cagr: '~59%' },
    { symbol: 'ETH', label: 'Ethereum', cagr: '~55%' },
    { symbol: 'SOL', label: 'Solana', cagr: '~123%' },
] as const;

const RAIL_CLASS: Record<string, string> = {
    BTC: styles.railBtc,
    ETH: styles.railEth,
    SOL: styles.railSol,
};

const [emailLocal, emailDomain] = CONTACT.email.split('@');

export default function ThesisPage() {
    return (
        <>
            <PageHero
                eyebrow="Treasury strategy"
                title="Investment Thesis"
                lead="A ten-year, disciplined treasury approach to long-term digital asset holdings."
                meta={
                    <>
                        <span>Last reviewed 1 Mar 2026</span>
                        <span aria-hidden="true">·</span>
                        <span>Not investment advice</span>
                    </>
                }
            />

            <Section flush className={styles.allocationSection} aria-labelledby="allocation-title">
                <Card variant="elevated" as="article" className={styles.allocationCard}>
                    <div className={styles.allocationGrid}>
                        <div className={styles.ringCol}>
                            <AllocationRing
                                size={260}
                                label="50 / 30 / 20"
                                sublabel="Target allocation"
                                ariaLabel="Target allocation ring: Bitcoin 50 percent, Ethereum 30 percent, Solana 20 percent"
                            />
                            <p className={styles.ringCaption}>Target weights, not live holdings.</p>
                        </div>

                        <div className={styles.tableCol}>
                            <p className="eyebrow">Allocation framework</p>
                            <h2 id="allocation-title" className={styles.allocationTitle}>
                                Three assets, one discipline
                            </h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.rationaleTable}>
                                    <caption className="sr-only">
                                        Target allocation by asset: target weight, role in the portfolio, and ETF wrapper
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Asset</th>
                                            <th scope="col" className={styles.num}>Target</th>
                                            <th scope="col">Role in portfolio</th>
                                            <th scope="col">ETF wrapper</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ALLOCATION.map((asset) => (
                                            <tr key={asset.symbol} className={RAIL_CLASS[asset.symbol]}>
                                                <th scope="row">
                                                    <span className={styles.assetCell}>
                                                        <AssetChip symbol={asset.symbol} />
                                                        <span className={styles.assetName}>{asset.name}</span>
                                                    </span>
                                                </th>
                                                <td className={`${styles.num} mono`}>{asset.weight}%</td>
                                                <td>
                                                    <span className={styles.role}>{asset.role}</span>
                                                    <span className={styles.roleSub}>{asset.summary}</span>
                                                </td>
                                                <td>
                                                    <span className={styles.etfCell}>
                                                        <AssetChip symbol={asset.etf} />
                                                        <span className={styles.etfName}>{asset.etfName}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <ul className={styles.stackList} aria-label="Target allocation by asset">
                                {ALLOCATION.map((asset) => (
                                    <li key={asset.symbol} className={`${styles.stackItem} ${RAIL_CLASS[asset.symbol]}`}>
                                        <div className={styles.stackHead}>
                                            <span className={styles.assetCell}>
                                                <AssetChip symbol={asset.symbol} />
                                                <span className={styles.assetName}>{asset.name}</span>
                                            </span>
                                            <span className={`${styles.stackWeight} mono`}>{asset.weight}%</span>
                                        </div>
                                        <span className={styles.role}>{asset.role}</span>
                                        <span className={styles.roleSub}>{asset.summary}</span>
                                        <span className={styles.etfCell}>
                                            <AssetChip symbol={asset.etf} />
                                            <span className={styles.etfName}>{asset.etfName}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>

                <nav className={styles.jump} aria-label="Thesis sections">
                    {SECTIONS.map((section, index) => (
                        <a key={section.id} href={`#${section.id}`} className={`${styles.jumpLink} mono`}>
                            <span className={styles.jumpIdx}>{String(index + 1).padStart(2, '0')}</span>
                            <span>{section.title}</span>
                        </a>
                    ))}
                </nav>
            </Section>

            <Section narrow hairline aria-label="Thesis">
                <div className={styles.reading}>
                    <ThesisSection index={1} id="target-allocation" title="Target allocation">
                        <p className={`${styles.weights} mono`}>50% BTC / 30% ETH / 20% SOL</p>
                        <p>
                            This target structure is designed for long-duration treasury construction, emphasizing
                            discipline across market cycles instead of reactive allocation changes.
                        </p>
                    </ThesisSection>

                    <ThesisSection index={2} id="why-this-mix" title="Why this mix">
                        <ul className={styles.assetList}>
                            <li>
                                <AssetChip symbol="BTC" />
                                <span>Monetary core with the lowest protocol risk and deepest liquidity.</span>
                            </li>
                            <li>
                                <AssetChip symbol="ETH" />
                                <span>Programmable settlement layer with institutional finance relevance.</span>
                            </li>
                            <li>
                                <AssetChip symbol="SOL" />
                                <span>High-throughput execution exposure with AI-adjacent optionality.</span>
                            </li>
                        </ul>
                    </ThesisSection>

                    <ThesisSection
                        index={3}
                        id="construction-lens"
                        title="Portfolio construction lens"
                        lead="With BTC, ETH, and SOL, allocation is not only about percentage weights. It is about volatility hierarchy, correlation structure, and asymmetric payoff potential."
                    >
                        <ul className={styles.assetList}>
                            <li>
                                <AssetChip symbol="BTC" />
                                <span>Monetary asset and digital collateral layer.</span>
                            </li>
                            <li>
                                <AssetChip symbol="ETH" />
                                <span>Settlement and programmable finance layer.</span>
                            </li>
                            <li>
                                <AssetChip symbol="SOL" />
                                <span>High-beta, high-volatility execution layer.</span>
                            </li>
                        </ul>
                    </ThesisSection>

                    <ThesisSection index={4} id="why-it-works" title="Why it works">
                        <ul>
                            <li>BTC anchors the portfolio and dampens relative protocol risk.</li>
                            <li>ETH contributes utility exposure and potential staking-driven return support.</li>
                            <li>SOL offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.</li>
                            <li>The blend seeks asymmetric upside without becoming a single high-beta bet.</li>
                        </ul>
                    </ThesisSection>

                    <ThesisSection index={5} id="risk-profile" title="Risk profile">
                        <div className={styles.riskGrid}>
                            <Card variant="subtle" padding="sm" className={styles.riskCol} as="section" aria-labelledby="risk-accept">
                                <h3 id="risk-accept" className={styles.riskTitle}>
                                    <span className={`${styles.riskIcon} ${styles.riskIconAccept}`} aria-hidden="true">
                                        <Check size={16} strokeWidth={2} />
                                    </span>
                                    What we accept
                                </h3>
                                <ul className={styles.riskList}>
                                    <li>Expected drawdowns that are moderate-to-high in absolute terms, because this is crypto.</li>
                                    <li>Upside capture that can be strong during sustained bull cycles.</li>
                                    <li>Volatility that remains acceptable relative to expected long-term return.</li>
                                </ul>
                            </Card>
                            <Card variant="subtle" padding="sm" className={styles.riskCol} as="section" aria-labelledby="risk-avoid">
                                <h3 id="risk-avoid" className={styles.riskTitle}>
                                    <span className={`${styles.riskIcon} ${styles.riskIconAvoid}`} aria-hidden="true">
                                        <X size={16} strokeWidth={2} />
                                    </span>
                                    What we avoid
                                </h3>
                                <ul className={styles.riskList}>
                                    <li>Volatility that is not acceptable relative to expected long-term return.</li>
                                    <li>Becoming a single high-beta bet.</li>
                                    <li>Reactive allocation changes across market cycles.</li>
                                </ul>
                            </Card>
                        </div>
                    </ThesisSection>

                    <ThesisSection
                        index={6}
                        id="cagr-analysis"
                        title="Illustrative 5-year CAGR analysis"
                        lead="A disciplined illustrative analysis for the 50/30/20 BTC-ETH-SOL basket over approximately Apr 2020 to Mar 2025, using public historical return estimates."
                    >
                        <div className={styles.tableWrap}>
                            <table className={styles.cagrTable}>
                                <caption className="sr-only">
                                    Approximate compound annual growth rate by asset, April 2020 to March 2025
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Asset</th>
                                        <th scope="col" className={styles.num}>5-yr CAGR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CAGR_ROWS.map((row) => (
                                        <tr key={row.symbol}>
                                            <th scope="row">
                                                <span className={styles.assetCell}>
                                                    <AssetChip symbol={row.symbol} />
                                                    <span className={styles.assetName}>{row.label}</span>
                                                </span>
                                            </th>
                                            <td className={`${styles.num} mono`}>{row.cagr}</td>
                                        </tr>
                                    ))}
                                    <tr className={styles.blendRow}>
                                        <th scope="row">
                                            <span className={styles.assetCell}>
                                                <AssetChip tone="gold">50 / 30 / 20</AssetChip>
                                                <span className={styles.assetName}>Blended basket</span>
                                            </span>
                                        </th>
                                        <td className={`${styles.num} mono`}>~70%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className={`${styles.tableNote} mono`}>
                            Period 2020-04 to 2025-03 (approx.) · Source: public historical return estimates · Blended figure is annualized
                        </p>
                        <p>These figures are approximate and for illustrative context only. They are not financial advice.</p>
                    </ThesisSection>

                    <ThesisSection index={7} id="ten-year-cagr" title="Why not 10-year CAGR yet">
                        <ul>
                            <li>Bitcoin launched in 2009, Ethereum in 2015, and Solana in 2020.</li>
                            <li>SOL does not have a full 10-year price history.</li>
                            <li>Early ETH data is limited versus mature public market datasets.</li>
                            <li>A uniform 10-year CAGR comparison across all three assets is not statistically robust yet.</li>
                        </ul>
                    </ThesisSection>
                </div>
            </Section>

            <Section narrow flush aria-labelledby="disclosure-title">
                <Card variant="subtle" accent="gold" as="aside" className={styles.callout} aria-labelledby="disclosure-title">
                    <div className={styles.calloutHead}>
                        <span className={styles.calloutIcon} aria-hidden="true">
                            <Info size={18} strokeWidth={1.75} />
                        </span>
                        <h2 id="disclosure-title" className={styles.calloutTitle}>
                            Performance &amp; Volatility Disclosure
                        </h2>
                    </div>
                    <p className={styles.calloutText}>
                        Past performance is not indicative of future results. Historical returns, including compounded
                        annual growth rates, reflect specific market conditions, liquidity environments, regulatory
                        frameworks, and adoption phases that may not recur. Digital asset markets remain inherently
                        volatile, and forward returns may differ materially from prior periods. As the asset class
                        matures, institutional participation, infrastructure quality, regulatory clarity, and liquidity
                        depth may reduce volatility over time, but there is no assurance this will occur in a linear or
                        permanent manner. Structural shifts, macroeconomic shocks, technological risks, and regulatory
                        developments may continue to produce significant price fluctuations. Investors should evaluate
                        digital asset allocations in the context of long-term goals, liquidity needs, and tolerance for
                        substantial interim drawdowns.
                    </p>
                </Card>
            </Section>

            <Section narrow hairline compact aria-labelledby="cta-title">
                <div className={styles.cta}>
                    <p className="eyebrow">Next</p>
                    <h2 id="cta-title" className={styles.ctaTitle}>Read the disclosures, then talk to us</h2>
                    <p className={styles.ctaLead}>
                        The investor portal holds the current treasury snapshot and disclosures. Questions about the
                        thesis are welcome.
                    </p>
                    <div className={styles.ctaActions}>
                        <Button asChild variant="primary">
                            <Link href="/investors">
                                Investor portal
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/contact">Contact the CTO</Link>
                        </Button>
                    </div>
                    <p className={styles.ctaNote}>
                        All correspondence is routed to {CONTACT.name}, {CONTACT.title}, at{' '}
                        <a href={CONTACT.mailto} className={`${styles.mail} mono`}>
                            {emailLocal}@<wbr />{emailDomain}
                        </a>
                        .
                    </p>
                </div>
            </Section>
        </>
    );
}
