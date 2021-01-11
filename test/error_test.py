import unittest
import time
import subprocess
import utils_test

class TestError(utils_test.TestSetUp):
    def test_access_non_page(self):
        self.util.browser.get(self.util.test_url + "/hogehoge")
        self.assertEqual(self.util.current_url(), "/error/404")
        # "/error" page does not exist.
        self.util.browser.get(self.util.test_url + "/error")
        self.assertEqual(self.util.current_url(), "/error/404")
        

    def test_user_authentication_failure(self):
        """Test access to user page without login. 
        """
        for page in ["/home","/study", "/profile", "/admin"]:
            self.util.browser.get(self.util.test_url + page)
            time.sleep(0.1)
            self.assertEqual(self.util.current_url(), "/error/401")

    def test_admin_authentication_failure(self):
        """Test access to admin page with user login not admin login
        """
        self.util.test_user_login()
        for page in ["/admin","/admin/user", "/admin/year", "/admin/semester"]:
            self.util.browser.get(self.util.test_url + page)
            self.assertEqual(self.util.current_url(), "/error/401")
        self.util.logout()

if __name__ == "__main__":
    unittest.main()
