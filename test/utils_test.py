import unittest
import time
import subprocess
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

test_url = "http://localhost:3001"
back_url = "http://localhost:3000"

class BrowserUtil():
    test_url = test_url 
    back_url = back_url
    TEST_USER_MAIL = "test_hokumednet@eis.hokudai.ac.jp"
    TEST_USER_PW = "test"
    TEST_ADMIN_MAIL = "admin_hokumednet@eis.hokudai.ac.jp"
    TEST_ADMIN_PW = "admin" 

    def __init__(self):
        self.browser = webdriver.Firefox()

    def login(self,email: str,password: str, click: bool = True) -> None:
        self.browser.get(self.test_url + "/")

        email_input = self.browser.find_element_by_name("email")
        email_input.send_keys(email)
        password_input = self.browser.find_element_by_name("password")
        password_input.send_keys(password)
        if click:
            self.browser.find_element_by_id("loginButton").click()

    def logout(self):
        self.browser.get(self.test_url + "/logout")

    def test_user_login(self) -> None: 
        self.login(self.TEST_USER_MAIL, self.TEST_USER_PW)

    def test_admin_login(self) -> None:
        self.login(self.TEST_ADMIN_MAIL, self.TEST_ADMIN_PW)

    def current_url(self) -> str:
        return( self.browser.current_url[len(self.test_url):])

    def open_new_tab(self) -> None:
        self.browser.find_element_by_tag_name("body").send_keys(Keys.CONTROL + "t")

    def click_and_open_in_newtab(self,element) -> None:
        """does not work correctly"""
        actions = ActionChains(self.browser)
        actions.key_down(Keys.CONTROL)
        actions.click(element)
        actions.perform()
        time.sleep(3)

        actions = ActionChains(self.browser)
        actions.key_down(Keys.CONTROL).key_down(Keys.TAB)\
            .key_up(Keys.TAB).key_up(Keys.CONTROL).perform()
        time.sleep(1)
    
    def close_tab(self) -> None:
        self.browser.find_element_by_tag_name("body").send_keys(Keys.CONTROL + "w")


class TestSetUp(unittest.TestCase):
    """To check the function of the site, 
    waking up and quitting browser is always needed.
    Replace unittest.TestCase with this class to obtain common functionality.
    Also adding test user and test admin by this setting up.
    """
    @classmethod
    def setUpClass(cls):
        add_samples()
        super().setUpClass()
        cls.util = BrowserUtil()

    @classmethod
    def tearDownClass(cls):
        cls.util.browser.quit()
        super().tearDownClass()

def add_samples():
    subprocess.check_call(["curl",f"{back_url}/api/test/add_sample"])
    subprocess.check_call(["curl",f"{back_url}/api/test/add_admin"])






