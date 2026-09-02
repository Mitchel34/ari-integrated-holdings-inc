'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { CalendarDays } from 'lucide-react';
import { CalendlyEmbed } from './CalendlyEmbed';
import { CONTACT } from '@/lib/site';
import styles from './MeetingTypeSelector.module.css';

interface MeetingType {
    id: string;
    label: string;
    duration: string;
    description: string;
    envKey: string;
}

const MEETING_TYPES: MeetingType[] = [
    {
        id: 'intro',
        label: 'Executive Introduction',
        duration: '30 min',
        description: 'Meet the leadership team and explore whether ARI aligns with your investment strategy.',
        envKey: 'NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL',
    },
    {
        id: 'briefing',
        label: 'Investor Briefing',
        duration: '60 min',
        description: 'In-depth treasury strategy review, diligence Q&A, and investment structure discussion.',
        envKey: 'NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL',
    },
    {
        id: 'partnership',
        label: 'Partnership Discussion',
        duration: '45 min',
        description: 'For institutional partners, strategic collaborators, and treasury service providers.',
        envKey: 'NEXT_PUBLIC_CALENDLY_PARTNERSHIP_URL',
    },
];

const CALENDLY_URLS: Record<string, string> = {
    NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL: process.env.NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL ?? '',
    NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL: process.env.NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL ?? '',
    NEXT_PUBLIC_CALENDLY_PARTNERSHIP_URL: process.env.NEXT_PUBLIC_CALENDLY_PARTNERSHIP_URL ?? '',
};

const [emailLocal, emailDomain] = CONTACT.email.split('@');

export function MeetingTypeSelector() {
    const [selected, setSelected] = useState<string>('intro');
    const groupId = useId();
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const currentType = MEETING_TYPES.find((t) => t.id === selected) ?? MEETING_TYPES[0];
    const calendlyUrl = CALENDLY_URLS[currentType.envKey];

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
                    const isSelected = selected === type.id;
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

            <div className={`${styles.embedWrapper} ${calendlyUrl ? '' : styles.embedWrapperEmpty}`.trim()} aria-live="polite">
                {calendlyUrl ? (
                    <CalendlyEmbed url={calendlyUrl} />
                ) : (
                    <div className={styles.noUrl}>
                        <span className={styles.noUrlIcon} aria-hidden="true">
                            <CalendarDays size={20} strokeWidth={1.75} />
                        </span>
                        <p className={styles.noUrlTitle}>
                            Online booking is not yet open for {currentType.label.toLowerCase()}.
                        </p>
                        <p className={styles.noUrlBody}>
                            Email {CONTACT.name}, {CONTACT.title}, at{' '}
                            <a href={CONTACT.mailto} className={`${styles.fallbackLink} mono`}>
                                {emailLocal}@<wbr />{emailDomain}
                            </a>{' '}
                            to request this meeting directly. Replies come {CONTACT.responseWindow}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
