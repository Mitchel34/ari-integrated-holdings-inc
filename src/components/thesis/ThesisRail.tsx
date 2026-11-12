'use client';

import { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { scrollToSection, useScrollSpy } from '@/lib/useScrollSpy';
import styles from './ThesisRail.module.css';

export interface ThesisChapter {
    id: string;
    num: string;
    title: string;
}

interface ThesisRailProps {
    chapters: ThesisChapter[];
}

/**
 * Reading guide for the thesis: a sticky chapter list on desktop and a sticky
 * progress bar with previous/next controls on small screens.
 */
export function ThesisRail({ chapters }: ThesisRailProps) {
    const ids = useMemo(() => chapters.map((chapter) => chapter.id), [chapters]);
    const { active, progress } = useScrollSpy(ids);
    const current = chapters[active];
    const previous = chapters[active - 1];
    const next = chapters[active + 1];
    const percent = `${(progress * 100).toFixed(1)}%`;

    return (
        <>
            <nav className={styles.rail} aria-label="Thesis sections">
                <p className={styles.railLabel}>Guided read</p>
                <div className={styles.railBody}>
                    <span className={styles.track} aria-hidden="true">
                        <span className={styles.trackFill} style={{ height: percent }} />
                    </span>
                    <ol className={styles.list}>
                        {chapters.map((chapter, index) => (
                            <li key={chapter.id}>
                                <a
                                    href={`#${chapter.id}`}
                                    className={`${styles.item} ${index === active ? styles.itemActive : ''} ${index < active ? styles.itemDone : ''}`.trim()}
                                    aria-current={index === active ? 'step' : undefined}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        scrollToSection(chapter.id);
                                    }}
                                >
                                    <span className={styles.itemNum}>{chapter.num}</span>
                                    <span className={styles.itemTitle}>{chapter.title}</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </nav>

            <div className={styles.bar} role="navigation" aria-label="Thesis progress">
                <div className={styles.barInner}>
                    <p className={styles.barText}>
                        <span className={styles.barNum}>{current.num} / {chapters[chapters.length - 1].num}</span>
                        <span className={styles.barTitle}>{current.title}</span>
                    </p>
                    <div className={styles.barButtons}>
                        <button
                            type="button"
                            className={styles.barButton}
                            aria-label="Previous section"
                            disabled={!previous}
                            onClick={() => previous && scrollToSection(previous.id)}
                        >
                            <ChevronUp aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className={styles.barButton}
                            aria-label="Next section"
                            disabled={!next}
                            onClick={() => next && scrollToSection(next.id)}
                        >
                            <ChevronDown aria-hidden="true" />
                        </button>
                    </div>
                </div>
                <span className={styles.barTrack} aria-hidden="true">
                    <span className={styles.barFill} style={{ width: percent }} />
                </span>
            </div>
        </>
    );
}
