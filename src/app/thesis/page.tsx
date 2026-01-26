import { Container } from '../../components/ui/Container';
import styles from '../page.module.css'; // Reusing home styles for consistency

export default function ThesisPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Investment Thesis</h1>
                <p>Digital Assets as Strategic Long-Term Holdings</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.textBlock}>
                    <h2>Executive Summary</h2>
                    <p>
                        Ari Integrated Holdings Inc. is a Nevada-based, AI-enabled crypto treasury company
                        focused on long-term capital appreciation through the accumulation and holding of
                        Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). The Company operates as a balance-sheet
                        treasury vehicle, emphasizing disciplined buy-and-hold exposure rather than speculative
                        trading.
                    </p>
                    <p>
                        Operational trading is intentionally limited to a supporting subsidiary (Harmony Trading App)
                        intended to generate modest revenue and offset operating costs. AI is used as a decision-support
                        layer for risk analysis, capital allocation timing, and scenario stress testing, with human
                        oversight remaining central to all investment decisions.
                    </p>
                </div>

                <div className={styles.textBlock}>
                    <h2>The Case for Digital Assets</h2>
                    <p>
                        Ari Integrated Holdings Inc. is founded on the conviction that Bitcoin, Ethereum, and Solana
                        are not only high-potential investments but also strategic reserve assets in an increasingly
                        digital financial system.
                    </p>
                    <h3>Scarcity & Long-Term Appreciation</h3>
                    <p>
                        Bitcoin’s hard-capped supply of 21 million and Ethereum’s role in decentralized finance
                        support a long-term investment thesis. Outcomes are uncertain and dependent on adoption,
                        regulatory shifts, and market structure.
                    </p>
                    <h3>Inflation Hedge & Diversification</h3>
                    <p>
                        In a world of monetary expansion, digital assets can serve as a potential hedge against
                        currency devaluation and provide diversification from traditional asset classes.
                    </p>
                </div>

                <div className={styles.textBlock}>
                    <h2>Why These Assets?</h2>
                    <ul>
                        <li><strong>Bitcoin (BTC):</strong> Scarcity-driven asset with long-term appreciation potential.</li>
                        <li><strong>Ethereum (ETH):</strong> Utility layer for programmable finance and decentralized applications.</li>
                        <li><strong>Solana (SOL):</strong> High-performance infrastructure for scalable blockchain adoption.</li>
                    </ul>
                </div>

                <div className={styles.textBlock}>
                    <h2>Core Business Model</h2>
                    <ul>
                        <li><strong>Buy-and-hold treasury:</strong> Capital is deployed primarily into BTC, ETH, and SOL holdings.</li>
                        <li><strong>Lean operations:</strong> A minimal operating footprint keeps overhead low and capital focused.</li>
                        <li><strong>Investor transparency:</strong> Regular updates on holdings and treasury value.</li>
                        <li><strong>Regulated exposure:</strong> Equity ownership provides a compliant pathway to crypto markets.</li>
                    </ul>
                </div>

                <div className={styles.textBlock}>
                    <h2>Role of Artificial Intelligence</h2>
                    <ul>
                        <li><strong>Decision support:</strong> AI informs, but does not replace, management judgment.</li>
                        <li><strong>Risk analysis:</strong> Scenario stress testing and volatility forecasting guide posture.</li>
                        <li><strong>Capital allocation:</strong> Timing and sizing insights for BTC, ETH, and SOL deployments.</li>
                        <li><strong>Operational visibility:</strong> Consolidated reporting across custodians and exchanges.</li>
                    </ul>
                </div>

                <div className={styles.textBlock}>
                    <h2>Harmony Trading App</h2>
                    <ul>
                        <li><strong>Supporting subsidiary:</strong> Designed to generate modest revenue and offset costs.</li>
                        <li><strong>Limited scope:</strong> Small allocation with strict risk controls to protect core holdings.</li>
                        <li><strong>AI sandbox:</strong> Testing ground for analytics that inform treasury decisions.</li>
                    </ul>
                </div>

                <div className={styles.textBlock}>
                    <h2>Risk Management & Governance</h2>
                    <p>
                        The Company prioritizes asset security, compliance, and governance. Custody is intended to
                        leverage institutional-grade providers, and internal controls are designed to safeguard
                        shareholder value. Regulatory and legal positioning will be finalized prior to any formal
                        public offering.
                    </p>
                </div>
            </div>

            <div className={styles.disclaimer} role="note">
                <strong>Disclosure:</strong> This content is for informational purposes only and does not constitute
                investment advice. Digital assets are volatile and can experience rapid, significant losses.
                Past performance is not indicative of future results.
            </div>
        </Container>
    );
}
