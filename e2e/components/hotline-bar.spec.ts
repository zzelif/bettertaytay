import { test, expect } from '../test-config';

test.describe('HotlineBar Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a standard non-admin route (e.g. Home)
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('renders on non-admin routes but not on admin routes', async ({ page }) => {
    const hotlineBar = page.locator('[data-testid="hotline-bar"]');
    await expect(hotlineBar).toBeVisible({ timeout: 15000 });

    // Visit admin dashboard route
    await page.goto('/admin');
    await expect(hotlineBar).not.toBeVisible();
  });

  test('desktop layout displays 6 core hotlines without icons', async ({ page }) => {
    // Set desktop viewport size
    await page.setViewportSize({ width: 1280, height: 800 });

    const hotlineBar = page.locator('[data-testid="hotline-bar"]');
    await expect(hotlineBar).toBeVisible();

    // Verify desktop container is visible and mobile container is hidden
    await expect(hotlineBar.locator('.hidden.md\\:flex')).toBeVisible();
    await expect(hotlineBar.locator('.flex.md\\:hidden')).toBeHidden();

    // Check header text is present
    await expect(hotlineBar.locator('text=EMERGENCY HOTLINES')).toBeVisible();

    // Verify 6 core hotlines are rendered on desktop with correct tel links
    const coreHotlines = [
      { id: 'desktop-hotline-911-national', label: '911 National', number: 'tel:911' },
      { id: 'desktop-hotline-mdrrmo-rescue', label: 'MDRRMO Rescue', number: 'tel:09526199511' },
      { id: 'desktop-hotline-pnp-police', label: 'PNP Police', number: 'tel:09171633556' },
      { id: 'desktop-hotline-bfp-fire', label: 'BFP Fire', number: 'tel:09171489964' },
      { id: 'desktop-hotline-teh-hospital', label: 'TEH Hospital', number: 'tel:09817543554' },
      { id: 'desktop-hotline-mswdo-welfare', label: 'MSWDO Welfare', number: 'tel:09212843685' },
    ];

    for (const item of coreHotlines) {
      const link = page.locator(`[data-testid="${item.id}"]`);
      await expect(link).toBeVisible();
      await expect(link).toContainText(item.label);
      await expect(link).toHaveAttribute('href', item.number);
      
      // Crucial: Check that no icons (SVGs) are rendered in this link
      const iconCount = await link.locator('svg').count();
      expect(iconCount).toBe(0);
    }
  });

  test('mobile layout displays horizontal marquee without icons', async ({ page }) => {
    // Set mobile viewport size
    await page.setViewportSize({ width: 375, height: 667 });

    const hotlineBar = page.locator('[data-testid="hotline-bar"]');
    await expect(hotlineBar).toBeVisible();

    // Verify mobile container is visible and desktop container is hidden
    await expect(hotlineBar.locator('.flex.md\\:hidden')).toBeVisible();
    await expect(hotlineBar.locator('.hidden.md\\:flex')).toBeHidden();

    // Check emergency badge is visible on mobile (using precise text match to avoid sub-string collision)
    await expect(hotlineBar.locator('.flex.md\\:hidden').getByText('Hotlines:', { exact: true })).toBeVisible();

    // Check mobile hotline links, ensuring they contain correct text labels and no SVGs
    for (let i = 0; i < 10; i++) {
      const link = page.locator(`[data-testid="mobile-hotline-${i}"]`).first();
      await expect(link).toBeVisible();
      
      // Crucial: Check that no icons (SVGs) are rendered in this link
      const iconCount = await link.locator('svg').count();
      expect(iconCount).toBe(0);
    }
  });

  test('uses Kapwa semantic design colors', async ({ page }) => {
    const hotlineBar = page.locator('[data-testid="hotline-bar"]');
    await expect(hotlineBar).toBeVisible();

    // Verify it uses the specified Kapwa red gradient and text styling
    const classes = await hotlineBar.getAttribute('class');
    expect(classes).toContain('bg-linear-to-br');
    expect(classes).toContain('from-kapwa-red-600');
    expect(classes).toContain('to-kapwa-red-800');
    expect(classes).toContain('text-kapwa-text-inverse');
  });
});
