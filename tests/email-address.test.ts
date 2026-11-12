import { describe, expect, it } from 'vitest';
import { isValidEmailAddress } from '@/lib/email-address';

describe('isValidEmailAddress', () => {
    it.each([
        'investor@example.com',
        'first.last+alerts@sub.example.co.uk',
        "o'brien@example.com",
        'a_b-c@example-fund.io',
    ])('accepts %s', (value) => {
        expect(isValidEmailAddress(value)).toBe(true);
    });

    it.each([
        ['empty', ''],
        ['no @', 'investor.example.com'],
        ['two @', 'a@b@example.com'],
        ['no dot in the domain', 'investor@example'],
        ['space', 'in vestor@example.com'],
        ['second recipient', 'a@example.com,b@example.com'],
        ['semicolon list', 'a@example.com;b@example.com'],
        ['mailto query', 'a@example.com?subject=x'],
        ['mailto field in the local part', 'x?bcc=attacker%40evil.example&subject=a@b.co'],
        ['angle brackets', '<a@example.com>'],
        ['quoted local part', '"a b"@example.com'],
        ['line break', 'a@example.com\r\nBcc: x@evil.example'],
        ['leading dot', '.a@example.com'],
        ['double dot', 'a..b@example.com'],
        ['empty domain label', 'a@example..com'],
        ['trailing comma', 'me@site.com,'],
        ['longer than a mailbox allows', `${'a'.repeat(250)}@example.com`],
    ])('rejects %s', (_label, value) => {
        expect(isValidEmailAddress(value)).toBe(false);
    });
});
