const { test, expect } = require('@jest/globals');
Here's an example of a simple test script created with the `jest-puppeteer` package which allows you to run your tests in Chromium / Chrome browser. This test script includes a few basic unit and regression tests for Google's search functionality. Please note you'll need to install some npm packages (`puppeteer` and `jest`) if you want to run these tests.

```javascript
const puppeteer = require('puppeteer');

describe('Google.com', () => {

  let browser = null;
  let page = null;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://www.google.com');
  });

  afterAll(async () => {
    await browser.close();
  });

  // === Unit Test to check the site's Title ===
  test('Should have the correct title', async () => {
    const title = await page.title();
    expect(title).toBe('Google');
  });

  // === Unit Test to check for the presence of the search field ===
  test('Should display search input', async () => {
    const searchInput = await page.$('input[name=q]');
    expect(searchInput).not.toBeNull();
  });

  // === Regression test to check if search functionality is working ===
  test('Should display search results after input', async () => {
    await page.type('input[name=q]', 'Puppeteer');
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
    expect(await page.url()).toContain('Puppeteer');
  });

});
```

Please note, this is a simple testing script that checks whether Google's title is correctly displayed, the search input is present at the page, and checks Google's functionality by typing 'Puppeteer' in the search box and making sure that the new URL contains the word 'Puppeteer'. 

For a production-level application, you'd ideally have many more tests that cover all the functionality of your application to have a robust testing suite.