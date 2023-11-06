import { test, expect } from '@playwright/test';

test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });

  test('has title', async ({ page }) => {
    await page.goto('/genes/nominated-targets');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('Nominated Targets | Candidate genes for AD treatment or prevention');
  });

  test('has correct sort on druggability columns', async ({ page }) => {
    await page.goto('/genes/nominated-targets');

    await expect(page.locator('table')).toBeVisible();
  
    await page.locator('#pr_id_3 span').click();

    await page.getByLabel('Nominations').click();
    await page.getByLabel('Year First Nominated').click();
    await page.getByLabel('Nominating Teams').click();
    await page.getByLabel('Cohort Study').click();
    await page.getByLabel('Small Molecule Druggability').click();
    await page.getByLabel('Safety Rating').click();
    await page.getByLabel('Antibody Modality').click();

    // sort forward on small molecule druggability
    await page.getByRole('cell', { name: 'Small Molecule Druggability' }).click();

    const row = page.locator('table tr:nth-child(2)');
    let cell = row.getByRole('cell').nth(1);
    await expect(cell).not.toContainText('No Value');
    
    // sort reverse on small molecule druggability
    await page.getByRole('cell', { name: 'Small Molecule Druggability' }).click();
    
    cell = row.getByRole('cell').nth(1); 
    await expect(cell).not.toContainText('No Value');

    // sort forward on safety rating
    await page.getByRole('cell', { name: 'Safety Rating' }).click();

    cell = row.getByRole('cell').nth(2);
    await expect(cell).not.toContainText('No Value');
    
    // sort reverse on safety rating
    await page.getByRole('cell', { name: 'Safety Rating' }).click();
    
    cell = row.getByRole('cell').nth(2); 
    await expect(cell).not.toContainText('No Value');

    // sort forward on antibody modality
    await page.getByRole('cell', { name: 'Antibody Modality' }).click();

    cell = row.getByRole('cell').nth(3);
    await expect(cell).not.toContainText('No Value');
    
    // sort reverse on antibody modality
    await page.getByRole('cell', { name: 'Antibody Modality' }).click();
    
    cell = row.getByRole('cell').nth(3); 
    await expect(cell).not.toContainText('No Value');
  });
});