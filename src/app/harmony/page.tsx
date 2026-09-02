import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, ClipboardCheck, Cpu, FlaskConical, Mail, Radar, Scale, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CONTACT, SITE } from '@/lib/site';
import styles from './harmony.module.css';

export const metadata: Metadata = {
    title: 'Harmony Trading',
    description: `Harmony Trading App is ${SITE.legalName}'s operating subsidiary. It handles limited, internal-only trading under strict risk limits to generate modest, steady revenue that covers operating expenses and reduces the need to liquidate core treasury assets.`,
    alternates: { canonical: '/harmony' },
};

const PROCESS = [
    {
        id: 'signals',
        title: 'Signals',
        icon: Radar,
        text: 'Algorithmic and AI-driven strategies generate trade signals inside the internal platform.',
    },
    {
        id: 'risk-limits',
        title: 'Risk limits',
        icon: ShieldCheck,
        text: 'Each signal is checked against strict risk limits that keep trading capital small and separate from the core BTC, ETH, and SOL holdings.',
    },
    {
        id: 'execution',
        title: 'Execution',
        icon: ArrowLeftRight,
        text: 'Trades that pass the limits are executed on the internal-only platform; nothing is customer-facing today.',
    },
    {
        id: 'review',
        title: 'Review',
        icon: ClipboardCheck,
        text: 'Outcomes are reviewed by human governance, and the analytics feed back into broader treasury allocation decisions.',
    },
] as const;

const CAPABILITIES = [
    {
        id: 'platform',
        title: 'Proprietary Platform',
        icon: Cpu,
        text: 'An internal trading application employing algorithmic and AI-driven strategies. It operates as an internal-only platform today, with a customer-facing product roadmap under active evaluation.',
    },
    {
        id: 'risk-controls',
        title: 'Limited Scope & Risk Controls',
        icon: Scale,
        text: 'A small portion of assets is allocated to trading with strict risk limits to protect the core BTC, ETH, and SOL treasury holdings.',
    },
    {
        id: 'ai-sandbox',
        title: 'AI Sandbox',
        icon: FlaskConical,
        text: 'Harmony serves as a testing ground for analytics and models that inform broader treasury allocation decisions.',
    },
] as const;

const BOUNDARIES = [
    {
        term: 'Capital',
        detail: 'A small portion of assets, separate from the core BTC, ETH, and SOL treasury holdings.',
    },
    {
        term: 'Mandate',
        detail: 'Modest, steady revenue to cover operating expenses and reduce the need to liquidate core assets.',
    },
    {
        term: 'Oversight',
        detail: 'Human governance is responsible for final decisions.',
    },
    {
        term: 'Status',
        detail: 'Internal-only today. A customer-facing roadmap is under evaluation.',
    },
] as const;

const [emailLocal, emailDomain] = CONTACT.email.split('@');

export default function HarmonyPage() {
    return (
        <>
            <PageHero
                eyebrow="Operating subsidiary"
                title="Harmony Trading"
                lead={`Harmony Trading App is ${SITE.legalName}’s operating subsidiary that handles limited trading activity. Its primary role is to generate modest, steady revenue to cover operating expenses and reduce the need to liquidate core treasury assets.`}
                meta={
                    <>
                        <span>Internal-only platform</span>
                        <span aria-hidden="true">·</span>
                        <span>Subsidiary of {SITE.shortName}</span>
                    </>
                }
            />

            <Section flush aria-labelledby="process-title">
                <SectionHeader
                    id="process-title"
                    eyebrow="How it operates"
                    title="Four steps, one loop"
                    lead="Strategies propose, limits constrain, the platform executes, and people review. The loop runs entirely inside the company."
                />
                <ol className={styles.process}>
                    {PROCESS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <li key={step.id} className={styles.processItem}>
                                <Card variant="glass" as="article" className={styles.step} aria-labelledby={`step-${step.id}`}>
                                    <div className={styles.stepHead}>
                                        <span className={styles.iconBox} aria-hidden="true">
                                            <Icon size={20} strokeWidth={1.75} />
                                        </span>
                                        <span className={`${styles.stepIdx} mono`} aria-hidden="true">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 id={`step-${step.id}`} className={styles.stepTitle}>
                                        <span className="sr-only">Step {index + 1}: </span>
                                        {step.title}
                                    </h3>
                                    <p className={styles.stepText}>{step.text}</p>
                                </Card>
                            </li>
                        );
                    })}
                </ol>
            </Section>

            <Section hairline aria-labelledby="capabilities-title">
                <SectionHeader
                    id="capabilities-title"
                    eyebrow="What it is"
                    title="A narrow, well-fenced operation"
                    compact
                />
                <div className={styles.capabilities}>
                    {CAPABILITIES.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.id} variant="glass" as="article" className={styles.capability} aria-labelledby={`cap-${item.id}`}>
                                <span className={styles.iconBox} aria-hidden="true">
                                    <Icon size={20} strokeWidth={1.75} />
                                </span>
                                <h3 id={`cap-${item.id}`} className={styles.capabilityTitle}>{item.title}</h3>
                                <p className={styles.capabilityText}>{item.text}</p>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            <Section flush aria-labelledby="boundaries-title">
                <Card variant="elevated" as="section" className={styles.boundaries} aria-labelledby="boundaries-title">
                    <div className={styles.boundariesHead}>
                        <p className="eyebrow">Boundaries</p>
                        <h2 id="boundaries-title" className={styles.boundariesTitle}>What Harmony may and may not do</h2>
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

            <Section hairline compact aria-labelledby="lead-title">
                <div className={styles.closing}>
                    <div className={styles.closingText}>
                        <span className={styles.iconBox} aria-hidden="true">
                            <Mail size={20} strokeWidth={1.75} />
                        </span>
                        <div>
                            <h2 id="lead-title" className={styles.closingTitle}>
                                Led by {CONTACT.name}, {CONTACT.title}
                            </h2>
                            <p className={styles.closingNote}>
                                Questions about Harmony are routed to the CTO at{' '}
                                <a href={CONTACT.mailto} className={`${styles.mail} mono`}>
                                    {emailLocal}@<wbr />{emailDomain}
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="secondary">
                        <Link href="/contact">
                            Contact
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </Section>
        </>
    );
}
