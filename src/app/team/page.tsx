import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import styles from './page.module.css';

interface TeamMember {
    name: string;
    role: string;
    /** Three facts drawn from the bio, shown before the full text. */
    facts: string[];
    bio: string;
}

const TEAM: TeamMember[] = [
    {
        name: 'Curtis Carson',
        role: 'Chief Executive Officer & Chairman',
        facts: [
            '40+ years of corporate and entrepreneurial experience',
            '16 years in corporate insurance',
            '26 years leading a risk management consulting firm',
        ],
        bio: 'Co-founder, CEO, and Chairman of Ari Integrated Holdings with more than 40 years of combined corporate and entrepreneurial experience. A first-generation college graduate with a degree in Economics and Business Management, Curtis spent 16 years in corporate insurance before founding and leading a Loss Control and Risk Management consulting firm for 26 years. His background in probabilistic risk assessment, capital preservation, and decision-making under uncertainty shapes Ari’s long-term treasury strategy. He leads with a ten-year investment horizon focused on balance sheet strength, disciplined capital deployment, and compounding intrinsic value over time.',
    },
    {
        name: 'Judith Carson',
        role: 'Chief Marketing Officer',
        facts: [
            '24 years leading a loss control and risk consulting firm',
            'Advised Fortune 500 companies at The Wyatt Company',
            'BBA, University of Wisconsin',
        ],
        bio: 'Co-founder, CMO, and Board Member of Ari Integrated Holdings with a career spanning risk management, actuarial consulting, and entrepreneurship. Judy earned her BBA from the University of Wisconsin, double-majoring in Risk Management & Insurance and Personnel Management. She began at The Wyatt Company (now Willis Towers Watson), advising Fortune 500 corporations and public entities on alternative risk-financing strategies. After senior risk management roles at a major hospital group and a Fortune 100 company, she founded and led a loss control and risk consulting firm for 24 years. At Ari, she brings analytical rigor and entrepreneurial experience to marketing strategy and AI-driven growth.',
    },
    {
        name: 'Mitchel Carson',
        role: 'Chief Technology Officer',
        facts: [
            'Leads AI development',
            'Builds the Harmony Trading App',
            'Algorithmic trading systems and data analytics',
        ],
        bio: 'Leads AI development and the Harmony Trading App. Expert in algorithmic trading systems, data analytics, and software architecture.',
    },
];

export default function TeamPage() {
    return (
        <div className={styles.page}>
            <section className={styles.heroSection}>
                <Container>
                    <div className={styles.sectionHeader}>
                        <h1>Leadership Team</h1>
                        <p>Experienced Leadership with Crypto and AI Expertise</p>
                    </div>
                </Container>
            </section>

            <Container className={styles.gridSection}>
                <div className={styles.grid}>
                    {TEAM.map((member) => (
                        <Card key={member.name} variant="glass" className={styles.memberShell}>
                            <article className={styles.memberCard}>
                                <div className={styles.identity}>
                                    <div className={styles.avatar} aria-hidden="true">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className={styles.name}>{member.name}</h2>
                                        <p className={styles.role}>{member.role}</p>
                                    </div>
                                </div>
                                <ul className={styles.facts}>
                                    {member.facts.map((fact) => (
                                        <li key={fact}>{fact}</li>
                                    ))}
                                </ul>
                                <details className={styles.bio}>
                                    <summary>Full bio</summary>
                                    <p>{member.bio}</p>
                                </details>
                            </article>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    );
}
