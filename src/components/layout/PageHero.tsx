import type { ReactNode } from 'react';
import { Container } from '../ui/Container';
import styles from './PageHero.module.css';

interface PageHeroProps {
    eyebrow?: string;
    title: ReactNode;
    lead?: ReactNode;
    /** Small mono metadata row (dates, version, source). */
    meta?: ReactNode;
    /** Buttons or links rendered under the lead. */
    actions?: ReactNode;
    align?: 'left' | 'center';
    /** Draw a gold hairline under the hero. */
    hairline?: boolean;
    id?: string;
}

/** Standard page-title block for interior pages. */
export function PageHero({ eyebrow, title, lead, meta, actions, align = 'left', hairline = true, id }: PageHeroProps) {
    return (
        <section className={styles.hero} aria-labelledby={id ?? 'page-title'}>
            <Container>
                <div className={`${styles.inner} ${align === 'center' ? styles.center : ''}`.trim()}>
                    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
                    <h1 id={id ?? 'page-title'} className={styles.title}>{title}</h1>
                    {lead ? <p className={styles.lead}>{lead}</p> : null}
                    {meta ? <div className={styles.meta}>{meta}</div> : null}
                    {actions ? <div className={styles.actions}>{actions}</div> : null}
                </div>
                {hairline ? <div className={styles.hairline} aria-hidden="true" /> : null}
            </Container>
        </section>
    );
}
