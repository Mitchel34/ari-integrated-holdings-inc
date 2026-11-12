/**
 * Public meeting scheduling.
 *
 * Two mechanisms share this module:
 *
 * 1. The Zoom meeting event behind the contact-page scheduler. Every topic
 *    books the same Calendly event (Calendly creates the Zoom link on
 *    booking); the chosen topic is recorded on the booking as a tracking
 *    parameter so the host knows what to prepare for.
 * 2. Per-type Calendly events used by the signed-in dashboards. Each
 *    NEXT_PUBLIC_* variable is referenced literally so Next.js inlines it
 *    into client bundles; a type is only offered when its URL is set.
 *
 * `HAS_PUBLIC_BOOKING` is true when either mechanism is available, so a
 * public "Book a meeting" call to action never leads to a dead end.
 */

/**
 * A booking link is only usable when it is an absolute https URL. Anything
 * else (empty, whitespace, a bare host, a typo) counts as "not configured",
 * so a bad value hides the booking controls instead of breaking the page.
 */
function bookingUrl(raw: string): string {
    const value = raw.trim();
    if (!value) return '';
    try {
        return new URL(value).protocol === 'https:' ? value : '';
    } catch {
        return '';
    }
}

export interface MeetingTopic {
    id: string;
    label: string;
    description: string;
}

/** What a visitor can ask to talk about. All topics book the same Zoom event. */
export const MEETING_TOPICS: readonly MeetingTopic[] = [
    {
        id: 'intro',
        label: 'Introductory Call',
        description: 'Meet the leadership team and explore whether Ari aligns with your investment strategy.',
    },
    {
        id: 'briefing',
        label: 'Investor Briefing',
        description: 'Treasury framework review, diligence questions, and investment structure discussion.',
    },
    {
        id: 'partnership',
        label: 'Partnership Discussion',
        description: 'For institutional partners, strategic collaborators, and treasury service providers.',
    },
] as const;

/**
 * Calendly event behind the Zoom meeting modal. Calendly creates the Zoom link
 * when a time is booked. Override with NEXT_PUBLIC_CALENDLY_ZOOM_MEETING_URL;
 * set it to an empty string to turn public booking off.
 */
export const ZOOM_MEETING_URL: string = bookingUrl(
    process.env.NEXT_PUBLIC_CALENDLY_ZOOM_MEETING_URL ?? 'https://calendly.com/mitchel-carson/30min',
);

/** Length of the event above, shown beside the booking controls. */
export const ZOOM_MEETING_DURATION = '30 minutes';

/**
 * Add tracking parameters so the booking in Calendly shows that it came from
 * this site and which topic the visitor picked.
 */
export function zoomMeetingUrlForTopic(topicId: string): string {
    if (!ZOOM_MEETING_URL) return '';
    const url = new URL(ZOOM_MEETING_URL);
    url.searchParams.set('utm_source', 'ari-website');
    url.searchParams.set('utm_medium', 'contact-page');
    url.searchParams.set('utm_campaign', topicId);
    return url.toString();
}

export interface MeetingType extends MeetingTopic {
    duration: string;
    url: string;
}

const MEETING_TYPES: MeetingType[] = [
    { ...MEETING_TOPICS[0], duration: '30 min', url: bookingUrl(process.env.NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL ?? '') },
    { ...MEETING_TOPICS[1], duration: '60 min', url: bookingUrl(process.env.NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL ?? '') },
    { ...MEETING_TOPICS[2], duration: '45 min', url: bookingUrl(process.env.NEXT_PUBLIC_CALENDLY_PARTNERSHIP_URL ?? '') },
];

/** Per-type meeting events with a usable booking URL, in display order (dashboards). */
export function getConfiguredMeetingTypes(): MeetingType[] {
    return MEETING_TYPES.filter((type) => type.url.length > 0);
}

/** True when the Zoom meeting event is configured. */
export const HAS_ZOOM_BOOKING = ZOOM_MEETING_URL.length > 0;

/** True when at least one public meeting can be booked online. */
export const HAS_PUBLIC_BOOKING = HAS_ZOOM_BOOKING || getConfiguredMeetingTypes().length > 0;

/** Where the primary call to action should send people. */
export const PRIMARY_CTA = HAS_PUBLIC_BOOKING
    ? { label: 'Book a Meeting', href: '/contact#schedule' }
    : { label: 'Contact Us', href: '/contact' };
