import { test, expect } from '@playwright/test';

test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });

  test('has title', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('Agora | Explore Alzheimer\'s Disease Genes');
  });

  test('has header', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Expect header to be visible
    await expect(page.locator('div#header')).toBeVisible();
  });

  test('has heading', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Expect header to be visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('has footer', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Expect header to be visible
    await expect(page.locator('#footer')).toBeVisible();
  });

  test('has news', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Hamburger menu should be hidden for the given viewport above
    expect(page.locator('button.header-nav-toggle')).toBeHidden();
    
    // look for news link and click it
    await page.locator('a span', { hasText: 'News' }).click();

    // title check
    await expect(page).toHaveTitle('News | Agora Releases');
  });
});