import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import styles from '../page.module.css';

export default function HarmonyPage() {
    return (
        <Container className={styles.section}>
            <div className={styles.sectionHeader}>
                <h1>Harmony Trading App</h1>
                <p>Supporting Subsidiary for Operational Stability</p>
            </div>

            <div className={styles.textBlock}>
                <h2>Purpose</h2>
                <p>
                    Harmony Trading App is Ari Integrated Holdings Inc.&rsquo;s operating subsidiary that handles
                    limited trading activity. Its primary role is to generate modest, steady revenue to cover
                    operating expenses and reduce the need to liquidate core treasury assets.
                </p>
            </div>

            <div className={styles.grid} style={{ marginTop: '3rem' }}>
                <Card>
                    <h3>Proprietary Platform</h3>
                    <p>
                        An internal trading application employing algorithmic and AI-driven strategies. It is not
                        a customer-facing product today, but may evolve in the future.
                    </p>
                </Card>
                <Card>
                    <h3>Limited Scope & Risk Controls</h3>
                    <p>
                        A small portion of assets is allocated to trading with strict risk limits to protect
                        the core BTC, ETH, and SOL treasury holdings.
                    </p>
                </Card>
                <Card>
                    <h3>AI Sandbox</h3>
                    <p>
                        Harmony serves as a testing ground for analytics and models that inform broader
                        treasury allocation decisions.
                    </p>
                </Card>
            </div>
        </Container>
    );
}
