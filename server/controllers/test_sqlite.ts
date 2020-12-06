import sqlite3 from 'sqlite3';
import { Request, Response, NextFunction } from "express";

const db = new sqlite3.Database('./kadai.db');
type TypeRoute = { req: Request; res: Response; next: NextFunction; }

let displayDatabase = ({ req, res, next }: TypeRoute)=> {
  db.serialize(() => {
    db.all('select * from kadaitable', (err, rows) => {
      if (!err && rows) {
        const newRows = rows.map(row => {
          if (row.content) {
            row.content = row.content.replace(/\r?\n/g, '<br>');
          }
          return row;
        });
        console.log(newRows);
        res.render('index', { posts: newRows });
      }
    })
  })
}

let registerDatabase = ({ req, res, next }:TypeRoute) => {
  // 登録内容をフォームから引っこ抜く
  const kadai = req.body.kadai;
  const risou = req.body.risou;
  const gyappu = req.body.gyappu;
  const kaiketsu = req.body.kaiketsu;

  // DBに登録する
  db.run(
      'insert into kadaitable (kadai,risou,gyappu,kaiketsu) values (?, ?, ?, ?)',
      kadai,risou,gyappu,kaiketsu,
  );
}
export {displayDatabase, registerDatabase}
