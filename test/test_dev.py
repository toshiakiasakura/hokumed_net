"""
To use this module,
- start first `yarn dev` and type `yarn test` in another window.

Also you need to first set the environmental path for geckodriver.
For mac or linux users, `which geckodriver` will tell you
the path for it.

- selenium with Python, official document
https://selenium-python.readthedocs.io/

- unittest, official document
https://docs.python.org/3/library/unittest.html
"""
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.alert import Alert

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

    def login(self,email: str,password: str, click: bool = True) -> None:
        self.browser.get(self.url + "/login")

        email_input = self.browser.find_element_by_name("email")
        email_input.send_keys(email)
        password_input = self.browser.find_element_by_name("password")
        password_input.send_keys(password)
        if click:
            self.browser.find_element_by_id("loginButton").click()

    def current_url(self) -> str:
        return( self.browser.current_url[len(self.url):])

    def test_login_success(self):
        self.login("ak_redtiger@eis.hokudai.ac.jp", "abcdefg")
        local_storage = self.browser.execute_script("return window.localStorage;")
        print("# localStorage :\n",local_storage)
        self.assertEqual(self.current_url(), "/home")

    def test_login_failure(self):
        self.login("ak_redtiger@eis.hokudai.ac.jp", "error")
        Alert(self.browser).accept()
        self.assertEqual(self.current_url(), "/login")

    def test_login_disabled(self):
        self.login("test", "test", False)
        btn_state = self.browser.find_element_by_id("loginButton").is_enabled()
        self.assertFalse(btn_state)

    def test_nav_bar(self):
        """Test navigation bars are correctly controls the links.
        If you make prototype of pages, write the name and path
        for that page.
        """
        # keys are id tag name, values are links.
        check_dic = {"HOME":"/home",
                     "LOGIN":"/",
                     "ERROR":"/error",
                     #"STUDY":"/study"
                     }
        self.browser.get(self.url + "/")
        for k,v in check_dic.items():
            self.browser.find_element_by_id(k).click()
            self.assertEqual(self.current_url(), v)




if __name__ == "__main__":
    unittest.main()
