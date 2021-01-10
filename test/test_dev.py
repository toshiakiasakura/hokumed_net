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
import subprocess
from selenium import webdriver
from selenium.webdriver.common.alert import Alert

test_url = "http://localhost:3001"
back_url = "http://localhost:3000"
class TestSite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.browser = webdriver.Firefox()
        cls.url = test_url

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()
        super().tearDownClass()

    def login(self,email: str,password: str, click: bool = True) -> None:
        self.browser.get(self.url + "/")

        email_input = self.browser.find_element_by_name("email")
        email_input.send_keys(email)
        password_input = self.browser.find_element_by_name("password")
        password_input.send_keys(password)
        if click:
            self.browser.find_element_by_id("loginButton").click()

    def logout(self):
        self.browser.get(self.url + "/logout")

    def current_url(self) -> str:
        return( self.browser.current_url[len(self.url):])
        time.sleep(1)

    def test_login_success(self):
        """The below 4 is for login component testing.
        """
        self.login("test@eis.hokudai.ac.jp", "test")
        local_storage = self.browser.execute_script("return window.localStorage;")
        print("# localStorage :\n",local_storage)
        self.assertEqual(self.current_url(), "/home")
        self.logout()

    def test_login_user_not_found(self):
        self.login("not_found@eis.hokudai.ac.jp", "hogehoge")
        alert = self.browser.switch_to.alert
        self.assertEqual(alert.text,'Login failure. ユーザーが見つかりませんでした.' )
        alert.accept()
        self.assertEqual(self.current_url(), "/")

    def test_login_user_password_error(self):
        self.login("test@eis.hokudai.ac.jp", "hogehoge")
        alert = self.browser.switch_to.alert
        self.assertEqual(alert.text, 'Login failure. パスワードが正しくありません.')
        alert.accept()
        self.assertEqual(self.current_url(), "/")

    def test_login_disabled(self):
        self.login("test", "test", False)
        btn_state = self.browser.find_element_by_id("loginButton").is_enabled()
        self.assertFalse(btn_state)

    def not_test_nav_bar(self):
        """Test navigation bars are correctly controls the links.
        Currently can not use this function.
        """
        # keys are id tag name, values are links.
        check_dic = {"HOME":"/home",
                     "LOGIN":"/",
                     #"STUDY":"/study"
                     }
        self.browser.get(self.url + "/")
        for k,v in check_dic.items():
            self.browser.find_element_by_id(k).click()
            self.assertEqual(self.current_url(), v)

    def test_admin_authentication_success(self):
        self.login("admin@eis.hokudai.ac.jp", "admin")
        self.browser.get(self.url + "/admin")
        self.assertEqual(self.current_url(), "/admin")
        self.browser.get(self.url + "/admin/user")
        self.assertEqual(self.current_url(), "/admin/user")
        self.logout()

    def test_admin_authentication_failure(self):
        self.login("test@eis.hokudai.ac.jp", "test")
        self.browser.get(self.url + "/admin")
        self.assertEqual(self.current_url(), "/error/401")
        self.logout()


if __name__ == "__main__":
    subprocess.check_call(["curl",f"{back_url}/api/test/add_sample"])
    subprocess.check_call(["curl",f"{back_url}/api/test/add_admin"])
    unittest.main()
