import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import styles from '../page.module.css';

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

        <Container className={styles.section}>
            <div className={styles.grid}>
                <Card variant="glass">
                    <span className={styles.heroEyebrow}>01</span>
                    <h2>Target Allocation</h2>
                    <p><strong>50% BTC / 30% ETH / 20% SOL</strong></p>
                    <p>
                        This target structure is designed for long-duration treasury construction,
                        emphasizing discipline across market cycles instead of reactive allocation changes.
                    </p>
                </Card>

                <Card variant="glass">
                    <span className={styles.heroEyebrow}>02</span>
                    <h2>Why This Mix</h2>
                    <ul>
                        <li><strong>BTC:</strong> Monetary core with the lowest protocol risk and deepest liquidity.</li>
                        <li><strong>ETH:</strong> Programmable settlement layer with institutional finance relevance.</li>
                        <li><strong>SOL:</strong> High-throughput execution exposure with AI-adjacent optionality.</li>
                    </ul>
                </Card>

                <Card variant="glass">
                    <span className={styles.heroEyebrow}>03</span>
                    <h2>Portfolio Construction Lens</h2>
                    <p>
                        With BTC, ETH, and SOL, allocation is not only about percentage weights. It is about
                        volatility hierarchy, correlation structure, and asymmetric payoff potential.
                    </p>
                    <ul>
                        <li><strong>BTC:</strong> Monetary asset and digital collateral layer.</li>
                        <li><strong>ETH:</strong> Settlement and programmable finance layer.</li>
                        <li><strong>SOL:</strong> High-beta, high-volatility execution layer.</li>
                    </ul>
                </Card>

                <Card variant="glass">
                    <span className={styles.heroEyebrow}>04</span>
                    <h2>Why It Works</h2>
                    <ul>
                        <li>BTC anchors the portfolio and dampens relative protocol risk.</li>
                        <li>ETH contributes utility exposure and potential staking-driven return support.</li>
                        <li>SOL offers growth convexity if high-throughput chains win AI, gaming, and consumer rails.</li>
                        <li>The blend seeks asymmetric upside without becoming a single high-beta bet.</li>
                    </ul>
                </Card>

                <Card variant="glass">
                    <span className={styles.heroEyebrow}>05</span>
                    <h2>Risk Profile</h2>
                    <ul>
                        <li>Expected drawdowns are moderate-to-high in absolute terms because this is crypto.</li>
                        <li>Upside capture can be strong during sustained bull cycles.</li>
                        <li>Volatility is targeted to remain acceptable relative to expected long-term return.</li>
                    </ul>
                </Card>

                <Card variant="glass">
                    <span className={styles.heroEyebrow}>06</span>
                    <h2>Illustrative 5-Year CAGR Analysis</h2>
                    <p>
                        A disciplined illustrative analysis for the 50/30/20 BTC-ETH-SOL basket over approximately
                        Apr 2020 to Mar 2025, using public historical return estimates:
                    </p>
                    <ul>
                        <li>BTC: ~59% CAGR</li>
                        <li>ETH: ~55% CAGR</li>
                        <li>SOL: ~123% CAGR</li>
                        <li>Blended 50/30/20 basket: roughly ~70% annualized over that period</li>
                    </ul>
                    <p>
                        These figures are approximate and for illustrative context only. They are not financial advice.
                    </p>
                </Card>

                <Card variant="glass">
                    <span className={styles.heroEyebrow}>07</span>
                    <h2>Why Not 10-Year CAGR Yet</h2>
                    <ul>
                        <li>Bitcoin launched in 2009, Ethereum in 2015, and Solana in 2020.</li>
                        <li>SOL does not have a full 10-year price history.</li>
                        <li>Early ETH data is limited versus mature public market datasets.</li>
                        <li>A uniform 10-year CAGR comparison across all three assets is not statistically robust yet.</li>
                    </ul>
                </Card>
            </div>

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
        </Container>
        </>
    );
}
