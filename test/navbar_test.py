import unittest
import time
import subprocess
import utils_test

class TestNavBar(utils_test.TestSetUp):
    def test_navbar_login(self):
        check_dic = {"LOGIN":"/", "SIGNUP":"/signup"}
        for k,v in check_dic.items():
            self.util.browser.find_element_by_id(k).click()
            self.assertEqual(self.util.current_url(), v)

    def test_navbar_user(self):
        """Test navigation bars are correctly controls the links.
        """
        # keys are id tag name, values are links.

        check_dic = {
            "HOME":"/home",
            "STUDY":"/study",
            "PROFILE":"/profile",
         }
        self.util.test_user_login()
        self.util.browser.get(self.util.test_url + "/")
        for k,v in check_dic.items():
            self.util.browser.find_element_by_id(k).click()
            self.assertEqual(self.util.current_url(), v)
        self.util.logout()

    def test_navbar_admin(self):
        """admin navigation bar test. 
        This test also checks successful admin authentication.
        """
        check_dic = {
            "HOME":"/home",
            "STUDY":"/study",
            "PROFILE":"/profile",
            "ADMIN":"/admin",
         }
        self.util.test_admin_login()
        self.util.browser.get(self.util.test_url + "/")
        for k,v in check_dic.items():
            self.util.browser.find_element_by_id(k).click()
            self.assertEqual(self.util.current_url(), v)

        # in Admin page. 
        admin_dic = {
            "TOP":"/",
            "ユーザー":"/user",
            "学年":"/year",
            "教科":"/subject",
            "学期":"/semester",
            "お知らせ":"/notification"
        }
        self.util.browser.get(self.util.test_url + "/admin")
        for k,v in admin_dic.items():
            self.util.browser.find_element_by_id(k).click()
            self.assertEqual(self.util.current_url(), f"/admin{v}")
        self.util.logout()



if __name__ == "__main__":
    unittest.main()
