"""Login function is tested.
"""

import unittest
import time
import subprocess
import utils_test

class TestLogin(utils_test.TestSetUp):
    def test_login_success(self):
        """The below 4 is for login component testing.
        """
        self.util.test_user_login()
        
        cookies = self.util.browser.execute_script("return document.cookie;")
        print("\n# Cookies:\n",cookies)
        self.assertEqual(self.util.current_url(), "/home")
        self.util.logout()

    def test_login_user_not_found(self):
        self.util.login("not_found@eis.hokudai.ac.jp", "hogehoge")
        alert = self.util.browser.switch_to.alert
        self.assertEqual(alert.text,'Login failure. ユーザーが見つかりませんでした.' )
        alert.accept()
        self.assertEqual(self.util.current_url(), "/")

    def test_login_user_password_error(self):
        self.util.login(self.util.TEST_USER_MAIL, "hogehoge")
        alert = self.util.browser.switch_to.alert
        self.assertEqual(alert.text, 'Login failure. パスワードが正しくありません.')
        alert.accept()
        self.assertEqual(self.util.current_url(), "/")

    def test_login_disabled(self):
        self.util.login("test", "test", False)
        btn_state = self.util.browser.find_element_by_id("loginButton").is_enabled()
        self.assertFalse(btn_state)

if __name__ == "__main__":
    unittest.main()
