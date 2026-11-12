import { Container } from '../../components/ui/Container';
import { HarmonyLoop } from '../../components/harmony/HarmonyLoop';
import styles from '../page.module.css';

export default function HarmonyPage() {
    return (
        <>
        <section className={styles.pageHeroSection}>
            <Container>
                <div className={styles.sectionHeader}>
                    <h1>Harmony Trading App</h1>
                    <p>Supporting Subsidiary for Operational Stability</p>
                </div>
            </Container>
        </section>

        <Container className={styles.section}>
            <div className={styles.textBlock}>
                <h2>Purpose</h2>
                <p>
                    Harmony Trading App is Ari Integrated Holdings Inc.&rsquo;s operating subsidiary that handles
                    limited trading activity. Its primary role is to generate modest, steady revenue to cover
                    operating expenses and reduce the need to liquidate core treasury assets.
                </p>
            </div>

            <section aria-labelledby="harmony-loop-heading">
                <h2 id="harmony-loop-heading" className={styles.srOnly}>How Harmony supports the treasury</h2>
                <HarmonyLoop />
            </section>
        </Container>
        </>
    );
}
