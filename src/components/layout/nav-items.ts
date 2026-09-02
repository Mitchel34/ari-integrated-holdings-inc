import { PRIMARY_NAV } from '@/lib/site';

export interface NavItem {
    href: string;
    label: string;
}

export const NAV_ITEMS: NavItem[] = PRIMARY_NAV.map((item) => ({ ...item }));
