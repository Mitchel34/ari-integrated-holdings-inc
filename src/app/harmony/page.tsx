import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, ArrowRight, FlaskConical, Mail, Search } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CONTACT, HARMONY } from '@/lib/site';
import styles from './harmony.module.css';

export const metadata: Metadata = {
    title: HARMONY.name,
    description: `${HARMONY.tagline} It supports human decision-making and operates within defined governance and risk boundaries.`,
    alternates: { canonical: '/harmony' },
};

const FUNCTIONS = [
    {
        id: 'research',
        title: 'Treasury research',
        icon: Search,
        text: 'Market structure, liquidity, and allocation analysis for the BTC, ETH, and SOL exposure held in the treasury framework.',
    },
    {
        id: 'risk',
        title: 'Risk analysis',
        icon: Activity,
        text: 'Volatility, correlation, and drawdown monitoring across the target allocation, so the board and executive team see risk before it compounds.',
    },
    {
        id: 'evaluation',
        title: 'Controlled strategy evaluation',
        icon: FlaskConical,
        text: 'Models and strategies are evaluated in a bounded, internal environment. Nothing leaves that environment without human review.',
    },
] as const;

const BOUNDARIES = [
    {
        term: 'Role',
        detail: 'Supports human decision-making. Harmony produces analysis; people make the calls.',
    },
    {
        term: 'Governance',
        detail: 'Operates within defined governance and risk boundaries set by the board and executive team.',
    },
    {
        term: 'Scope',
        detail: 'Internal-only. There is no customer-facing product.',
    },
    {
        term: 'Relationship to treasury',
        detail: 'Analysis informs allocation decisions. It does not make them.',
    },
] as const;

const [emailLocal, emailDomain] = CONTACT.email.split('@');

export default function HarmonyPage() {
    return (
        <>
            <PageHero
                eyebrow="Internal platform"
                title={HARMONY.name}
                lead={HARMONY.positioning}
                meta={
                    <>
                        <span>Internal platform</span>
                        <span>Supports human decision-making</span>
                    </>
                }
            />

            <Section flush aria-labelledby="functions-title">
                <SectionHeader
                    id="functions-title"
                    eyebrow="What Harmony does"
                    title="Research, risk, and controlled evaluation"
                    lead="Three functions, all in service of the treasury framework and the people who govern it."
                />
                <div className={styles.functions}>
                    {FUNCTIONS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.id} variant="glass" as="article" className={styles.function} aria-labelledby={`fn-${item.id}`}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <Icon size={20} strokeWidth={1.75} />
                                </span>
                                <h3 id={`fn-${item.id}`} className={styles.functionTitle}>{item.title}</h3>
                                <p className={styles.functionText}>{item.text}</p>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            <Section hairline aria-labelledby="boundaries-title">
                <Card variant="elevated" as="section" className={styles.boundaries} aria-labelledby="boundaries-title">
                    <div className={styles.boundariesHead}>
                        <p className="eyebrow">Boundaries</p>
                        <h2 id="boundaries-title" className={styles.boundariesTitle}>Where Harmony stops</h2>
                    </div>
                    <dl className={styles.definitions}>
                        {BOUNDARIES.map((row) => (
                            <div key={row.term} className={styles.definition}>
                                <dt className={styles.term}>{row.term}</dt>
                                <dd className={styles.detail}>{row.detail}</dd>
                            </div>
                        ))}
                    </dl>
                </Card>
            </Section>

            <Section hairline compact aria-labelledby="closing-title">
                <div className={styles.closing}>
                    <div className={styles.closingText}>
                        <span className={styles.iconBox} aria-hidden="true">
                            <Mail size={20} strokeWidth={1.75} />
                        </span>
                        <div>
                            <h2 id="closing-title" className={styles.closingTitle}>Questions about Harmony?</h2>
                            <a href={CONTACT.mailto} className={`${styles.mail} mono`}>
                                {emailLocal}@<wbr />{emailDomain}
                            </a>
                        </div>
                    </div>
                    <Button asChild variant="secondary">
                        <Link href="/contact">
                            Contact us
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </Section>
        </>
    );
}
