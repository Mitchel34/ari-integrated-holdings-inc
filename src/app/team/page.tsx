import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import styles from './page.module.css';

const TEAM = [
    {
        name: 'Curtis Carson',
        role: 'Chief Executive Officer & Chief Financial Officer',
        bio: null,
    },
    {
        name: 'Judith Carson',
        role: 'Chief Marketing Officer',
        bio: null,
    },
    {
        name: 'Mitchel Carson',
        role: 'Chief Technology Officer',
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
                        <Card key={member.name} variant="glass">
                            <div className={styles.memberCard}>
                                <div className={styles.avatar}>
                                    {member.name.charAt(0)}
                                </div>
                                <div className={styles.divider} />
                                <p className={styles.name}>{member.name}</p>
                                <p className={styles.role}>{member.role}</p>
                                {member.bio && (
                                    <p className={styles.bio}>{member.bio}</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    );
}
