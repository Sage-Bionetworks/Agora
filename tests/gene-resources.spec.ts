import { test, expect } from '@playwright/test';

test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });

  test('has title', async ({ page }) => {
    await page.goto('/genes/ENSG00000178209/resources');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('Agora');
  });

  test('AMP-PD explorer link to go to gene', async ({ page }) => {
    await page.goto('/genes/ENSG00000178209/resources');
  
    // expect link named 'Visit AMP-PD'
    const link = page.getByRole('link', { name: 'Visit AMP-PD' });
    expect(await link.innerText()).toBe('Visit AMP-PD');
    
    // expect url to have ensembleid
    const url = await link.getAttribute('href');
    expect(url).toBe('https://target-explorer.amp-pd.org/genes/target-search?gene=ENSG00000178209');
  });
});