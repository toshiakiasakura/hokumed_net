import os
import numpy as np 
from datetime import datetime

import migration 

@migration.sqlConnect(path =migration.path_hokumed)
def sqlFetchCommand(con, sql):
    cursorObj = con.cursor()
    cursorObj.execute(sql)
    rows = cursorObj.fetchall()
    return(rows)

@migration.sqlConnect(path = "./app_migrated_from_hokui.sqlite")
def sqlFetchCommandMigrated(con, sql):
    cursorObj = con.cursor()
    cursorObj.execute(sql)
    rows = cursorObj.fetchall()
    return(rows)

@migration.sqlConnect(path =migration.path_hokumed)
def sqlDeleteFile(con, id_):
    cursorObj = con.cursor()
    sql = f"DELETE FROM document__file WHERE id={id_}"
    cursorObj.execute(sql)
    con.commit()

@migration.sqlConnect(path =migration.path_hokumed)
def sqlDeleteAllFile(con ):
    cursorObj = con.cursor()
    sql = f"DELETE FROM document__file"
    cursorObj.execute(sql)
    con.commit()

def consistency():
    now = datetime.now().strftime("%Y%m%d%H%M%S")
    from_lis = ["id", "subject_id", "file_name"]
    to_lis = ["id"]
    fetch, insert = migration.create_queries(from_lis, to_lis, 'document__file', 'document__file')
    data = sqlFetchCommand(fetch)

    deleted_paths = []
    record=[]
    for d in data:
        sql = f'SELECT "title_en" FROM subject WHERE id={d[1]}'
        subs = sqlFetchCommand(sql)
        subs_mig = sqlFetchCommandMigrated(sql)
        if len(subs):
            sub = subs[0]
            path = f"../downloads/{sub[0]}/{d[2]}"
            if not os.path.exists(path):
                deleted_paths.append(path)
                print(path)
                #print(subs, subs_mig)
                record.append( subs[0][0] + "/ " + subs_mig[0][0])
                sqlDeleteFile(d[0])
            else:
                pass
                #print(path)
        else:
            print("subject not found", d)

    print(np.unique(record))

    with open(f"{now}.txt", "w") as f:
        data = "\n".join(sorted(deleted_paths)) 
        f.write(data)

if __name__ == "__main__":
    #sqlDeleteAllFile()
    consistency()
