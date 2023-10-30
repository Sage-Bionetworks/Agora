import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/genes/comparison');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Gene Comparison | Visual comparison tool for AD genes');
});

test('shows chiclet properly', async ({ page }) => {
  test.slow();
  
  await page.goto('/genes/comparison');

  // close the Gene Comparison Overview window
  await page.getByLabel('close dialog').click();

  expect(page.locator('h1')).toBeVisible();
  expect(page.locator('h1')).toContainText('Gene Comparison Tool');

  expect(page.locator('div.gene-label')).toBeVisible();

  // expect no chiclets and therefore no CLEAR ALL button
  const clearAllButton = page.getByRole('button', { name: 'CLEAR ALL'});
  expect(clearAllButton).not.toBeVisible();

  const filterGenesButton = page.getByRole('button', { name: 'Filter Genes' });
  await filterGenesButton.click();

  await page.getByRole('button', { name: 'Target Enabling Resources' }).click();
  
  page.getByText('AD Informer Set');
  
  await page.getByText('AD Informer Set').click();
  
  const chiclet = page.locator('gene-comparison-tool-filter-list-item').locator('div').first();
  expect(chiclet).toHaveText('Resources: AD Informer Set');
});