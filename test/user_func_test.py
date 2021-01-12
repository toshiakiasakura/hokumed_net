import unittest
import time
import subprocess
import utils_test

class TestHome(utils_test.TestSetUp):
    def test_move_to_notification(self):
        self.util.test_user_login()
        self.util.browser.find_element_by_xpath("//a[@href='/notification']").click()
        self.assertEqual(self.util.current_url(), "/notification")
        self.util.logout()

    def test_show_notification(self):
        """Check notifications are shown, can access to the page, and title is same. 
        """
        self.util.test_user_login()
        links = self.util.browser.find_elements_by_xpath("//a[contains(@href,'/notification/')]")
        self.assertLessEqual(len(links), 5)
        notification_ids = [ link.get_property("href").split("/")[-1] for link in links]
        texts = [ link.text for link in links ]
        for id_, text in zip(notification_ids,texts):
            self.util.browser.get(self.util.test_url+f"/notification/{id_}")
            self.assertEqual(self.util.current_url(), f"/notification/{id_}")
            time.sleep(0.5) # wait for reloading.
            title = self.util.browser.find_element_by_id("notification_title").text
            self.assertEqual(title, text)
        self.util.logout()

if __name__ == "__main__":
    unittest.main()
