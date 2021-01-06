import sqlite3
from sqlite3 import Error

path_hokui = "../../app_hokui.sqlite"
path_hokumed = "./app.sqlite"

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

@sqlConnect(path =path_hokui)
def sqlFetchCommand(con, sql):
    cursorObj = con.cursor()
    cursorObj.execute(sql)
    rows = cursorObj.fetchall()
    return(rows)

@sqlConnect(path=path_hokumed)
def insertCommand(con,sql, entities):
    cursorObj = con.cursor()
    for e in entities:
        cursorObj.execute(sql, e)
    con.commit()   


def create_queries(from_lis,to_lis, table: str, table2: str):

    select_sentence = ', '.join(from_lis)
    insert_sentence = ', '.join(to_lis)
    que_sentence = ', '.join(['?' for i in range(len(to_lis))])
    table_fetch = f"SELECT {select_sentence} FROM {table}"
    table_insert = f"INSERT INTO {table2}({insert_sentence}) VALUES({que_sentence})"
    return(table_fetch, table_insert)

def user_migration():
    user_match = {
     'id': 'id',
     'email': 'email',
     'crypted_password': 'crypted_password',
     ' salt': ' salt',
     'created_at': 'created_at',
     'updated_at': 'updated_at',
     'approval_state': 'approval_state',
     'activation_state': 'activation_status',
     'family_name': 'family_name',
     'given_name': 'given_name',
     'handle_name': 'handle_name',
     'birthday': 'birthday',
     'email_mobile': 'email_mobile',
     'admin': 'admin',
     'class_year_id': 'class_year',
    }
    rep_dic={1:93,2:94, 3:95, 4:96, 5:97, 6:98, 7:99, 8:100}
    rep_admin = {'f':0, 't':1}

    user_fetch, user_insert = create_queries(user_match.keys(), user_match.values(), 'users', 'user')
    user_data = sqlFetchCommand(user_fetch)
    new_data = []
    for u in user_data:
        year = rep_dic[u[-1]]
        admin = rep_admin[ u[-2]]
        new_data.append( u[:-2] + (admin, year))

    insertCommand(user_insert, new_data)

def semester_migration():
    from_lis = ['id', 'class_year_id', 'identifier', 'created_at', 'updated_at']
    to_lis = ['id', 'class_year_id', 'learn_year', 'learn_term', 'created_at', 'updated_at']
    semester_fetch, semester_insert = create_queries(from_lis, to_lis, 'semesters', 'semester')
    semester_data = sqlFetchCommand(semester_fetch)
    rep_dic = {"a": "pre", "b": "post"}
    new_data = []
    for d in semester_data: 
        ident = d[2]
        year = ident[0]
        term = rep_dic[ident[1]]
        new_data.append( (d[0], d[1], year, term, d[3], d[4]) )
        
    insertCommand(semester_insert, new_data)

def semester_subject_migration():
    from_lis = ['semester_id', 'subject_id']
    to_lis = ['id', 'semester_id', 'subject_id']
    fetch, insert = create_queries(from_lis, to_lis, 'semesters_subjects', 'semester__subject')
    data = sqlFetchCommand(fetch)
    new_data = []
    for i, d in enumerate(data):
        new_data.append( (i+1, d[0], d[1]) )
        
    insertCommand(insert , new_data)

def subject_migration():
    from_lis = ['id', 'title_ja', 'title_en', 'created_at', 'updated_at']
    to_lis = from_lis
    fetch, insert = create_queries(from_lis, to_lis, 'subjects', 'subject')
    data = sqlFetchCommand(fetch)
    insertCommand(insert , data)

def document_file_migration():
    from_lis = ['id', 'document_id', 'user_id', 'file_name', 
                'file_content_type', 'comments', 'download_count', 
                'created_at', 'updated_at'] 
    to_lis = ['id', 'subject_id', 'class_year', 'code', 'user_id',  'file_name' ,
              'file_content_type', 'comment', 'download_count', 'created_at', 'updated_at']

    fetch, insert = create_queries(from_lis, to_lis, 'document_files', 'document__file')
    data = sqlFetchCommand(fetch)
    new_data = []
    for d in data:
        sql = f'SELECT * FROM documents WHERE id={d[1]}'
        doc = sqlFetchCommand(sql)[0]
        new_data.append( (d[0], doc[1], doc[2], doc[3]) + d[2:])
    insertCommand(insert , new_data)

def class_year_migration():
    from_lis = ['id', 'year', 'created_at', 'updated_at']
    to_lis  = from_lis
    fetch, insert = create_queries(from_lis, to_lis, 'class_years', 'class__year')
    data = sqlFetchCommand(fetch)
    insertCommand(insert, data)

def notification_migration():
    from_lis = ['id', 'title', 'text', 'created_at', 'updated_at']
    to_lis = from_lis
    fetch, insert = create_queries(from_lis, to_lis, 'news', 'notification')
    data = sqlFetchCommand(fetch)
    insertCommand(insert, data)

def file_code_migration():
    from_lis = ['id', ]
    to_lis = ['id', 'code', 'kind',  'no_doc', 'type']
    fetch, insert = create_queries(from_lis, to_lis, 'user', 'file__code')
    n = 50 
    j = 8
    data = [
        (1, 98, 'exam', '中間', '問題' ),
        (2, 99, 'exam', '期末', '問題'),
        (3, 1098, 'exam', '中間', '解答'),
        (4, 1099, 'exam', '期末', '解答'),
        (5, 96, 'exam', '中間追試', '問題' ),
        (6, 97, 'exam', '期末追試', '問題'),
        (7, 1096, 'exam', '中間追試', '解答'),
        (8, 1097, 'exam', '期末追試', '解答'),
         ] +\
        [ (j + i, i, 'exam', f'第{i}回', '問題') for i in range(1,n+1)] + \
        [ (j + n + i, 1000+i, 'exam', f'第{i}回', '解答') for i in range(1,n+1)] + \
        [ (j + 2*n + i, 2000+i, 'quiz', f'第{i}回', '問題') for i in range(1,n+1)] + \
        [ (j + 3*n + i, 3000+i, 'quiz', f'第{i}回', '解答') for i in range(1,n+1)] + \
        [ (j + 4*n + i, 4000+i, 'summary', f'第{i}回', None) for i in range(1,n+1)] + \
        [ (j + 5*n + 1, 4000, 'summary', None, None)] + \
        [ (j + 5*n + 2, 5000, 'personal', None, None)]  
    insertCommand(insert, data)



def main():
    user_migration()
    semester_migration()
    semester_subject_migration()
    subject_migration()
    document_file_migration()
    class_year_migration()
    notification_migration()
    file_code_migration()

if __name__ == "__main__":
    main()
