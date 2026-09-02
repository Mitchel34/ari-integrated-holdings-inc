import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { Container } from '../ui/Container';
import { CONTACT } from '@/lib/site';
import styles from './DocumentPage.module.css';

export interface DocumentSection {
    id: string;
    title: string;
}

interface DocumentPageProps {
    eyebrow?: string;
    title: string;
    lead?: ReactNode;
    /** Human-readable effective / last-updated date. */
    updated?: string;
    version?: string;
    /** Table of contents entries; the prose must contain matching `id`s on its h2s. */
    sections?: DocumentSection[];
    /** Automatically number h2 headings with a mono counter. */
    numbered?: boolean;
    /** Optional highlighted note shown above the prose. */
    callout?: ReactNode;
    children: ReactNode;
}

/**
 * Long-form document template for legal pages and disclosures:
 * page hero, sticky table of contents on wide screens, and a 72ch prose column.
 */
export function DocumentPage({
    eyebrow,
    title,
    lead,
    updated,
    version,
    sections = [],
    numbered = true,
    callout,
    children,
}: DocumentPageProps) {
    return (
        <>
            <PageHero
                eyebrow={eyebrow}
                title={title}
                lead={lead}
                meta={
                    updated || version ? (
                        <>
                            {updated ? <span>Last updated {updated}</span> : null}
                            {version ? <span>Version {version}</span> : null}
                        </>
                    ) : undefined
                }
            />
            <Container>
                <div className={styles.layout}>
                    {sections.length > 0 ? (
                        <nav className={styles.toc} aria-label="On this page">
                            <p className={styles.tocTitle}>On this page</p>
                            <ol className={styles.tocList}>
                                {sections.map((section, index) => (
                                    <li key={section.id}>
                                        <a href={`#${section.id}`} className={styles.tocLink}>
                                            <span className={styles.tocIndex}>{String(index + 1).padStart(2, '0')}</span>
                                            <span>{section.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    ) : null}
                    <div>
                        {callout ? <div className={styles.callout}>{callout}</div> : null}
                        <article className={`${styles.prose} ${numbered ? styles.numbered : ''}`.trim()}>
                            {children}
                        </article>
                        <footer className={styles.footer}>
                            <span>
                                Questions about this document? Contact {CONTACT.name}, {CONTACT.title}, at{' '}
                                <a href={CONTACT.mailto}>{CONTACT.email}</a>.
                            </span>
                            {updated ? <span className={styles.footerMono}>Updated {updated}</span> : null}
                        </footer>
                    </div>
                </div>
            </Container>
        </>
    );
}
