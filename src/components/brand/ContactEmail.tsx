import { CONTACT } from '@/lib/site';

const [USER, DOMAIN] = CONTACT.email.split('@');

/**
 * The correspondence address as text, with a line-break opportunity after the
 * "@" so the long address wraps cleanly in narrow columns instead of overflowing.
 */
export function ContactEmail() {
    return (
        <>
            {USER}@<wbr />{DOMAIN}
        </>
    );
}
