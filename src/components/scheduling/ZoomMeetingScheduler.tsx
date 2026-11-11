'use client';

import { useState } from 'react';
import { ArrowRight, Video } from 'lucide-react';
import { MEETING_TYPES } from './MeetingTypeSelector';
import { ZoomMeetingModal } from './ZoomMeetingModal';
import {
    SCHEDULING_CONTACT_EMAIL,
    ZOOM_MEETING_DURATION,
    zoomMeetingUrlForTopic,
} from '@/lib/scheduling';
import styles from './ZoomMeetingScheduler.module.css';

/**
 * Contact page scheduler: pick what the meeting is about, then book a time in
 * the Zoom meeting modal. Every topic books the same Calendly event; the topic
 * is recorded on the booking so the host knows what to prepare for.
 */
export function ZoomMeetingScheduler() {
    const [open, setOpen] = useState(false);
    // Kept after closing so the modal's title does not change while it closes.
    const [topicId, setTopicId] = useState(MEETING_TYPES[0].id);
    const topic = MEETING_TYPES.find((type) => type.id === topicId) ?? MEETING_TYPES[0];

    return (
        <div className={styles.wrapper}>
            <ul className={styles.topics}>
                {MEETING_TYPES.map((type) => (
                    <li key={type.id}>
                        <button
                            type="button"
                            className={styles.topic}
                            aria-haspopup="dialog"
                            onClick={() => {
                                setTopicId(type.id);
                                setOpen(true);
                            }}
                        >
                            <span className={styles.topicLabel}>{type.label}</span>
                            <span className={styles.topicDesc}>{type.description}</span>
                            <span className={styles.topicAction}>
                                <Video aria-hidden="true" />
                                Schedule on Zoom
                                <ArrowRight aria-hidden="true" className={styles.arrow} />
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <p className={styles.note}>
                Each meeting is {ZOOM_MEETING_DURATION} on Zoom. Questions about scheduling? Email{' '}
                <a href={`mailto:${SCHEDULING_CONTACT_EMAIL}`} className={styles.email}>
                    {SCHEDULING_CONTACT_EMAIL}
                </a>
                .
            </p>

            <ZoomMeetingModal
                open={open}
                onClose={() => setOpen(false)}
                topic={topic.label}
                url={zoomMeetingUrlForTopic(topic.id)}
            />
        </div>
    );
}
