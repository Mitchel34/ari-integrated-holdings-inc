// Scheduling configuration shared by the contact page and the dashboards.

/** Who to email about booking, rescheduling, or a meeting that will not schedule. */
export const SCHEDULING_CONTACT_EMAIL = 'mitchelcarson@ariintegratedholdings.com';

/**
 * Calendly event behind the Zoom meeting modal on the contact page. Calendly
 * creates the Zoom link when a time is booked. This is the same event the
 * portfolio site books; override it with NEXT_PUBLIC_CALENDLY_ZOOM_MEETING_URL.
 */
export const ZOOM_MEETING_URL =
    process.env.NEXT_PUBLIC_CALENDLY_ZOOM_MEETING_URL || 'https://calendly.com/mitchel-carson/30min';

/** Length of the event above, shown beside the booking button. */
export const ZOOM_MEETING_DURATION = '30 minutes';

/**
 * Add tracking parameters so the booking in Calendly shows that it came from
 * this site and which topic the visitor picked.
 */
export function zoomMeetingUrlForTopic(topicId: string): string {
    const url = new URL(ZOOM_MEETING_URL);
    url.searchParams.set('utm_source', 'ari-website');
    url.searchParams.set('utm_medium', 'contact-page');
    url.searchParams.set('utm_campaign', topicId);
    return url.toString();
}
