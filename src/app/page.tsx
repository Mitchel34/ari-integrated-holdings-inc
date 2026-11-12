import Link from 'next/link';
import { Landmark, ScanEye, TrendingUp } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AllocationRing } from '../components/allocation/AllocationRing';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>Leadership &amp; Strength</p>
              <h1>Building the Strategic Reserve of the Digital Age</h1>
              <p className={styles.heroLead}>
                Ari Integrated Holdings Inc. follows a disciplined long-term treasury strategy centered on
                BTC, ETH, and SOL with a target allocation of 50% / 30% / 20%.
              </p>
              <div className={styles.heroActions}>
                <Button asChild size="lg">
                  <Link href="/thesis">Read Our Thesis</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className={styles.heroRing}>
              <h2 className={styles.srOnly}>Allocation Framework</h2>
              <AllocationRing
                layout="stacked"
                autoCycle
                caption="Designed around volatility hierarchy, correlation structure, and asymmetric payoffs."
              />
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Strategic Pillars</h2>
            <p>Our business model rests on three core tenets.</p>
          </div>
          <div className={styles.grid}>
            <Card variant="glass">
              <div className={styles.cardIcon}>
                <Landmark aria-hidden="true" />
              </div>
              <h3 className={styles.cardTitle}>Disciplined Treasury</h3>
              <p className={styles.cardText}>
                A long-duration balance-sheet approach with explicit BTC/ETH/SOL target weights and
                ongoing risk monitoring rather than short-term trading.
              </p>
            </Card>
            <Card variant="glass">
              <div className={styles.cardIcon}>
                <ScanEye aria-hidden="true" />
              </div>
              <h3 className={styles.cardTitle}>AI-Assisted Oversight</h3>
              <p className={styles.cardText}>
                AI supports scenario analysis, volatility mapping, and allocation discipline while
                human governance remains responsible for final decisions.
              </p>
            </Card>
            <Card variant="glass">
              <div className={styles.cardIcon}>
                <TrendingUp aria-hidden="true" />
              </div>
              <h3 className={styles.cardTitle}>Asymmetric Exposure</h3>
              <p className={styles.cardText}>
                The mix seeks strong upside capture across cycles while avoiding concentration into
                a single high-beta crypto position.
              </p>
            </Card>
          </div>
          <p className={styles.sectionNote}>Digital assets remain volatile; interim drawdowns can be substantial.</p>
        </Container>
      </section>
    </>
  );
}
