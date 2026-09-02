import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { getTreasuryFreshness, getTreasurySnapshot } from '@/lib/treasury/snapshot';
import { getDisclosures } from '@/lib/investor/disclosures';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { HomeHero } from '@/components/home/HomeHero';
import { HoldingsGrid } from '@/components/home/HoldingsGrid';
import { PillarsGrid } from '@/components/home/PillarsGrid';
import { EnginesSplit } from '@/components/home/EnginesSplit';
import { TransparencyPanel } from '@/components/home/TransparencyPanel';
import { ClosingCta } from '@/components/home/ClosingCta';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: { absolute: `${SITE.name} — ${SITE.tagline}` },
    description: SITE.description,
    alternates: { canonical: '/' },
};

/** Re-render daily so the snapshot age shown in the hero stays honest. */
export const revalidate = 86400;

export default function HomePage() {
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);
    const latestDisclosures = getDisclosures().slice(0, 3);

    return (
        <>
            <HomeHero snapshot={snapshot} freshness={freshness} />

            <Section id="holdings" aria-labelledby="holdings-title">
                <SectionHeader
                    id="holdings-title"
                    eyebrow="What we hold"
                    title="Three assets, one framework"
                    lead="Each position is sized for its role in the portfolio and held through a regulated spot ETF."
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
                    eyebrow="Two engines"
                    title="Treasury and operations"
                    lead="A long-horizon reserve, supported by a small operating subsidiary that helps cover costs."
                />
                <EnginesSplit />
            </Section>

            <Section id="transparency" tone="alt" aria-labelledby="transparency-title">
                <SectionHeader
                    id="transparency-title"
                    eyebrow="Transparency"
                    title="Latest disclosures"
                    lead="Treasury updates, financial results, and governance notices as they are published."
                    aside={
                        <Button asChild variant="outline">
                            <Link href="/disclosures">All disclosures</Link>
                        </Button>
                    }
                />
                <TransparencyPanel items={latestDisclosures} />
            </Section>

            <Section id="contact-cta" compact>
                <ClosingCta />
                <p className={styles.risk}>Digital assets remain volatile; interim drawdowns can be substantial.</p>
            </Section>
        </>
    );
}
