import unittest
import time
import subprocess
import utils_test
from selenium.webdriver.common.keys import Keys

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

class TestAdminFunc(utils_test.TestSetUp):
    def delete_one_data(self):
        """Delete one data from detail page.
        This method can be used for class year, subject, semester notification.
        """
        self.util.browser.find_element_by_id("deleteButton").click()
        self.util.browser.switch_to.alert.accept()
        time.sleep(0.5)

    def input_subject(self, browser, ja: str, en: str):
        """Subject data input function.  Input data is first cleared.
        """
        ja_input = browser.find_element_by_id("subjectPageEditTitle_ja")
        ja_input.clear()
        ja_input.send_keys(ja)
        en_input = browser.find_element_by_id("subjectPageEditTitle_en")
        en_input.clear()
        en_input.send_keys(en)
        en_input.send_keys(Keys.TAB)

    def test_new_year(self):
        """Create, edit and delete class year func. 
        Component working check.
        """
        self.util.test_admin_login()
        # new class year.
        browser = self.util.browser
        browser.get(self.util.test_url + f"/admin/year/new")
        year_input = browser.find_element_by_id("yearPageEditYear")
        year_input.send_keys("999")
        year_input.send_keys(Keys.TAB)
        browser.find_element_by_id("saveButton").click()
        browser.switch_to.alert.accept()
        time.sleep(0.5)
        rows = browser.find_elements_by_id("yearRows")
        hrefs = [ r.get_property("href") for r in rows if r.text == "999期" ]
        self.assertGreater(len(hrefs),0)
        # check edit func. 
        for h in hrefs:
            browser.get(h)
            time.sleep(0.5)
            # edit class year.
            browser.find_element_by_id("editButton").click()
            year_input2 = browser.find_element_by_id("yearPageEditYear")
            year_input2.clear()
            year_input2.send_keys("998")
            year_input2.send_keys(Keys.TAB)
            browser.find_element_by_id("saveButton").click()
            time.sleep(0.5)
            h3 = browser.find_element_by_tag_name("h3")
            self.assertEqual(h3.text, "998期")
            # delete class year..
            self.delete_one_data()
        # deleted check
        self.assertEqual(self.util.current_url(), "/admin/year")
        rows = browser.find_elements_by_id("yearRows")
        rows_999 = [ r for r in rows if r.text == "999期" ] 
        self.assertEqual(len(rows_999), 0)
        self.util.logout()

    def test_subject(self):
        """Create, edit and delete subject information.
        Component working check. 
        """
        test_ja = "テスト用サブジェクト"
        test_ja2 = "テスト用サブジェクト2"
        test_en = "test_en" 
        test_en2 = "test_en2"

        self.util.test_admin_login()
        # new class year.
        browser = self.util.browser
        browser.get(self.util.test_url + f"/admin/subject/new")
        self.input_subject(browser, test_ja, "test_subject")
        browser.find_element_by_id("saveButton").click()
        browser.switch_to.alert.accept()
        time.sleep(0.5)
        rows = browser.find_elements_by_id("subjectRows")
        hrefs = [ r.get_property("href") for r in rows if r.text == test_ja ]
        self.assertGreater(len(hrefs),0)
        # check edit func. 
        for h in hrefs: 
            browser.get(h)
            time.sleep(0.5)
            # edit subject.
            browser.find_element_by_id("editButton").click()
            self.input_subject(browser, test_ja2, test_en2) 
            browser.find_element_by_id("saveButton").click()
            time.sleep(0.5)
            h3 = browser.find_element_by_tag_name("h3")
            self.assertEqual(h3.text, test_ja2)
            # delete subject.
            self.delete_one_data()
        # deleted check
        self.assertEqual(self.util.current_url(), "/admin/subject")
        rows = browser.find_elements_by_id("subjectRows")
        rows_new = [ r for r in rows if r.text == test_ja ] 
        self.assertEqual(len(rows_new), 0)
        self.util.logout()




if __name__ == "__main__":
    unittest.main()
