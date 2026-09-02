import type { Metadata } from 'next';
import Link from 'next/link';
import { DocumentPage, type DocumentSection } from '../../components/layout/DocumentPage';
import legal from '../(legal)/legal.module.css';
import { ALLOCATION, CONTACT, SITE } from '../../lib/site';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description:
        'The terms that govern use of the Ari Integrated Holdings Inc. website and its password-protected investor and executive portal.',
    alternates: { canonical: '/terms' },
};

const UPDATED = '2 September 2026';

const SECTIONS: DocumentSection[] = [
    { id: 'acceptance', title: 'Acceptance' },
    { id: 'informational-purpose', title: 'Informational purpose' },
    { id: 'portal-access', title: 'Investor portal access' },
    { id: 'acceptable-use', title: 'Acceptable use' },
    { id: 'intellectual-property', title: 'Intellectual property' },
    { id: 'third-party-services', title: 'Third-party services and links' },
    { id: 'disclaimers', title: 'Disclaimers of warranties' },
    { id: 'limitation-of-liability', title: 'Limitation of liability' },
    { id: 'indemnification', title: 'Indemnification' },
    { id: 'governing-law', title: 'Governing law' },
    { id: 'changes', title: 'Changes to these terms' },
    { id: 'contact', title: 'Contact' },
];

const ETF_LIST = ALLOCATION.map((a) => `${a.etf} (${a.etfName})`).join(', ');

export default function TermsPage() {
    return (
        <DocumentPage
            eyebrow="Legal"
            title="Terms of Service"
            lead={`The rules for using the ${SITE.shortName} website and the investor portal.`}
            updated={UPDATED}
            sections={SECTIONS}
            callout={
                <p>
                    <strong>In plain English:</strong> this website describes {SITE.legalName} and its treasury. It is
                    information, not an offer to sell securities and not investment advice. If you have been given a
                    portal login, keep it to yourself and use it only as an authorized person. We provide the site as-is,
                    we limit our liability to the extent the law allows, and any dispute is governed by the law of the
                    jurisdiction in which the company is organized. Questions go to {CONTACT.name}, CTO, at{' '}
                    <a href={CONTACT.mailto}>{CONTACT.email}</a>.
                </p>
            }
        >
            <div className={legal.doc}>
                <h2 id="acceptance">Acceptance</h2>
                <p>
                    These Terms of Service (the “Terms”) are an agreement between you and {SITE.legalName} (“Ari”, “we”,
                    “us”) covering the website at {SITE.domain} and its subdomains (the “Site”), including the public pages,
                    the contact form, the investor-alert list, and the password-protected investor and executive portal (the
                    “Portal”).
                </p>
                <p>
                    By opening the Site, submitting a form, subscribing to alerts, or logging in to the Portal, you accept
                    these Terms and our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the
                    Site. If you use the Site on behalf of a company, fund, or family office, you confirm that you are
                    authorized to bind it to these Terms.
                </p>

                <h2 id="informational-purpose">Informational purpose</h2>
                <p>
                    The Site exists to describe Ari, its treasury strategy, its supporting subsidiary, and its leadership,
                    and to publish disclosures for existing shareholders. Everything on it is provided for general
                    information only.
                </p>
                <ul>
                    <li>
                        Nothing on the Site is an offer to sell, or a solicitation of an offer to buy, any security,
                        share, token, ETF, or other financial instrument, in any jurisdiction. Any offering of Ari securities
                        is made only through definitive documents delivered to eligible persons, and only where lawful.
                    </li>
                    <li>
                        Nothing on the Site is investment, legal, accounting, or tax advice, and nothing on it is tailored
                        to your circumstances. Consult your own advisers before making any decision.
                    </li>
                    <li>
                        Treasury figures shown on the Site are drawn manually from internal CFO reports and carry an “as of”
                        date. They may be out of date and are not a live valuation.
                    </li>
                </ul>
                <p>
                    Our <Link href="/disclaimer">Disclaimer</Link> sets out the risks and limitations of the information on
                    the Site in more detail and forms part of these Terms.
                </p>

                <h2 id="portal-access">Investor portal access</h2>
                <p>
                    The Portal is a private area for shareholders, prospective investors we have specifically invited, and
                    Ari executives. Access is granted only by Ari; there is no self-registration.
                </p>
                <h3>Credentials</h3>
                <p>
                    You are responsible for the confidentiality of any login credentials issued to you and for everything
                    done under them. Do not share credentials, do not let anyone else use your session, and tell the CTO
                    immediately if you suspect your credentials have been compromised.
                </p>
                <h3>Authorized users</h3>
                <p>
                    Portal accounts are personal to the individual named on them. An institution that receives access may
                    allow only the specific individuals we have approved to use it. Information in the Portal is provided
                    for your own evaluation of Ari and may not be redistributed, published, or shared with third parties
                    without our written consent, except to your professional advisers under a duty of confidence.
                </p>
                <h3>Revocation</h3>
                <p>
                    We may suspend or revoke Portal access at any time, with or without notice, including when a
                    shareholding ends, an authorized person leaves an institution, an account is inactive, or we believe
                    these Terms have been breached. Revocation does not affect any rights you have as a shareholder under
                    law or under Ari’s governing documents.
                </p>

                <h2 id="acceptable-use">Acceptable use</h2>
                <p>You agree not to, and not to help anyone else to:</p>
                <ul>
                    <li>Attempt to access any part of the Site, Portal, database, or infrastructure that you are not authorized to use.</li>
                    <li>Probe, scan, or test the Site for vulnerabilities, or circumvent any authentication or rate limit.</li>
                    <li>Use automated tools to scrape, copy, or index the Portal or to submit forms at volume.</li>
                    <li>Submit false, misleading, or defamatory information through the contact form or alert signup.</li>
                    <li>Impersonate Ari, its executives, or any other person, or misrepresent your affiliation.</li>
                    <li>Introduce malware or otherwise interfere with the operation of the Site.</li>
                    <li>Use the Site for any purpose that is unlawful where you are or where we are.</li>
                </ul>
                <p>
                    If you find a security weakness in the Site, please report it to the CTO rather than exploiting it. We
                    will treat good-faith reports as such.
                </p>

                <h2 id="intellectual-property">Intellectual property</h2>
                <p>
                    The Site, including its text, graphics, layout, the Ari name and lion emblem, and the content of
                    disclosures and Portal documents, is owned by Ari or its licensors and is protected by copyright,
                    trademark, and other laws. Ticker symbols and ETF names belong to their respective issuers.
                </p>
                <p>
                    You may view the public pages and print or save copies for your own non-commercial reference, provided
                    you keep all notices intact. You may not otherwise reproduce, modify, distribute, or create derivative
                    works from any part of the Site without our written permission. Nothing on the Site grants you a
                    licence to use any Ari trademark.
                </p>

                <h2 id="third-party-services">Third-party services and links</h2>
                <p>
                    The Site uses Calendly to schedule meetings. When you book a meeting you are using Calendly’s service
                    under Calendly’s own terms and privacy policy; we do not control that service and are not responsible
                    for it.
                </p>
                <p>
                    The Site describes exchange-traded funds through which Ari holds its digital-asset exposure, currently{' '}
                    {ETF_LIST}. Those funds are issued and managed by their respective sponsors, not by Ari. Any link to an
                    issuer’s prospectus, website, or fund page is provided for convenience. We do not endorse those issuers
                    or vouch for the accuracy of their materials, and any investment you make in those funds is entirely
                    your own decision and your own relationship with the issuer.
                </p>
                <p>
                    More generally, links from the Site to other websites do not imply endorsement, and we are not
                    responsible for the content, availability, or practices of any site we do not operate.
                </p>

                <h2 id="disclaimers">Disclaimers of warranties</h2>
                <p>
                    The Site and everything on it are provided “as is” and “as available”. To the fullest extent permitted by
                    law, Ari disclaims all warranties, express or implied, including warranties of merchantability, fitness
                    for a particular purpose, title, non-infringement, accuracy, and uninterrupted or error-free operation.
                </p>
                <p>
                    We do not warrant that treasury figures, allocation targets, performance illustrations, or other
                    information on the Site are complete, current, or free of error, or that the Site will be secure or
                    available at any particular time. Digital-asset markets move quickly; the figures shown may differ
                    materially from current values.
                </p>

                <h2 id="limitation-of-liability">Limitation of liability</h2>
                <p>
                    To the fullest extent permitted by law, Ari and its directors, officers, employees, and agents will not
                    be liable to you for any indirect, incidental, special, consequential, or punitive damages, or for any
                    loss of profits, revenue, data, or investment value, arising out of or relating to your use of, or
                    inability to use, the Site, however caused and under any theory of liability, even if we have been
                    advised of the possibility of such damages.
                </p>
                <p>
                    If, notwithstanding the above, we are found liable to you in connection with the Site, our liability is
                    limited to the fullest extent permitted by law. Some jurisdictions do not allow certain limitations,
                    so parts of this section may not apply to you; in that case our liability is limited to the greatest
                    extent the law allows.
                </p>
                <p>
                    Nothing in these Terms limits or excludes liability that cannot be limited or excluded by law, including
                    liability for fraud. Nothing in these Terms limits any right you hold as a shareholder of Ari.
                </p>

                <h2 id="indemnification">Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless Ari and its directors, officers, employees, and agents from
                    any claim, loss, liability, or expense (including reasonable legal fees) arising from your breach of
                    these Terms, your misuse of the Site or Portal, your sharing of Portal credentials or content in breach
                    of these Terms, or your violation of any law or third-party right in connection with the Site.
                </p>

                <h2 id="governing-law">Governing law</h2>
                <p>
                    These Terms, and any dispute or claim arising out of or relating to them or to the Site, are governed by
                    the laws of the jurisdiction in which {SITE.legalName} is organized, without regard to its
                    conflict-of-laws rules. You agree that the courts of that jurisdiction have exclusive jurisdiction over
                    any such dispute, and you waive any objection to venue there. If you are a consumer, nothing in this
                    section deprives you of protections that the law of your place of residence grants and does not allow
                    to be waived.
                </p>
                <h2 id="changes">Changes to these terms</h2>
                <p>
                    We may revise these Terms when the Site, the Portal, our service providers, or the law changes. The date
                    at the top of this page shows the current version. Material changes that affect Portal users will be
                    announced by email to the address on the account before they take effect. Continued use of the Site
                    after a change means you accept the revised Terms. If any provision is found unenforceable, the rest
                    remains in effect.
                </p>

                <h2 id="contact">Contact</h2>
                <p>
                    Notices, questions, and security reports under these Terms go to {CONTACT.name}, {CONTACT.title}, at{' '}
                    <a href={CONTACT.mailto}>{CONTACT.email}</a>. All correspondence with {SITE.shortName} is routed to the
                    CTO. You can also use the <Link href="/contact">contact form</Link>.
                </p>
                <p>
                    See also our <Link href="/privacy">Privacy Policy</Link> and <Link href="/disclaimer">Disclaimer</Link>.
                </p>
            </div>
        </DocumentPage>
    );
}
