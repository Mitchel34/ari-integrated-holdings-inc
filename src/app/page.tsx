import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, TREASURY_FRAMEWORK } from '@/lib/site';
import { getCompanyUpdates } from '@/lib/investor/updates';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { HomeHero } from '@/components/home/HomeHero';
import { HoldingsGrid } from '@/components/home/HoldingsGrid';
import { PillarsGrid } from '@/components/home/PillarsGrid';
import { EnginesSplit } from '@/components/home/EnginesSplit';
import { LatestUpdates } from '@/components/home/LatestUpdates';
import { ClosingCta } from '@/components/home/ClosingCta';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: { absolute: `${SITE.name} — ${SITE.tagline}` },
    description: SITE.description,
    alternates: { canonical: '/' },
};

export default function HomePage() {
    const latestUpdates = getCompanyUpdates().slice(0, 3);

    return (
        <>
            <HomeHero />

            <Section id="framework" aria-labelledby="framework-title">
                <SectionHeader
                    id="framework-title"
                    eyebrow="Treasury framework"
                    title={TREASURY_FRAMEWORK.title}
                    lead={TREASURY_FRAMEWORK.summary}
                />
                <HoldingsGrid />
            </Section>

            <Section id="pillars" tone="alt" hairline aria-labelledby="pillars-title">
                <SectionHeader
                    id="pillars-title"
                    eyebrow="Strategic pillars"
                    title="How we operate"
                    lead="The business model rests on three tenets that govern every allocation decision."
                />
                <PillarsGrid />
            </Section>

            <Section id="engines" aria-labelledby="engines-title">
                <SectionHeader
                    id="engines-title"
                    eyebrow="Treasury and technology"
                    title="A reserve, and the platform behind it"
                    lead="A long-horizon treasury, supported by an internal research and risk-analysis platform that informs human decisions."
                />
                <EnginesSplit />
            </Section>

            <Section id="updates" tone="alt" aria-labelledby="updates-title">
                <SectionHeader
                    id="updates-title"
                    eyebrow="Company updates"
                    title="Latest updates"
                    lead="Company, governance, and investor-relations announcements as they are published."
                    aside={
                        <Button asChild variant="outline">
                            <Link href="/updates">All updates</Link>
                        </Button>
                    }
                />
                <LatestUpdates items={latestUpdates} />
            </Section>

            <Section id="contact-cta" compact>
                <ClosingCta />
                <p className={styles.risk}>Digital assets remain volatile; interim drawdowns can be substantial.</p>
            </Section>
        </>
    );
}
