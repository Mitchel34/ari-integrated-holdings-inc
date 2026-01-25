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
                    <h2>The Case for Digital Assets</h2>
                    <p>
                        Ari Integrated is founded on the conviction that Bitcoin, Ethereum, and Solana
                        are not only high-potential investments but also strategic reserve assets
                        in an increasingly digital financial system.
                    </p>
                    <h3>Scarcity & Appreciation</h3>
                    <p>
                        Bitcoin’s hard-capped supply of 21 million and Ethereum’s pivotal role in
                        decentralized finance support a long-term investment thesis. Outcomes are
                        uncertain and dependent on adoption, regulatory shifts, and market structure.
                    </p>
                    <div className={styles.disclaimer} role="note">
                        <strong>Disclosure:</strong> This content is for informational purposes only
                        and does not constitute investment advice. Digital assets are volatile and
                        can experience rapid, significant losses. Past performance is not indicative
                        of future results.
                    </div>
                    <h3>Inflation Hedge</h3>
                    <p>
                        In a world of monetary expansion, digital assets serve as a potential hedge
                        against currency devaluation and a diversification from traditional asset classes.
                    </p>
                </div>

                <div className={styles.textBlock}>
                    <h2>Why These Assets?</h2>
                    <ul>
                        <li><strong>Bitcoin (BTC):</strong> Digital Gold. Store of value.</li>
                        <li><strong>Ethereum (ETH):</strong> Foundational Smart Contract Layer.</li>
                        <li><strong>Solana (SOL):</strong> High-Throughput Blockchain Innovation.</li>
                    </ul>
                </div>
            </div>
        </Container>
    );
}
