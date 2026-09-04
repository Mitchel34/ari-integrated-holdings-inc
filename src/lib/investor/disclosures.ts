/**
 * @deprecated Compatibility shim. The public "Disclosures" section became
 * "Company Updates"; import from './updates' instead. Remove once no importer remains.
 */
export type {
    CompanyUpdate as DisclosureItem,
    UpdateCategory as DisclosureCategory,
    InvestorDocument,
    InvestorEvent,
} from './updates';
export {
    getCompanyUpdates as getDisclosures,
    getInvestorDocuments,
    getInvestorEvents,
    getUpcomingInvestorEvents,
    getNextInvestorEvent,
} from './updates';
