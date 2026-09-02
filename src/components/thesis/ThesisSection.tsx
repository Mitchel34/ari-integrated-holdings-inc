import type { ReactNode } from 'react';
import styles from './ThesisSection.module.css';

interface ThesisSectionProps {
    /** 1-based position; rendered as a zero-padded mono numeral. */
    index: number;
    id: string;
    title: string;
    lead?: ReactNode;
    children: ReactNode;
}

/** A numbered reading block: gold mono numeral in the margin, h2, and prose. */
export function ThesisSection({ index, id, title, lead, children }: ThesisSectionProps) {
    const numeral = String(index).padStart(2, '0');
    const titleId = `${id}-title`;

    return (
        <article id={id} className={styles.section} aria-labelledby={titleId}>
            <span className={`${styles.numeral} mono`} aria-hidden="true">
                {numeral}
            </span>
            <div className={styles.body}>
                <h2 id={titleId} className={styles.title}>
                    <span className="sr-only">Section {numeral}: </span>
                    {title}
                </h2>
                {lead ? <p className={styles.lead}>{lead}</p> : null}
                <div className={styles.content}>{children}</div>
            </div>
        </article>
    );
}
