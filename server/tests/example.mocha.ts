import { expect } from 'chai';
import { Browser, Page, chromium } from 'playwright';

describe('Test Scripts Page', () => {
    let browser: Browser;
    let page: Page;

    beforeEach(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should load test scripts page', async () => {
        await page.goto('http://localhost:5173');
        await page.waitForLoadState('networkidle');
        const title = await page.textContent('h4');
        expect(title).to.equal('Test Scripts');
    });

    it('should open new test dialog', async () => {
        await page.click('text=Generate New Test');
        const dialogTitle = await page.textContent('div[role="dialog"] h2');
        expect(dialogTitle).to.equal('Generate New Test');
    });

    it('should generate and run a test', async () => {
        await page.fill('input[placeholder="Enter the URL to test"]', 'https://example.com');
        await page.selectOption('select[label="Language"]', 'JavaScript');
        await page.selectOption('select[label="Framework"]', 'Mocha');
        await page.selectOption('select[label="Test Type"]', 'UNIT');

        await page.click('text=Generate & Run Automated Test');

        await page.waitForURL(/.*\/test-results/);
        expect(page.url()).to.match(/.*\/test-results/);
    });
});

describe('Test Generation Features', () => {
    let browser: Browser;
    let page: Page;

    beforeEach(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should show AI features for regression tests', async () => {
        await page.click('text=Generate New Test');
        await page.selectOption('select[label="Test Type"]', 'REGRESSION');

        const aiFeatures = await page.isVisible('text=Advanced AI Testing Features');
        expect(aiFeatures).to.be.true;
    });

    it('should enable cognitive analysis features', async () => {
        await page.click('text=Enable Cognitive Analysis');
        await page.click('text=NLP Validation');

        const nlpValidationSwitch = await page.locator('text=NLP Validation').locator('xpath=../..').locator('input[type="checkbox"]');
        const isChecked = await nlpValidationSwitch.isChecked();
        expect(isChecked).to.be.true;
    });

    it('should generate test with selected features', async () => {
        await page.fill('input[placeholder="Enter the URL to test"]', 'https://example.com');
        await page.selectOption('select[label="Language"]', 'JavaScript');
        await page.selectOption('select[label="Framework"]', 'Mocha');
        await page.click('text=Generate & Run Automated Test');
        await page.waitForURL(/.*\/test-results/);

        const resultsTitle = await page.textContent('h4');
        expect(resultsTitle).to.equal('Test Results');
    });
}); 