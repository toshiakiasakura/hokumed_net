"""
- selenium with Python, official document 
https://selenium-python.readthedocs.io/

"""
import unittest
import time
from selenium import webdriver


class TestSite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.browser = webdriver.Firefox()
        cls.url = "http://localhost:3001"

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()
        super().tearDownClass()

    def test_login(self):
        self.browser.get(self.url + "/login")

        email_input = self.browser.find_element_by_name("email")
        email_input.send_keys("ak_redtiger@eis.hokudai.ac.jp") 
        password_input = self.browser.find_element_by_name("password")
        password_input.send_keys("abcdefg")
        self.browser.find_element_by_id("loginButton").click()
        local_storage = self.browser.execute_script("return window.localStorage;")
        print("# localStorage :\n",local_storage)

    def test_exmple(self):
        print("test_example")
        self.assertTrue(True)

    def test2(self):
        self.assertFalse(False)


if __name__ == "__main__":
    unittest.main()
