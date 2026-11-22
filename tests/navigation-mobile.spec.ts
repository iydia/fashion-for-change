import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test.describe('mobile navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('navigation is hidden until the labeled menu toggle is used', async ({ page }) => {
        const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
        await expect(page.locator('a[href="/about"]')).toBeHidden();

        await toggle.tap();

        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    });

    test('Gallery expands by tap inside the open menu', async ({ page }) => {
        await page.getByRole('button', { name: 'Toggle navigation menu' }).tap();

        const galleryTrigger = page.getByRole('button', { name: 'Gallery' });
        await expect(page.locator('a[href="/gallery/show-day"]')).toBeHidden();

        await galleryTrigger.tap();

        await expect(galleryTrigger).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('link', { name: 'Show Day' })).toBeVisible();
    });

    test('Our Team expands by tap inside the open menu', async ({ page }) => {
        await page.getByRole('button', { name: 'Toggle navigation menu' }).tap();

        const teamTrigger = page.getByRole('button', { name: 'Our Team' });
        await teamTrigger.tap();

        await expect(teamTrigger).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('link', { name: 'Before 2025' })).toBeVisible();
    });

    test('choosing a destination closes the navigation', async ({ page }) => {
        // Prevent the link's default navigation so we can inspect the nav's
        // closed state on this same document, without leaving the page.
        await page.evaluate(() => {
            document.addEventListener(
                'click',
                (event) => {
                    if ((event.target as Element).closest('a')) event.preventDefault();
                },
                { capture: true }
            );
        });

        const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
        await toggle.tap();
        await page.getByRole('link', { name: 'About', exact: true }).click();

        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('a[href="/about"]')).toBeHidden();
    });

    test('closing the menu while focus is inside returns focus to the toggle', async ({ page }) => {
        const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
        await toggle.tap();
        await page.getByRole('link', { name: 'About', exact: true }).focus();

        await page.keyboard.press('Escape');

        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(toggle).toBeFocused();
    });
});
