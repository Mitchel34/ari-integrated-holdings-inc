'use client';

import { useState } from 'react';
import { CalendlyEmbed } from './CalendlyEmbed';
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

export function MeetingTypeSelector() {
    const [selected, setSelected] = useState<string>('intro');
    const currentType = MEETING_TYPES.find((t) => t.id === selected)!;
    const calendlyUrl = CALENDLY_URLS[currentType.envKey];

    return (
        <div className={styles.wrapper}>
            <div className={styles.typeGrid}>
                {MEETING_TYPES.map((type) => (
                    <button
                        key={type.id}
                        className={`${styles.typeCard} ${selected === type.id ? styles.typeCardActive : ''}`}
                        onClick={() => setSelected(type.id)}
                        type="button"
                    >
                        <div className={styles.typeHeader}>
                            <span className={styles.typeLabel}>{type.label}</span>
                            <span className={styles.typeDuration}>{type.duration}</span>
                        </div>
                        <p className={styles.typeDesc}>{type.description}</p>
                    </button>
                ))}
            </div>

            <div className={styles.embedWrapper}>
                {calendlyUrl ? (
                    <CalendlyEmbed url={calendlyUrl} />
                ) : (
                    <div className={styles.noUrl}>
                        <p>
                            Scheduling is not yet configured for this meeting type.
                            <br />
                            <a href="mailto:investor-relations@ariholdings.com" className={styles.fallbackLink}>
                                Email investor-relations@ariholdings.com
                            </a>{' '}
                            to request this meeting directly.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
