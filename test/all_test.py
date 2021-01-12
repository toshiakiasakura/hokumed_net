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
import subprocess

import utils_test

import login_test
import navbar_test
import error_test
import user_func_test

def append_test_module(suite:list, test_module):
    suite.append( unittest.TestLoader().loadTestsFromModule(test_module) )
    return( suite ) 

if __name__ == '__main__':
    modules = [login_test, navbar_test, error_test, user_func_test]

    suite = []
    print("test module list:")
    for module in modules:
        print(module)
        suite = append_test_module(suite, module)

    comboSuite = unittest.TestSuite(suite)
    unittest.TextTestRunner(verbosity=0).run(comboSuite)

