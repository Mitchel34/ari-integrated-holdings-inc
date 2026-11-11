import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { AllocationRing } from '../../components/allocation/AllocationRing';
import { BasketMixer } from '../../components/thesis/BasketMixer';
import { ThesisRail, type ThesisChapter } from '../../components/thesis/ThesisRail';
import { TARGET_ASSETS } from '@/lib/allocation';
import styles from '../page.module.css';
import thesis from './thesis.module.css';

const CHAPTERS: ThesisChapter[] = [
    { id: 'target-allocation', num: '01', title: 'Target Allocation' },
    { id: 'why-this-mix', num: '02', title: 'Why This Mix' },
    { id: 'construction-lens', num: '03', title: 'Portfolio Construction Lens' },
    { id: 'why-it-works', num: '04', title: 'Why It Works' },
    { id: 'risk-profile', num: '05', title: 'Risk Profile' },
    { id: 'cagr-analysis', num: '06', title: 'Illustrative 5-Year CAGR Analysis' },
    { id: 'ten-year-history', num: '07', title: 'Why Not 10-Year CAGR Yet' },
];

const BLENDED_CAGR_PCT = 70;
const CAGR_SCALE_MAX = Math.max(...TARGET_ASSETS.map((asset) => asset.illustrativeCagrPct));

// Top of the stack is the most volatile layer; BTC is the base.
const LAYERS = [...TARGET_ASSETS].reverse();

function Chapter({ index, children }: { index: number; children: React.ReactNode }) {
    const chapter = CHAPTERS[index];
    return (
        <section id={chapter.id} className={thesis.chapter} aria-labelledby={`${chapter.id}-title`}>
            <header className={thesis.chapterHeader}>
                <p className={thesis.chapterNum}>{chapter.num}</p>
                <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
            </header>
            {children}
        </section>
    );
}

export default function ThesisPage() {
    return (
        <>
        <section className={styles.pageHeroSection}>
            <Container>
                <div className={styles.sectionHeader}>
                    <h1>Investment Thesis</h1>
                    <p>A 10-year disciplined treasury approach for long-term digital asset holdings.</p>
                </div>
            </Container>
        </section>

        <Container className={thesis.reader}>
            <ThesisRail chapters={CHAPTERS} />

            <div className={thesis.chapters}>
                <Chapter index={0}>
                    <p className={thesis.lead}>50% BTC / 30% ETH / 20% SOL</p>
                    <p>
                        This target structure is designed for long-duration treasury construction,
                        emphasizing discipline across market cycles instead of reactive allocation changes.
                    </p>
                    <div className={thesis.visual}>
                        <AllocationRing layout="split" />
                    </div>
                </Chapter>

                <Chapter index={1}>
                    <ul className={thesis.assetTiles}>
                        {TARGET_ASSETS.map((asset) => (
                            <li key={asset.key}>
                                <Link
                                    href={`/assets#${asset.key}`}
                                    className={thesis.assetTile}
                                    style={{ '--asset-color': asset.color } as React.CSSProperties}
                                >
                                    <span className={thesis.assetBadge} aria-hidden="true">{asset.glyph}</span>
                                    <span className={thesis.assetHead}>
                                        <strong>{asset.symbol}</strong>
                                        <span>{asset.targetPct}%</span>
                                    </span>
                                    <span className={thesis.assetText}>{asset.whyThisMix}</span>
                                    <span className={thesis.assetMore}>
                                        More on {asset.name}
                                        <ArrowRight aria-hidden="true" />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Chapter>

                <Chapter index={2}>
                    <p>
                        With BTC, ETH, and SOL, allocation is not only about percentage weights. It is about
                        volatility hierarchy, correlation structure, and asymmetric payoff potential.
                    </p>
                    <div className={thesis.visual}>
                        <p className={thesis.axisLabel}>Higher beta and volatility</p>
                        <ol className={thesis.layers}>
                            {LAYERS.map((asset) => (
                                <li
                                    key={asset.key}
                                    className={thesis.layer}
                                    style={{ '--asset-color': asset.color, '--layer-width': `${asset.targetPct * 2}%` } as React.CSSProperties}
                                >
                                    <span className={thesis.layerBarTrack}>
                                        <span className={thesis.layerBar}>
                                            {asset.symbol} {asset.targetPct}%
                                        </span>
                                    </span>
                                    <span className={thesis.layerText}>
                                        <strong>{asset.symbol}:</strong> {asset.layer}.
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <p className={thesis.axisLabel}>Monetary base and deepest liquidity</p>
                    </div>
                </Chapter>

                <Chapter index={3}>
                    <ul className={thesis.statements}>
                        <li>BTC anchors the portfolio and dampens relative protocol risk.</li>
                        <li>ETH contributes utility exposure and potential staking-driven return support.</li>
                        <li>SOL offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.</li>
                        <li>The blend seeks asymmetric upside without becoming a single high-beta bet.</li>
                    </ul>
                </Chapter>

                <Chapter index={4}>
                    <ul className={thesis.statements}>
                        <li>Expected drawdowns are moderate-to-high in absolute terms because this is crypto.</li>
                        <li>Upside capture can be strong during sustained bull cycles.</li>
                        <li>Volatility is targeted to remain acceptable relative to expected long-term return.</li>
                    </ul>
                </Chapter>

                <Chapter index={5}>
                    <p>
                        A disciplined illustrative analysis for the 50/30/20 BTC-ETH-SOL basket over approximately
                        Apr 2020 to Mar 2025, using public historical return estimates:
                    </p>
                    <div className={thesis.visual}>
                        <ul className={thesis.cagrBars} aria-label="Illustrative compound annual growth rates, April 2020 to March 2025">
                            {TARGET_ASSETS.map((asset) => (
                                <li key={asset.key} className={thesis.cagrRow}>
                                    <span className={thesis.cagrLabel}>{asset.symbol}</span>
                                    <span className={thesis.cagrTrack}>
                                        <span
                                            className={thesis.cagrBar}
                                            style={{
                                                width: `${(asset.illustrativeCagrPct / CAGR_SCALE_MAX) * 100}%`,
                                                background: asset.color,
                                            }}
                                        />
                                    </span>
                                    <span className={thesis.cagrValue}>~{asset.illustrativeCagrPct}%</span>
                                </li>
                            ))}
                            <li className={`${thesis.cagrRow} ${thesis.cagrRowBlend}`}>
                                <span className={thesis.cagrLabel}>50/30/20</span>
                                <span className={thesis.cagrTrack}>
                                    <span
                                        className={`${thesis.cagrBar} ${thesis.cagrBarBlend}`}
                                        style={{ width: `${(BLENDED_CAGR_PCT / CAGR_SCALE_MAX) * 100}%` }}
                                    />
                                </span>
                                <span className={thesis.cagrValue}>~{BLENDED_CAGR_PCT}%</span>
                            </li>
                        </ul>
                        <p className={thesis.visualNote}>
                            Blended 50/30/20 basket: roughly ~70% annualized over that period.
                        </p>
                    </div>
                    <p>
                        These figures are approximate and for illustrative context only. They are not financial advice.
                    </p>
                    <div className={thesis.visual}>
                        <BasketMixer />
                    </div>
                </Chapter>

                <Chapter index={6}>
                    <ul className={thesis.launches} aria-label="Launch years">
                        {TARGET_ASSETS.map((asset) => (
                            <li
                                key={asset.key}
                                className={thesis.launch}
                                style={{ '--asset-color': asset.color } as React.CSSProperties}
                            >
                                <span className={thesis.launchYear}>{asset.launchedYear}</span>
                                <span className={thesis.launchName}>{asset.name} launched</span>
                            </li>
                        ))}
                    </ul>
                    <ul className={thesis.statements}>
                        <li>Bitcoin launched in 2009, Ethereum in 2015, and Solana in 2020.</li>
                        <li>SOL does not have a full 10-year price history.</li>
                        <li>Early ETH data is limited versus mature public market datasets.</li>
                        <li>A uniform 10-year CAGR comparison across all three assets is not statistically robust yet.</li>
                    </ul>
                </Chapter>

                <div className={styles.disclaimer} role="note">
                    <strong>Performance &amp; Volatility Disclosure:</strong> Past performance is not indicative of future
                    results. Historical returns, including compounded annual growth rates, reflect specific market
                    conditions, liquidity environments, regulatory frameworks, and adoption phases that may not recur.
                    Digital asset markets remain inherently volatile, and forward returns may differ materially from prior
                    periods. As the asset class matures, institutional participation, infrastructure quality, regulatory
                    clarity, and liquidity depth may reduce volatility over time, but there is no assurance this will occur
                    in a linear or permanent manner. Structural shifts, macroeconomic shocks, technological risks, and
                    regulatory developments may continue to produce significant price fluctuations. Investors should evaluate
                    digital asset allocations in the context of long-term goals, liquidity needs, and tolerance for
                    substantial interim drawdowns.
                </div>
            </div>
        </Container>
        </>
    );
}
