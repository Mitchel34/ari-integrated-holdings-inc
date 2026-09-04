/**
 * Public meeting types backed by Calendly event URLs.
 *
 * Each NEXT_PUBLIC_* variable is referenced literally so Next.js inlines it
 * into client bundles. A meeting type is only offered when its URL is set,
 * so a public "Book a meeting" call to action never leads to a dead end.
 */

export interface MeetingType {
    id: string;
    label: string;
    duration: string;
    description: string;
    url: string;
}

const MEETING_TYPES: MeetingType[] = [
    {
        id: 'intro',
        label: 'Introductory Call',
        duration: '30 min',
        description: 'Meet the leadership team and explore whether Ari aligns with your investment strategy.',
        url: process.env.NEXT_PUBLIC_CALENDLY_EXEC_INTRO_URL ?? '',
    },
    {
        id: 'briefing',
        label: 'Investor Briefing',
        duration: '60 min',
        description: 'Treasury framework review, diligence questions, and investment structure discussion.',
        url: process.env.NEXT_PUBLIC_CALENDLY_INVESTOR_BRIEFING_URL ?? '',
    },
    {
        id: 'partnership',
        label: 'Partnership Discussion',
        duration: '45 min',
        description: 'For institutional partners, strategic collaborators, and treasury service providers.',
        url: process.env.NEXT_PUBLIC_CALENDLY_PARTNERSHIP_URL ?? '',
    },
];

/** Meeting types with a configured booking URL, in display order. */
export function getConfiguredMeetingTypes(): MeetingType[] {
    return MEETING_TYPES.filter((type) => type.url.trim().length > 0);
}

/** True when at least one public meeting type can be booked online. */
export const HAS_PUBLIC_BOOKING = getConfiguredMeetingTypes().length > 0;

/** Where the primary call to action should send people. */
export const PRIMARY_CTA = HAS_PUBLIC_BOOKING
    ? { label: 'Book a Meeting', href: '/contact#schedule' }
    : { label: 'Contact Us', href: '/contact' };
