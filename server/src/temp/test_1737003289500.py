import pytest
Here's a simple test script in Python using two of the most common Python testing libraries: unittest and requests. This script includes general tests such as checking if the website is up (a "200" status code), if the website is the expected content (checking for the word "Google" in the HTML), and regression tests to see if new changes affect old functionality (in this case, we will test if the redirection from HTTP to HTTPS still works as expected).

```Python
import unittest
import requests

class Test_Google(unittest.TestCase):
    def setUp(self):
        self.url = "https://www.google.com"
    
    def test_status_code(self):
        response = requests.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_content(self):
        response = requests.get(self.url)
        self.assertTrue("Google" in response.text)

    def test_http_redirection(self):
        http_url = "http://www.google.com"
        response = requests.get(http_url)
        self.assertEqual(response.url, self.url)

def regression_suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(Test_Google))
    return suite

if __name__ == "__main__":
    runner = unittest.TextTestRunner()
    
    runner.run(regression_suite())
```
This script will give an error if anything goes wrong. If the server is down (not a "200" status code), if the content is unexpected (the word "Google" isn't present in the HTML), or if the HTTP to HTTPS redirection is broken, the script will display an error notifying you of the broken test.

This script isn't exhaustive and a real comprehensive website test would include many other unit tests for specific page elements and regression tests for all functionality, but this is a good starting point. Depending on your needs, you might also want to integrate some form of test database, so you can perform tests against a safe testing environment instead of the live server.

Please be aware; directly testing from third-party w/ebsites can potentially violate Terms of Services. This method of testing should generally only be used for your own websites or if you have permission to do so.