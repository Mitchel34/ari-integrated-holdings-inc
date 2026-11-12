'use client';

import { useState } from 'react';
import { ArrowRight, Video } from 'lucide-react';
import { ZoomMeetingModal } from './ZoomMeetingModal';
import { ContactEmail } from '@/components/brand/ContactEmail';
import { CONTACT } from '@/lib/site';
import { MEETING_TOPICS, ZOOM_MEETING_DURATION, zoomMeetingUrlForTopic } from '@/lib/scheduling';
import styles from './ZoomMeetingScheduler.module.css';

/**
 * Contact page scheduler: pick what the meeting is about, then book a time in
 * the Zoom meeting modal. Every topic books the same Calendly event; the topic
 * is recorded on the booking so the host knows what to prepare for.
 */
export function ZoomMeetingScheduler() {
    const [open, setOpen] = useState(false);
    // Kept after closing so the modal's title does not change while it closes.
    const [topicId, setTopicId] = useState(MEETING_TOPICS[0].id);
    const topic = MEETING_TOPICS.find((entry) => entry.id === topicId) ?? MEETING_TOPICS[0];

    return (
        <div className={styles.wrapper}>
            <ul className={styles.topics}>
                {MEETING_TOPICS.map((entry) => (
                    <li key={entry.id} className={styles.item}>
                        <button
                            type="button"
                            className={`${styles.topic} glass-1`}
                            aria-haspopup="dialog"
                            onClick={() => {
                                setTopicId(entry.id);
                                setOpen(true);
                            }}
                        >
                            <span className={styles.topicLabel}>{entry.label}</span>
                            <span className={styles.topicDesc}>{entry.description}</span>
                            <span className={styles.topicAction}>
                                <Video size={16} strokeWidth={1.75} aria-hidden="true" />
                                Schedule on Zoom
                                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className={styles.arrow} />
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <p className={styles.note}>
                Each meeting is {ZOOM_MEETING_DURATION} on Zoom. Questions about scheduling? Email{' '}
                <a href={CONTACT.mailto} className={`${styles.email} mono`}>
                    <ContactEmail />
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
