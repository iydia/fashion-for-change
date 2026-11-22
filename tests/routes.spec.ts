import { test, expect } from '@playwright/test';

const routes = [
    { path: '/', heading: 'Fashion for Change' },
    { path: '/about', heading: 'About' },
    { path: '/blog', heading: 'Blog' },
    { path: '/gallery/show-day', heading: 'Show Day' },
    { path: '/gallery/team-photoshoots', heading: 'Team Photoshoots' },
    { path: '/gallery/holiday-market', heading: 'Holiday Market' },
    { path: '/team/2026-2027', heading: '2026–2027' },
    { path: '/team/2025-2026', heading: '2025–2026' },
    { path: '/team/before-2025', heading: 'Before 2025' }
];

for (const { path, heading } of routes) {
    test(`direct load of ${path} responds and has one primary heading`, async ({ page }) => {
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);

        const h1 = page.getByRole('heading', { level: 1 });
        await expect(h1).toHaveCount(1);
        await expect(h1).toHaveText(heading);
        await expect(page).toHaveTitle(new RegExp(`Fashion for Change`));
    });
}
