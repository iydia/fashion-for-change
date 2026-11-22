import { teamYears } from '../data/teams';

export type NavLink = {
    label: string;
    href: string;
};

export type NavDisclosure = {
    label: string;
    items: NavLink[];
};

export type NavItem = NavLink | NavDisclosure;

export function isNavDisclosure(item: NavItem): item is NavDisclosure {
    return 'items' in item;
}

export const primaryNavigation: NavItem[] = [
    { label: 'About', href: '/about' },
    {
        label: 'Gallery',
        items: [
            { label: 'Show Day', href: '/gallery/show-day' },
            { label: 'Team Photoshoots', href: '/gallery/team-photoshoots' },
            { label: 'Holiday Market', href: '/gallery/holiday-market' }
        ]
    },
    { label: 'Blog', href: '/blog' },
    {
        label: 'Our Team',
        items: [
            ...teamYears.map((year) => ({ label: year.label, href: `/team/${year.slug}` })),
            { label: 'Before 2025', href: '/team/before-2025' }
        ]
    }
];
