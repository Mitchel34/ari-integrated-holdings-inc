import type { Metadata } from 'next';
import Link from 'next/link';
import { DocumentPage, type DocumentSection } from '../../components/layout/DocumentPage';
import legal from '../(legal)/legal.module.css';
import { CONTACT, SITE } from '../../lib/site';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'How Ari Integrated Holdings Inc. collects, uses, stores, and protects personal information submitted through its website, investor-alert list, and investor portal.',
    alternates: { canonical: '/privacy' },
};

const UPDATED = '2 September 2026';

const SECTIONS: DocumentSection[] = [
    { id: 'scope', title: 'Scope' },
    { id: 'information-we-collect', title: 'Information we collect' },
    { id: 'how-we-use-it', title: 'How we use it' },
    { id: 'legal-bases', title: 'Legal bases and consent' },
    { id: 'service-providers', title: 'Service providers' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'retention', title: 'Retention' },
    { id: 'your-rights', title: 'Your rights' },
    { id: 'security', title: 'Security' },
    { id: 'international-transfers', title: 'International transfers' },
    { id: 'children', title: 'Children' },
    { id: 'changes', title: 'Changes to this policy' },
    { id: 'contact', title: 'Contact' },
];

export default function PrivacyPage() {
    return (
        <DocumentPage
            eyebrow="Legal"
            title="Privacy Policy"
            lead={`What ${SITE.legalName} collects when you use this website, why, who processes it on our behalf, and how to ask us to change or delete it.`}
            updated={UPDATED}
            sections={SECTIONS}
            callout={
                <p>
                    <strong>In plain English:</strong> we collect only what you type into the contact form, the email
                    address you give us for investor alerts, the account details needed to run the password-protected
                    portal, and ordinary server logs. We use that information to answer you, send the alerts you asked
                    for, and keep the portal secure. We do not sell it, we do not run advertising trackers, and you can
                    unsubscribe or ask for deletion at any time by emailing {CONTACT.name}, our CTO, at{' '}
                    <a href={CONTACT.mailto}>{CONTACT.email}</a>.
                </p>
            }
        >
            <div className={legal.doc}>
                <h2 id="scope">Scope</h2>
                <p>
                    This Privacy Policy applies to the website at {SITE.domain} and any subdomains (the “Site”), operated by{' '}
                    {SITE.legalName} (“Ari”, “we”, “us”). It covers the public informational pages, the contact form, the
                    investor-alert email list, and the password-protected investor and executive portal.
                </p>
                <p>
                    It does not cover third-party websites we link to, including the pages of the ETF issuers whose products
                    are described on the Site, or the scheduling pages hosted by Calendly. Those services have their own
                    privacy policies.
                </p>

                <h2 id="information-we-collect">Information we collect</h2>
                <p>We collect four kinds of information, and only when you give it to us or your browser sends it.</p>
                <h3>Contact form</h3>
                <p>
                    When you submit the contact form we receive the fields you complete: your name, your email address, the
                    type of inquiry you select, and the message you write. Any other detail you choose to include in the
                    message is also stored.
                </p>
                <h3>Investor alerts</h3>
                <p>
                    When you sign up for investor alerts we store your email address, the date and time of signup, and the
                    page or form on the Site where you signed up (the “signup source”). We use the signup source to
                    understand which parts of the Site are useful and to confirm that a request was made on our own forms.
                </p>
                <h3>Portal accounts</h3>
                <p>
                    Investor and executive portal accounts are created by Ari, not by self-registration. For each account we
                    store a name, an email address used as the login, an assigned role (investor or executive), and a
                    password. Passwords are stored only as salted cryptographic hashes; we cannot read them and do not
                    transmit them in plain text. We also store the date and time of recent logins so that unusual activity
                    can be reviewed.
                </p>
                <h3>Technical logs</h3>
                <p>
                    Like any website, our hosting provider records standard server logs: the IP address of the requesting
                    device, the browser type and version, the pages requested, the time of the request, and any error that
                    occurred. These logs exist to keep the Site running and secure. We do not combine them with your name or
                    email address except when investigating a security incident.
                </p>

                <h2 id="how-we-use-it">How we use it</h2>
                <ul>
                    <li>To read and answer contact-form messages. Every inquiry is routed to {CONTACT.name}, {CONTACT.title}.</li>
                    <li>To send the investor alerts you asked for: treasury updates, disclosures, and meeting announcements.</li>
                    <li>To authenticate portal users, keep their sessions open, and limit each user to the pages their role allows.</li>
                    <li>To detect, investigate, and prevent abuse, unauthorized access, and technical faults.</li>
                    <li>To meet record-keeping duties that apply to a company communicating with its shareholders.</li>
                </ul>
                <p>
                    We do not use your information for advertising, we do not build profiles for marketing, and we do not
                    sell, rent, or trade personal information to anyone.
                </p>

                <h2 id="legal-bases">Legal bases and consent</h2>
                <p>Where a legal basis is required for processing, we rely on the following:</p>
                <ul>
                    <li>
                        <strong>Consent</strong> for the investor-alert list. You may withdraw consent at any time (see{' '}
                        <a href="#your-rights">Your rights</a>).
                    </li>
                    <li>
                        <strong>Performance of a contract, or steps taken at your request before one</strong> for answering
                        contact-form inquiries and operating portal accounts.
                    </li>
                    <li>
                        <strong>Legitimate interests</strong> for security logging, fraud prevention, and keeping the Site
                        available. We balance these interests against your rights and collect no more than the purpose needs.
                    </li>
                    <li>
                        <strong>Legal obligation</strong> where a law or regulator requires us to keep or disclose records.
                    </li>
                </ul>

                <h2 id="service-providers">Service providers</h2>
                <p>
                    We use four service providers to run the Site. Each processes data only on our instructions and only for
                    the purpose described. We do not share your information with any other third party unless the law
                    requires it.
                </p>
                <dl>
                    <dt>Vercel</dt>
                    <dd>Hosts the Site and serves its pages. Vercel handles the technical logs described above.</dd>
                    <dt>Neon (PostgreSQL)</dt>
                    <dd>
                        Stores the Site’s database: contact-form submissions, the investor-alert list, and portal account
                        records (with hashed passwords).
                    </dd>
                    <dt>Resend</dt>
                    <dd>
                        Delivers transactional email: the notification that reaches the CTO when you submit a form, and the
                        investor alerts you subscribe to. Resend processes the recipient address and message content in order
                        to deliver each email.
                    </dd>
                    <dt>Calendly</dt>
                    <dd>
                        Provides the meeting-scheduling embed. When you book a meeting you enter your details into
                        Calendly’s form, which is governed by Calendly’s privacy policy; Calendly then shares the booking
                        details with us so we can hold the meeting.
                    </dd>
                </dl>

                <h2 id="cookies">Cookies</h2>
                <p>
                    The Site sets cookies for one purpose only: keeping you signed in to the investor or executive portal.
                    Our authentication library (NextAuth) sets a session cookie and a small number of supporting cookies
                    (for example, a cross-site-request-forgery token) when you log in. These cookies are strictly necessary
                    for the portal to function, are marked HTTP-only and secure, and expire when the session ends or is
                    revoked.
                </p>
                <p>
                    We do not use advertising cookies, analytics trackers, social-media pixels, or fingerprinting of any
                    kind. Because we set no optional cookies, the Site does not show a cookie banner. If you block cookies in
                    your browser the public pages will work normally; the portal login will not.
                </p>

                <h2 id="retention">Retention</h2>
                <ul>
                    <li>
                        <strong>Contact-form submissions</strong> are kept for as long as needed to answer the inquiry and
                        for up to three years afterwards as a record of correspondence, unless you ask us to delete them
                        sooner.
                    </li>
                    <li>
                        <strong>Investor-alert addresses</strong> are kept until you unsubscribe or ask for deletion, after
                        which the address is removed from the active list. We may keep a minimal suppression record so that
                        we do not email you again by mistake.
                    </li>
                    <li>
                        <strong>Portal account records</strong> are kept while the account is active and for a reasonable
                        period after it is closed, as required by our record-keeping duties toward shareholders.
                    </li>
                    <li>
                        <strong>Technical logs</strong> are kept by our hosting provider for a short rolling period and are
                        then discarded.
                    </li>
                </ul>

                <h2 id="your-rights">Your rights</h2>
                <p>
                    Regardless of where you live, you can ask us to do any of the following. We will respond{' '}
                    {CONTACT.responseWindow} and will not charge for a reasonable request.
                </p>
                <ul>
                    <li>
                        <strong>Access:</strong> receive a copy of the personal information we hold about you.
                    </li>
                    <li>
                        <strong>Correction:</strong> have inaccurate or incomplete information corrected.
                    </li>
                    <li>
                        <strong>Deletion:</strong> have your information deleted, subject to any record we must keep by law
                        or to maintain your shareholder account.
                    </li>
                    <li>
                        <strong>Unsubscribe:</strong> stop receiving investor alerts. Reply to any alert with the word
                        “unsubscribe”, or email the CTO directly. We will remove you promptly and confirm by email.
                    </li>
                    <li>
                        <strong>Objection and restriction:</strong> object to processing based on legitimate interests, or
                        ask us to restrict processing while a dispute is resolved.
                    </li>
                </ul>
                <p>
                    To exercise any of these rights, email {CONTACT.name} at <a href={CONTACT.mailto}>{CONTACT.email}</a>{' '}
                    from the address we hold for you, or tell us how we can verify that the request is yours. If you are in
                    a jurisdiction with a data-protection authority you also have the right to lodge a complaint with it.
                </p>

                <h2 id="security">Security</h2>
                <p>
                    The Site is served over HTTPS only. Portal passwords are hashed with a modern, salted algorithm and are
                    never stored in readable form. Session cookies are HTTP-only and secure. Database access is limited to
                    the application and to the executives who administer it, and connections to the database are encrypted
                    in transit. Portal accounts are created and revoked by Ari, so no one can register for access on their
                    own.
                </p>
                <p>
                    No method of transmission or storage is perfectly secure. If we become aware of a breach that affects
                    your personal information we will notify you and any relevant authority as the law requires, using the
                    email address we hold for you.
                </p>

                <h2 id="international-transfers">International transfers</h2>
                <p>
                    Our service providers operate data centres in the United States and may process information there or in
                    other countries where they have infrastructure. If you access the Site from outside the country where
                    the data is stored, your information will be transferred across borders. Each provider commits, in its
                    terms with us, to protect personal information in line with recognised data-protection standards.
                </p>

                <h2 id="children">Children</h2>
                <p>
                    The Site is intended for adults: accredited investors, family offices, partners, and other professional
                    contacts. We do not knowingly collect personal information from anyone under 18. If you believe a child
                    has provided information to us, email the CTO and we will delete it.
                </p>

                <h2 id="changes">Changes to this policy</h2>
                <p>
                    We may update this policy when the Site, our service providers, or the law changes. The date at the top
                    of this page shows when it was last revised. If a change materially affects how we use information
                    already collected, we will tell investor-alert subscribers and portal users by email before it takes
                    effect. Continued use of the Site after a change means you accept the revised policy.
                </p>

                <h2 id="contact">Contact</h2>
                <p>
                    Questions, requests, and notices about privacy go to {CONTACT.name}, {CONTACT.title}, at{' '}
                    <a href={CONTACT.mailto}>{CONTACT.email}</a>. All correspondence with {SITE.shortName} is routed to the
                    CTO. You can also use the <Link href="/contact">contact form</Link>.
                </p>
                <p>
                    See also our <Link href="/terms">Terms of Service</Link> and <Link href="/disclaimer">Disclaimer</Link>.
                </p>
            </div>
        </DocumentPage>
    );
}
