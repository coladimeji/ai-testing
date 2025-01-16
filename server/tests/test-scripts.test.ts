import { expect } from 'chai';
import { Browser, Page, chromium } from 'playwright';

interface TestContext {
    browser: Browser;
    page: Page;
}

describe('Test Scripts Page', function() {
    const ctx: TestContext = {
        browser: null as unknown as Browser,
        page: null as unknown as Page
    };

    before(async function() {
        ctx.browser = await chromium.launch();
        ctx.page = await ctx.browser.newPage();
    });

    after(async function() {
        await ctx.browser.close();
    });

    it('should load test scripts page', async function() {
        await ctx.page.goto('http://localhost:5173');
        await ctx.page.waitForLoadState('networkidle');
        const title = await ctx.page.textContent('h4');
        expect(title).to.equal('Test Scripts');
    });

    it('should open new test dialog', async function() {
        await ctx.page.click('text=Generate New Test');
        const dialogTitle = await ctx.page.textContent('div[role="dialog"] h2');
        expect(dialogTitle).to.equal('Generate New Test');
    });

    it('should generate and run a test', async function() {
        await ctx.page.fill('input[placeholder="Enter the URL to test"]', 'https://example.com');
        await ctx.page.selectOption('select[label="Language"]', 'JavaScript');
        await ctx.page.selectOption('select[label="Framework"]', 'Mocha');
        await ctx.page.selectOption('select[label="Test Type"]', 'UNIT');

        await ctx.page.click('text=Generate & Run Automated Test');

        await ctx.page.waitForURL(/.*\/test-results/);
        expect(ctx.page.url()).to.match(/.*\/test-results/);
    });
});

describe('Test Generation Features', function() {
    const ctx: TestContext = {
        browser: null as unknown as Browser,
        page: null as unknown as Page
    };

    before(async function() {
        ctx.browser = await chromium.launch();
        ctx.page = await ctx.browser.newPage();
    });

    after(async function() {
        await ctx.browser.close();
    });

    it('should show AI features for regression tests', async function() {
        await ctx.page.click('text=Generate New Test');
        await ctx.page.selectOption('select[label="Test Type"]', 'REGRESSION');

        const aiFeatures = await ctx.page.isVisible('text=Advanced AI Testing Features');
        expect(aiFeatures).to.be.true;
    });

    it('should enable cognitive analysis features', async function() {
        await ctx.page.click('text=Enable Cognitive Analysis');
        await ctx.page.click('text=NLP Validation');

        const nlpValidationSwitch = await ctx.page.locator('text=NLP Validation').locator('xpath=../..').locator('input[type="checkbox"]');
        const isChecked = await nlpValidationSwitch.isChecked();
        expect(isChecked).to.be.true;
    });

    it('should generate test with selected features', async function() {
        await ctx.page.fill('input[placeholder="Enter the URL to test"]', 'https://example.com');
        await ctx.page.selectOption('select[label="Language"]', 'JavaScript');
        await ctx.page.selectOption('select[label="Framework"]', 'Mocha');
        await ctx.page.click('text=Generate & Run Automated Test');
        await ctx.page.waitForURL(/.*\/test-results/);

        const resultsTitle = await ctx.page.textContent('h4');
        expect(resultsTitle).to.equal('Test Results');
    });
}); 