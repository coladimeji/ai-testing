const { test, expect } = require('@jest/globals');
Writing comprehensive test scripts would be a large endeavour due to the complexity of Google's user interface. However, below is a simple example of how unit tests and regression tests could be structured using MochaJS (a javascript testing framework) and ChaiJS (an assertion library).

This code will not work directly as Google.com is a very complex site and requires a more detailed set of tests. However, these are some example scripts showing how you could think about writing unit tests and regression tests in JavaScript.

```javascript
// Import required libraries
const assert = require('chai').assert;
const axios = require('axios');

// Unit Tests
describe('Unit Tests for www.google.com', function() {
  describe('General Availability of www.google.com', function() {
      it('Should be available and return 200 status code', async function() {
          let response = await axios.get('http://www.google.com');
          assert.equal(response.status, 200);
      });
  });

  describe('Title check for www.google.com', function() {
      it("Title of the website should be Google", async function() {
      // Assuming that this function is implemented correctly to get the title of the website.
          let title = await getTitle('http://www.google.com');
          assert.strictEqual(title, 'Google');
      });    
  });
});

// Regression Tests
describe('Regression Tests for www.google.com', function() {
  describe('Return to home page after a search', function() { 
    it("Should be able to return to home page post search", async function() {
    // Assuming that this function is implemented correctly to return to the home page after performing a search.
    let isHome = await returnToHome('http://www.google.com');
    assert.isTrue(isHome);
    });
  });

  describe('Images link', function() {
    it("Image link should bring to google images page", async function() {
    // Assuming that this function is implemented correctly to check if the google images link redirects correctly.
    let isImagesPage = await checkImagesLink('http://www.google.com');
    assert.isTrue(isImagesPage);
    });
  });
});
```
For the actual testing of www.google.com, you would probably want to use a headless browser library such as Puppeteer or Selenium, as well as a full stack testing framework like Jest or Cypress. This will allow you to simulate user interaction and test how the page responds.

It's also important to note that please make sure your tests are permissible and do not disobey Google’s Terms of Service and robots.txt files.