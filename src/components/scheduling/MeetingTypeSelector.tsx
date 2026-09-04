'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { CalendlyEmbed } from './CalendlyEmbed';
import { getConfiguredMeetingTypes } from '@/lib/scheduling';
import styles from './MeetingTypeSelector.module.css';

/** Only meeting types with a configured Calendly URL are ever offered. */
const MEETING_TYPES = getConfiguredMeetingTypes();

/**
 * Radio group over the configured meeting types with the matching Calendly
 * embed beneath it. Renders nothing when online booking is not configured, so
 * a public "Book a meeting" call to action never leads to a dead end.
 */
export function MeetingTypeSelector() {
    const [selected, setSelected] = useState<string>(MEETING_TYPES[0]?.id ?? '');
    const groupId = useId();
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

    if (MEETING_TYPES.length === 0) {
        return null;
    }

    const currentType = MEETING_TYPES.find((t) => t.id === selected) ?? MEETING_TYPES[0];

    function moveSelection(fromIndex: number, delta: number) {
        const nextIndex = (fromIndex + delta + MEETING_TYPES.length) % MEETING_TYPES.length;
        setSelected(MEETING_TYPES[nextIndex].id);
        buttonRefs.current[nextIndex]?.focus();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                moveSelection(index, 1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                moveSelection(index, -1);
                break;
            case 'Home':
                event.preventDefault();
                moveSelection(index, -index);
                break;
            case 'End':
                event.preventDefault();
                moveSelection(index, MEETING_TYPES.length - 1 - index);
                break;
            default:
                break;
        }
    }

    return (
        <div className={styles.wrapper}>
            <p id={`${groupId}-label`} className={styles.groupLabel}>
                Meeting type
            </p>
            <div className={styles.typeGrid} role="radiogroup" aria-labelledby={`${groupId}-label`}>
                {MEETING_TYPES.map((type, index) => {
                    const isSelected = currentType.id === type.id;
                    return (
                        <button
                            key={type.id}
                            ref={(node) => {
                                buttonRefs.current[index] = node;
                            }}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            className={`${styles.typeCard} glass-1 ${isSelected ? styles.typeCardActive : ''}`.trim()}
                            onClick={() => setSelected(type.id)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                        >
                            <span className={styles.typeHeader}>
                                <span className={styles.typeLabel}>{type.label}</span>
                                <span className={`${styles.typeDuration} mono`}>{type.duration}</span>
                            </span>
                            <span className={styles.typeDesc}>{type.description}</span>
                            <span className={styles.typeMark} aria-hidden="true" />
                        </button>
                    );
                })}
            </div>

            <div className={styles.embedWrapper} aria-live="polite">
                <CalendlyEmbed key={currentType.id} url={currentType.url} />
            </div>
        </div>
    );
}
