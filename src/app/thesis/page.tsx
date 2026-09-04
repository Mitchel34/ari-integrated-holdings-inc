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
import { ALLOCATION, type AssetSymbol } from '@/lib/site';
import styles from './thesis.module.css';

export const metadata: Metadata = {
    title: 'Investment Thesis',
    description:
        'A ten-year, disciplined treasury approach to long-term digital asset holdings: the 50 / 30 / 20 BTC, ETH, and SOL framework, why it works, its risk profile, and how each asset is evaluated.',
    alternates: { canonical: '/thesis' },
};

const SECTIONS = [
    { id: 'target-allocation', title: 'Target allocation' },
    { id: 'why-this-mix', title: 'Why this mix' },
    { id: 'construction-lens', title: 'Portfolio construction lens' },
    { id: 'why-it-works', title: 'Why it works' },
    { id: 'risk-profile', title: 'Risk profile' },
    { id: 'evaluation-criteria', title: 'How each asset is evaluated' },
] as const;

interface Criterion {
    id: string;
    title: string;
    summary: string;
    assets: Record<AssetSymbol, string>;
}

/** Qualitative evaluation criteria. Strategy and process only; no figures or performance claims. */
const CRITERIA: Criterion[] = [
    {
        id: 'liquidity',
        title: 'Liquidity',
        summary: 'Can the position be built or reduced through regulated vehicles without moving the market or waiting on it?',
        assets: {
            BTC: 'The deepest and most mature market of the three; treated as the reference standard for liquidity.',
            ETH: 'Broad, institutionally supported liquidity; assessed alongside the maturity of its ETF market.',
            SOL: 'Liquidity is developing and monitored closely; position size is kept consistent with what the market can absorb.',
        },
    },
    {
        id: 'volatility',
        title: 'Volatility',
        summary: 'Are expected price swings acceptable relative to the long-term return the asset is held for?',
        assets: {
            BTC: 'Volatile in absolute terms but the least volatile of the three; sized as the anchor that steadies the whole.',
            ETH: 'Moderate-to-high volatility, weighed against its role as a settlement layer with structural utility.',
            SOL: 'The highest-beta asset in the framework; its weight is deliberately the smallest to keep drawdowns bounded.',
        },
    },
    {
        id: 'custody',
        title: 'Custody structure',
        summary: 'How is exposure held, and who is responsible for safeguarding the underlying asset?',
        assets: {
            BTC: 'Held through a regulated spot ETF (ARKB), with custody handled by the fund’s qualified custodian rather than by Ari.',
            ETH: 'Held through a regulated spot ETF (FETH), which removes key management and staking-operations risk from Ari’s balance sheet.',
            SOL: 'Held through a regulated spot ETF (FSOL); the wrapper’s custody arrangements and track record are part of the ongoing review.',
        },
    },
    {
        id: 'concentration',
        title: 'Concentration',
        summary: 'Does any single asset, protocol, or wrapper dominate the balance sheet or share a hidden point of failure?',
        assets: {
            BTC: 'The largest target weight by design; its dominance is reviewed so the treasury does not become a single-asset position.',
            ETH: 'A meaningful second position that diversifies protocol and use-case exposure away from Bitcoin alone.',
            SOL: 'A bounded satellite position; concentration in one execution layer is limited by its lower target weight.',
        },
    },
    {
        id: 'governance',
        title: 'Governance',
        summary: 'How are protocol changes decided, and how does the ETF sponsor govern the vehicle that holds the exposure?',
        assets: {
            BTC: 'Conservative, slow-moving protocol governance with a long track record; the lowest protocol-change risk of the three.',
            ETH: 'Active, well-documented governance with a clear upgrade process; monitored for changes that affect the settlement layer.',
            SOL: 'Younger governance and a more concentrated developer base; assessed continuously as part of the risk review.',
        },
    },
];

const RAIL_CLASS: Record<string, string> = {
    BTC: styles.railBtc,
    ETH: styles.railEth,
    SOL: styles.railSol,
};

export default function ThesisPage() {
    return (
        <>
            <PageHero
                eyebrow="Treasury strategy"
                title="Investment Thesis"
                lead="A ten-year, disciplined treasury approach to long-term digital asset holdings."
                meta={<span>Not investment advice</span>}
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
                        id="evaluation-criteria"
                        title="How each asset is evaluated"
                        lead="Every asset in the framework is reviewed against the same five criteria. The review is qualitative and ongoing; it informs target weights and is revisited by the board and executive team rather than by a formula."
                    >
                        <ol className={styles.criteria} aria-label="Evaluation criteria">
                            {CRITERIA.map((criterion) => (
                                <li key={criterion.id} className={styles.criterion} id={`criterion-${criterion.id}`}>
                                    <h3 className={styles.criterionTitle}>{criterion.title}</h3>
                                    <p className={styles.criterionSummary}>{criterion.summary}</p>
                                    <ul className={styles.assetList}>
                                        {ALLOCATION.map((asset) => (
                                            <li key={asset.symbol}>
                                                <AssetChip symbol={asset.symbol} />
                                                <span>{criterion.assets[asset.symbol]}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ol>
                    </ThesisSection>
                </div>
            </Section>

            <Section narrow flush>
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
                    <h2 id="cta-title" className={styles.ctaTitle}>Read the updates, then talk to us</h2>
                    <p className={styles.ctaLead}>
                        Company updates are published on the Investor Relations page; detailed treasury information is
                        available to verified investors through the secure portal.
                    </p>
                    <div className={styles.ctaActions}>
                        <Button asChild variant="primary">
                            <Link href="/investors">
                                Investor Relations
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/contact">Contact us</Link>
                        </Button>
                    </div>
                </div>
            </Section>
        </>
    );
}
