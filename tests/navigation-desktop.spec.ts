import { test, expect } from '@playwright/test';

test.describe('desktop navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('hovering a disclosure button opens its panel', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.hover();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('link', { name: 'Show Day' })).toBeVisible();
    });

    test('moving the pointer from the trigger into its panel keeps it open', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.hover();
        const link = page.getByRole('link', { name: 'Show Day' });
        await link.hover();
        await expect(link).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('clicking a disclosure button toggles its panel', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Our Team' });
        const link = page.getByRole('link', { name: '2026–2027' });

        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(link).toBeVisible();

        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('a[href="/team/2026-2027"]')).toBeHidden();
    });

    test('opening one dropdown closes any other open dropdown', async ({ page }) => {
        const gallery = page.getByRole('button', { name: 'Gallery' });
        const team = page.getByRole('button', { name: 'Our Team' });

        await gallery.click();
        await expect(gallery).toHaveAttribute('aria-expanded', 'true');

        await team.click();
        await expect(team).toHaveAttribute('aria-expanded', 'true');
        await expect(gallery).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('a[href="/gallery/show-day"]')).toBeHidden();
    });

    test('clicking outside the navigation closes an open dropdown', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');

        await page.getByRole('heading', { level: 1 }).click();

        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('a[href="/gallery/show-day"]')).toBeHidden();
    });

    test('Escape closes the dropdown and returns focus to its button', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');

        await page.keyboard.press('Escape');

        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();
    });

    test('Enter opens a focused disclosure button', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.focus();
        await page.keyboard.press('Enter');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('Space toggles a focused disclosure button', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Our Team' });
        await trigger.focus();
        await page.keyboard.press(' ');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('Tab from an open panel moves into its links without closing it', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.focus();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab');

        await expect(page.getByRole('link', { name: 'Show Day' })).toBeFocused();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('closed dropdown links are not keyboard-focusable', async ({ page }) => {
        await expect(page.locator('a[href="/gallery/show-day"]')).toBeHidden();

        await page.getByRole('link', { name: 'About', exact: true }).focus();
        await page.keyboard.press('Tab');

        await expect(page.getByRole('button', { name: 'Gallery' })).toBeFocused();
    });

    test('moving keyboard focus outside the navigation closes an open dropdown', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');

        await page.getByRole('link', { name: /Find us on Linktree/ }).focus();

        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('disclosure buttons expose accurate aria-controls', async ({ page }) => {
        const trigger = page.getByRole('button', { name: 'Gallery' });
        const panelId = await trigger.getAttribute('aria-controls');
        expect(panelId).toBeTruthy();

        await trigger.click();
        const panel = page.locator(`#${panelId}`);
        await expect(panel).toHaveCount(1);
        await expect(panel.getByRole('link', { name: 'Show Day' })).toHaveCount(1);
    });

    test('active page link gets aria-current', async ({ page }) => {
        await page.goto('/gallery/show-day');
        await expect(page.locator('a[href="/gallery/show-day"]')).toHaveAttribute('aria-current', 'page');
        await expect(page.locator('a[href="/gallery/holiday-market"]')).not.toHaveAttribute('aria-current', 'page');
    });
});
