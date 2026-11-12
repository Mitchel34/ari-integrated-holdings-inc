'use client';

import { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { scrollToSection, useScrollSpy } from '@/lib/useScrollSpy';
import styles from './ThesisRail.module.css';

export interface ThesisChapter {
    id: string;
    title: string;
}

interface ThesisRailProps {
    chapters: readonly ThesisChapter[];
}

const numeral = (index: number) => String(index + 1).padStart(2, '0');

/**
 * Reading guide for the thesis: a sticky chapter list with a gold progress
 * track on large screens, and a sticky progress bar with previous / next
 * controls under the navbar on small screens. Section ids are the targets.
 */
export function ThesisRail({ chapters }: ThesisRailProps) {
    const ids = useMemo(() => chapters.map((chapter) => chapter.id), [chapters]);
    const { active, progress } = useScrollSpy(ids);
    const current = chapters[active] ?? chapters[0];
    const previous = chapters[active - 1];
    const next = chapters[active + 1];
    const percent = `${(progress * 100).toFixed(1)}%`;
    const total = numeral(chapters.length - 1);

    return (
        <>
            <nav className={styles.rail} aria-label="Thesis sections">
                <p className="eyebrow">Guided read</p>
                <div className={styles.railBody}>
                    <span className={styles.track} aria-hidden="true">
                        <span className={styles.trackFill} style={{ height: percent }} />
                    </span>
                    <ol className={styles.list}>
                        {chapters.map((chapter, index) => (
                            <li key={chapter.id}>
                                <a
                                    href={`#${chapter.id}`}
                                    className={[
                                        styles.item,
                                        index === active ? styles.itemActive : '',
                                        index < active ? styles.itemDone : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    aria-current={index === active ? 'step' : undefined}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        scrollToSection(chapter.id);
                                    }}
                                >
                                    <span className={`${styles.itemNum} mono`}>{numeral(index)}</span>
                                    <span className={styles.itemTitle}>{chapter.title}</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </nav>

            <nav className={styles.bar} aria-label="Thesis progress">
                <div className={styles.barInner}>
                    <p className={styles.barText}>
                        <span className={`${styles.barNum} mono`}>
                            {numeral(active)} / {total}
                        </span>
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
            </nav>
        </>
    );
}
