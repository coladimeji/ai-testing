import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Example: Test navigation to Test Scripts page
  await page.click('text=Test Scripts');
  await expect(page).toHaveURL(/.*\/test-scripts/);
  
  // Example: Test generating a new test
  await page.click('text=Generate New Test');
  
  // Fill in the test form
  await page.fill('input[placeholder="Enter the URL to test"]', 'https://example.com');
  await page.selectOption('select[label="Language"]', 'JavaScript');
  await page.selectOption('select[label="Framework"]', 'Jest');
  await page.selectOption('select[label="Test Type"]', 'UNIT');
  
  // Submit the form
  await page.click('text=Generate & Run Automated Test');
  
  // Wait for the test to complete and verify redirect
  await expect(page).toHaveURL(/.*\/test-results/);
});

test('regression test features', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Test Scripts');
  await page.click('text=Generate New Test');
  
  // Fill basic info
  await page.fill('input[placeholder="Enter the URL to test"]', 'https://example.com');
  await page.selectOption('select[label="Language"]', 'JavaScript');
  await page.selectOption('select[label="Test Type"]', 'REGRESSION');
  
  // Verify AI testing features are visible
  await expect(page.locator('text=Advanced AI Testing Features')).toBeVisible();
  await expect(page.locator('text=Cognitive Analysis')).toBeVisible();
  await expect(page.locator('text=Self-Healing Tests')).toBeVisible();
  
  // Enable some AI features
  await page.click('text=Enable Cognitive Analysis');
  await page.click('text=NLP Validation');
  await page.click('text=Semantic Analysis');
  
  // Submit and verify
  await page.click('text=Generate & Run Automated Test');
  await expect(page).toHaveURL(/.*\/test-results/);
}); 