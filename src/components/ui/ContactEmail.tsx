import { CONTACT_EMAIL } from '@/lib/contact';

const [USER, DOMAIN] = CONTACT_EMAIL.split('@');

/**
 * The contact address as text, with a line-break opportunity after the "@"
 * so the long address wraps cleanly in narrow columns instead of overflowing.
 */
export function ContactEmail() {
    return (
        <>
            {USER}@<wbr />{DOMAIN}
        </>
    );
}
