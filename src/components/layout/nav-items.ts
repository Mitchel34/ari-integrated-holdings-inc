export interface NavItem {
    href: string;
    label: string;
    gated?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { href: '/thesis', label: 'Thesis' },
    { href: '/harmony', label: 'Harmony' },
    { href: '/disclosures', label: 'Disclosures' },
    { href: '/team', label: 'Team' },
    { href: '/investors', label: 'Investors' },
    { href: '/login', label: 'Investor Login', gated: true },
];
