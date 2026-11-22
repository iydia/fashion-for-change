import { test, expect } from '@playwright/test';

const LINKTREE_URL = 'https://linktr.ee/fashionforchange';

test('Join FC points to the Linktree URL', async ({ page }) => {
    await page.goto('/');
    const joinLink = page.getByRole('link', { name: /Join FC/ });
    await expect(joinLink).toHaveAttribute('href', LINKTREE_URL);
    await expect(joinLink).toHaveAttribute('target', '_blank');
});

test('the FC logo links to the home page', async ({ page }) => {
    await page.goto('/');
    const logoLink = page.getByRole('link', { name: /Fashion for Change/ });
    await expect(logoLink).toHaveAttribute('href', '/');
    await expect(logoLink).not.toHaveAttribute('target', '_blank');
});

test('the footer Linktree link points to the Linktree URL', async ({ page }) => {
    await page.goto('/');
    const footerLink = page.getByRole('link', { name: /Find us on Linktree/ });
    await expect(footerLink).toHaveAttribute('href', LINKTREE_URL);
});

test('the before-2025 team page shows the exact archive message', async ({ page }) => {
    await page.goto('/team/before-2025');
    await expect(
        page.getByText('Fashion for Change began in 2016. Our digital archive is just getting started, and we’re adding earlier teams and memories over time.')
    ).toBeVisible();
});
