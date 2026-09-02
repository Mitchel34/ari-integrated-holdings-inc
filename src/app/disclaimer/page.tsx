import type { Metadata } from 'next';
import Link from 'next/link';
import { DocumentPage, type DocumentSection } from '../../components/layout/DocumentPage';
import legal from '../(legal)/legal.module.css';
import { ALLOCATION, CONTACT, SITE } from '../../lib/site';
import { getTreasuryFreshness, getTreasurySnapshot } from '../../lib/treasury/snapshot';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description:
        'Important limitations on the information published by Ari Integrated Holdings Inc.: no investment advice, no offer of securities, digital-asset and ETF risks, and the illustrative nature of performance figures.',
    alternates: { canonical: '/disclaimer' },
};

const UPDATED = '2 September 2026';

const SECTIONS: DocumentSection[] = [
    { id: 'no-investment-advice', title: 'No investment advice' },
    { id: 'no-offer', title: 'No offer or solicitation' },
    { id: 'forward-looking', title: 'Forward-looking statements' },
    { id: 'digital-asset-risks', title: 'Digital-asset risks' },
    { id: 'etf-risks', title: 'ETF wrapper risks' },
    { id: 'illustrative-performance', title: 'Illustrative performance figures' },
    { id: 'harmony-risks', title: 'Harmony Trading risks' },
    { id: 'accuracy', title: 'Accuracy and timeliness of information' },
    { id: 'consult-your-advisers', title: 'Consult your advisers' },
    { id: 'contact', title: 'Contact' },
];

function formatLongDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export default function DisclaimerPage() {
    const snapshot = getTreasurySnapshot();
    const freshness = getTreasuryFreshness(snapshot);
    const asOf = formatLongDate(snapshot.asOfIso);

    return (
        <DocumentPage
            eyebrow="Legal"
            title="Disclaimer"
            lead={`The limits of what this website can tell you about ${SITE.legalName}, its treasury, and the assets it holds.`}
            updated={UPDATED}
            sections={SECTIONS}
            callout={
                <p>
                    <strong>In plain English:</strong> this site explains how {SITE.shortName} runs a small, early-stage
                    digital-asset treasury. It is not advice and not an offer of shares. Bitcoin, Ethereum, and Solana
                    are volatile and can lose most of their value; the ETFs we hold add their own costs and risks; the
                    historical growth rates on the Thesis page are rough illustrations, not forecasts; and the treasury
                    figures are copied by hand from CFO reports and may be out of date. Make your own decisions with
                    your own advisers, and send questions to {CONTACT.name}, CTO, at{' '}
                    <a href={CONTACT.mailto}>{CONTACT.email}</a>.
                </p>
            }
        >
            <div className={legal.doc}>
                <h2 id="no-investment-advice">No investment advice</h2>
                <p>
                    Nothing on this website is investment, financial, legal, accounting, or tax advice, and nothing on it is
                    a recommendation to buy, sell, or hold any asset. The allocation framework, thesis, and commentary
                    published here describe how {SITE.legalName} (“Ari”, “we”) manages its own treasury. They are not
                    tailored to your circumstances, objectives, or risk tolerance, and they should not be relied on as a
                    basis for any decision about your own money.
                </p>
                <p>
                    Ari is not a registered investment adviser, broker-dealer, or fund manager, and does not act in any such
                    capacity for anyone who reads this site.
                </p>

                <h2 id="no-offer">No offer or solicitation</h2>
                <p>
                    Nothing on this website is an offer to sell, or a solicitation of an offer to buy, shares of Ari or any
                    other security, token, fund, or financial instrument, in any jurisdiction. Any offering of Ari securities
                    would be made only to eligible persons, only through definitive offering documents, and only where such
                    an offering is lawful. Descriptions of the company’s share structure, share count, or net asset value on
                    this site are informational disclosures to existing and prospective stakeholders and are not terms of any
                    offer.
                </p>

                <h2 id="forward-looking">Forward-looking statements</h2>
                <p>
                    This website contains forward-looking statements: statements about a ten-year investment horizon, the
                    expected role of each asset in the treasury, planned rebalancing, the development of AI-assisted
                    oversight and the Harmony Trading App, and the possible future value of digital assets. Words such as
                    “expect”, “target”, “plan”, “optionality”, “upside”, and “horizon” identify them.
                </p>
                <p>
                    Forward-looking statements are based on management’s current views and assumptions and are subject to
                    risks and uncertainties, many of which are outside Ari’s control. Actual results may differ materially.
                    We undertake no obligation to update any forward-looking statement, except as required by law.
                </p>

                <h2 id="digital-asset-risks">Digital-asset risks</h2>
                <p>
                    The treasury’s exposure is to Bitcoin, Ethereum, and Solana. These assets carry risks that are different
                    from, and in several respects greater than, those of traditional securities.
                </p>
                <ul>
                    <li>
                        <strong>Volatility.</strong> Daily price moves of 10% or more are common. The value of the treasury
                        can change materially between the “as of” date of a report and the day you read it.
                    </li>
                    <li>
                        <strong>Drawdowns.</strong> Each of these assets has previously fallen by more than half from a prior
                        peak, sometimes for years at a time. An investor must be prepared for the possibility of losing most
                        or all of the value of a position.
                    </li>
                    <li>
                        <strong>Regulatory.</strong> The legal treatment of digital assets, the funds that hold them, and the
                        companies that hold those funds is unsettled and varies by jurisdiction. New laws, enforcement actions,
                        tax rules, or accounting standards could adversely affect the value or the permissibility of the
                        treasury’s holdings.
                    </li>
                    <li>
                        <strong>Technological.</strong> Blockchain networks can suffer outages, consensus failures, contested
                        upgrades, or exploits. Solana in particular has experienced network halts. A protocol-level fault could
                        reduce the value of the underlying asset regardless of the ETF wrapper.
                    </li>
                    <li>
                        <strong>Liquidity.</strong> In stressed markets, bids can disappear and spreads can widen sharply.
                        Positions may not be saleable at the quoted price, or at all, at the moment liquidity is needed.
                    </li>
                    <li>
                        <strong>Concentration.</strong> The treasury is concentrated in three correlated assets within a single
                        emerging sector. It is not diversified in the way a conventional portfolio would be.
                    </li>
                </ul>

                <h2 id="etf-risks">ETF wrapper risks</h2>
                <p>
                    Ari obtains its exposure through exchange-traded funds rather than by holding tokens directly:{' '}
                    {ALLOCATION.map((a, index) => (
                        <span key={a.etf}>
                            {a.etf} ({a.etfName}) for {a.name}
                            {index < ALLOCATION.length - 1 ? ', ' : '.'}
                        </span>
                    ))}{' '}
                    This choice simplifies custody and accounting, but it introduces risks of its own.
                </p>
                <ul>
                    <li>
                        <strong>Premiums and discounts.</strong> An ETF’s market price can trade above or below the value of
                        the assets it holds, especially in fast or thinly traded markets. The treasury’s reported market value
                        reflects the ETF price, not the spot price of the underlying asset.
                    </li>
                    <li>
                        <strong>Fees.</strong> Each fund charges an annual sponsor fee that is deducted from its assets. Over a
                        ten-year horizon those fees compound and cause the fund to lag the underlying asset.
                    </li>
                    <li>
                        <strong>Issuer and custodian risk.</strong> The funds depend on their sponsors, custodians, and
                        authorized participants. A failure, fraud, or regulatory action at any of those parties, or a decision
                        to liquidate a fund, could result in loss or forced disposal at an inopportune time.
                    </li>
                    <li>
                        <strong>Tracking and structure.</strong> The funds may not perfectly track their reference prices, and
                        some newer digital-asset ETFs, including Solana products, have short operating histories and
                        relatively small asset bases.
                    </li>
                    <li>
                        <strong>No direct ownership.</strong> Holding an ETF share is not the same as holding the token. Ari
                        does not control private keys, cannot participate directly in network staking or governance through
                        these positions, and is exposed to the fund’s terms rather than the protocol’s.
                    </li>
                </ul>
                <p>
                    The funds are issued by their respective sponsors, not by Ari. Read each fund’s prospectus for a full
                    description of its risks before drawing any conclusion from its appearance on this site.
                </p>

                <h2 id="illustrative-performance">Illustrative performance figures</h2>
                <p>
                    The <Link href="/thesis">Thesis</Link> page includes an illustrative five-year compound annual growth
                    rate (CAGR) analysis for Bitcoin, Ethereum, and Solana, and explains why a ten-year comparison is not yet
                    statistically robust. Those figures are approximate, are rounded, depend heavily on the start and end
                    dates chosen, and are provided only to explain the reasoning behind the 50 / 30 / 20 allocation.
                </p>
                <p>
                    Past performance is not indicative of future results. A historical CAGR is not a forecast, not a target
                    return, and not a promise of any kind. Assets that have compounded rapidly in the past have also suffered
                    severe losses, and there is no assurance that any of these assets will appreciate over any period. The
                    treasury’s own results will additionally reflect ETF fees, timing of purchases, cash held in reserve,
                    and any activity of the supporting subsidiary.
                </p>

                <h2 id="harmony-risks">Harmony Trading risks</h2>
                <p>
                    The <Link href="/harmony">Harmony Trading App</Link> is Ari’s operating subsidiary, which applies a small
                    portion of assets to algorithmic trading within strict risk limits, with the aim of offsetting operating
                    costs and serving as a testing ground for analytics that inform the treasury. Its activity carries
                    risks that are distinct from the buy-and-hold treasury.
                </p>
                <ul>
                    <li>
                        Algorithmic strategies can fail. Models fitted to past data may not work in future conditions, and
                        software, data-feed, exchange, or connectivity faults can produce losses faster than a human can
                        intervene.
                    </li>
                    <li>
                        Risk limits reduce, but do not eliminate, the possibility of loss. The capital allocated to Harmony
                        could be lost in full.
                    </li>
                    <li>
                        Any statement that Harmony offsets operating costs describes an objective, not a guaranteed
                        outcome. Its contribution may be negative in any period.
                    </li>
                    <li>
                        Harmony is under active development. Features described on this site may change, be delayed, or be
                        withdrawn.
                    </li>
                </ul>

                <h2 id="accuracy">Accuracy and timeliness of information</h2>
                <p>
                    Treasury data on this site (holdings, cost basis, market value, cash, share count, and net asset value
                    per share) is entered manually from internal CFO reports. It is not fed from a live market or custodial
                    source. Each figure carries an “as of” date and a source label, and the site flags a snapshot as stale
                    once it is more than two weeks old.
                </p>
                <p>
                    The snapshot currently published is dated <span className="mono">{asOf}</span> (source:{' '}
                    {snapshot.sourceLabel.toLowerCase()}) and, as of the date at the top of this page, is flagged{' '}
                    <strong>{freshness.status}</strong>
                    {freshness.status === 'stale' ? ' because it is more than two weeks old' : ''}. Values may have changed
                    materially since then. Do not rely on any figure on this site as a current valuation.
                </p>
                <p>
                    We try to keep every page accurate, but the site may contain typographical errors, omissions, or
                    information that has been superseded. Formal disclosures to shareholders are delivered through the
                    investor portal and by email; where a figure on a public page conflicts with a formal disclosure, the
                    formal disclosure governs.
                </p>

                <h2 id="consult-your-advisers">Consult your advisers</h2>
                <p>
                    Before making any decision that involves Ari, digital assets, or the funds described here, consult your
                    own independent financial, legal, tax, and accounting advisers. Only they can assess whether such an
                    exposure is suitable for you. Nothing on this site creates an adviser-client, fiduciary, or other
                    professional relationship between you and Ari.
                </p>

                <h2 id="contact">Contact</h2>
                <p>
                    Questions about this disclaimer, or about any figure or statement on the site, go to {CONTACT.name},{' '}
                    {CONTACT.title}, at <a href={CONTACT.mailto}>{CONTACT.email}</a>. All correspondence with{' '}
                    {SITE.shortName} is routed to the CTO. You can also use the <Link href="/contact">contact form</Link>.
                </p>
                <p>
                    See also our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
                </p>
            </div>
        </DocumentPage>
    );
}
