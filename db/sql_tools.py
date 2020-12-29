import sqlite3
from sqlite3 import Error

def sqlConnect(path):
    def _decorator_arg(func):
        def _decorator(*args,**kargs):
            try:
                con = sqlite3.connect(path)
                res = func(con,*args,**kargs)
                print(func.__name__)
            except Exception as e:
                print("!!!! Error occurs !!!!: ",e)
            finally:
                print("finish!")
                con.close()
            return(res)
        return(_decorator)
    return(_decorator_arg)
