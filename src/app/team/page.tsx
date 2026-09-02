import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Landmark, Mail, Scale, Timer } from 'lucide-react';
import { PageHero } from '../../components/layout/PageHero';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { CONTACT, SITE } from '../../lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Leadership',
    description:
        'The leadership team of Ari Integrated Holdings Inc.: risk-management veterans Curtis and Judith Carson and CTO Mitchel Carson, who leads AI development and the Harmony Trading App.',
    alternates: { canonical: '/team' },
};

interface TeamMember {
    name: string;
    initials: string;
    role: string;
    bio: string;
    /** Show the correspondence chip; all inquiries are routed to this person. */
    correspondence?: boolean;
}

const TEAM: TeamMember[] = [
    {
        name: 'Curtis Carson',
        initials: 'CC',
        role: 'Chief Executive Officer & Chairman',
        bio: 'Co-founder, CEO, and Chairman of Ari Integrated Holdings with more than 40 years of combined corporate and entrepreneurial experience. A first-generation college graduate with a degree in Economics and Business Management, Curtis spent 16 years in corporate insurance before founding and leading a Loss Control and Risk Management consulting firm for 26 years. His background in probabilistic risk assessment, capital preservation, and decision-making under uncertainty shapes Ari’s long-term treasury strategy. He leads with a ten-year investment horizon focused on balance sheet strength, disciplined capital deployment, and compounding intrinsic value over time.',
    },
    {
        name: 'Judith Carson',
        initials: 'JC',
        role: 'Chief Marketing Officer',
        bio: 'Co-founder, CMO, and Board Member of Ari Integrated Holdings with a career spanning risk management, actuarial consulting, and entrepreneurship. Judy earned her BBA from the University of Wisconsin, double-majoring in Risk Management & Insurance and Personnel Management. She began at The Wyatt Company (now Willis Towers Watson), advising Fortune 500 corporations and public entities on alternative risk-financing strategies. After senior risk management roles at a major hospital group and a Fortune 100 company, she founded and led a loss control and risk consulting firm for 24 years. At Ari, she brings analytical rigor and entrepreneurial experience to marketing strategy and AI-driven growth.',
    },
    {
        name: 'Mitchel Carson',
        initials: 'MC',
        role: 'Chief Technology Officer',
        bio: 'Leads AI development and the Harmony Trading App. Expert in algorithmic trading systems, data analytics, and software architecture.',
        correspondence: true,
    },
];

/** Split so the chip can wrap at the "@" instead of mid-word on narrow cards. */
const [emailLocal, emailDomain] = CONTACT.email.split('@');

const GOVERNANCE = [
    {
        id: 'board',
        icon: Landmark,
        title: 'Board of directors',
        body: (
            <ul className={styles.boardList}>
                <li>
                    <span className={styles.boardName}>Curtis Carson</span>
                    <span className={styles.boardRole}>Chairman</span>
                </li>
                <li>
                    <span className={styles.boardName}>Judith Carson</span>
                    <span className={styles.boardRole}>Board Member</span>
                </li>
            </ul>
        ),
    },
    {
        id: 'horizon',
        icon: Timer,
        title: 'Ten-year horizon',
        body: (
            <p>
                The treasury is managed against a ten-year investment horizon: balance sheet strength, disciplined
                capital deployment, and compounding intrinsic value take precedence over short-term results.
            </p>
        ),
    },
    {
        id: 'decisions',
        icon: Scale,
        title: 'Human decisions',
        body: (
            <p>
                AI-assisted analysis informs the work, but final allocation, risk, and disclosure decisions rest with
                the board and executive team. Decades of loss-control and risk-management practice set the tone.
            </p>
        ),
    },
];

export default function TeamPage() {
    return (
        <>
            <PageHero
                eyebrow="Team"
                title="Leadership"
                lead="Risk-management veterans and an AI engineer running a disciplined digital-asset treasury."
            />

            <Section flush aria-labelledby="executives-title">
                <SectionHeader
                    id="executives-title"
                    eyebrow="Executive team"
                    title="Three people, one balance sheet"
                    lead={`${SITE.shortName} is led by its co-founders and its CTO. Decisions are made close to the numbers.`}
                    compact
                />
                <ul className={styles.grid}>
                    {TEAM.map((member) => (
                        <li key={member.name} className={styles.gridItem}>
                            <Card as="article" variant="glass" className={styles.member} aria-labelledby={`member-${member.initials}`}>
                                <div className={styles.monogram} aria-hidden="true">
                                    {member.initials}
                                </div>
                                <h3 id={`member-${member.initials}`} className={styles.name}>
                                    {member.name}
                                </h3>
                                <p className={styles.role}>{member.role}</p>
                                <p className={styles.bio}>{member.bio}</p>
                                {member.correspondence ? (
                                    <div className={styles.correspondence}>
                                        <p className={styles.correspondenceLabel}>Correspondence</p>
                                        <a href={CONTACT.mailto} className={styles.mailChip}>
                                            <Mail aria-hidden="true" />
                                            <span>
                                                {emailLocal}@<wbr />
                                                {emailDomain}
                                            </span>
                                        </a>
                                        <p className={styles.correspondenceNote}>
                                            All inquiries to {SITE.shortName} are routed to {CONTACT.name}. Expect a reply{' '}
                                            {CONTACT.responseWindow}.
                                        </p>
                                    </div>
                                ) : null}
                            </Card>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section tone="alt" hairline aria-labelledby="governance-title">
                <SectionHeader
                    id="governance-title"
                    eyebrow="Governance"
                    title="How decisions are made"
                    lead="A small board, a long horizon, and people accountable for every allocation."
                />
                <div className={styles.governanceGrid}>
                    {GOVERNANCE.map(({ id, icon: Icon, title, body }) => (
                        <Card key={id} as="article" variant="subtle" padding="sm" className={styles.governanceItem}>
                            <span className={styles.iconTile} aria-hidden="true">
                                <Icon size={20} strokeWidth={1.75} />
                            </span>
                            <h3 className={styles.governanceTitle}>{title}</h3>
                            <div className={styles.governanceBody}>{body}</div>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section compact aria-labelledby="cta-title">
                <Card variant="glass" className={styles.cta}>
                    <div className={styles.ctaText}>
                        <p className="eyebrow">Meet the team</p>
                        <h2 id="cta-title" className={styles.ctaTitle}>
                            Talk with an executive
                        </h2>
                        <p className={styles.ctaLead}>
                            Book a video meeting, or write to the CTO. Investor, partnership, press, and technical
                            questions all land in the same inbox.
                        </p>
                    </div>
                    <div className={styles.ctaActions}>
                        <Button asChild>
                            <Link href="/contact#schedule">
                                <CalendarDays aria-hidden="true" />
                                Book an executive meeting
                            </Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <a href={CONTACT.mailto}>
                                <Mail aria-hidden="true" />
                                Email the CTO
                            </a>
                        </Button>
                    </div>
                </Card>
            </Section>
        </>
    );
}
