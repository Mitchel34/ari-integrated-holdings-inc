/**
 * One address check for everything that accepts an email address from a
 * visitor: the contact form, the alert signup, and Reply-To headers.
 *
 * It is deliberately narrower than the RFC grammar. Besides the usual shape
 * (one "@", a dotted domain), it refuses the characters that carry meaning in
 * an address list or a mailto: link (`, ; ? & % < > " ( ) [ ] \ :`), so a
 * submitted "address" can never smuggle a second recipient or mailto fields
 * into a message or a link built from it.
 */
const LOCAL_PART = /^[^\s@,;:?&%<>"()[\]\\]+$/;
const DOMAIN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

/** Longest address a mailbox can have. */
export const EMAIL_ADDRESS_MAX = 254;

export function isValidEmailAddress(value: string): boolean {
    if (value.length === 0 || value.length > EMAIL_ADDRESS_MAX) {
        return false;
    }
    const at = value.lastIndexOf('@');
    if (at <= 0 || at !== value.indexOf('@')) {
        return false;
    }
    const local = value.slice(0, at);
    const domain = value.slice(at + 1);
    if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
        return false;
    }
    return LOCAL_PART.test(local) && DOMAIN.test(domain);
}
