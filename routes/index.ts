import express from 'express'; 
import sqlite3 from 'sqlite3';

export const router = express.Router();
var db = new sqlite3.Database('./kadai.db');

/* GET home page. */
router.get('/', (req, res, next) => {
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
    });
  });
});

// For write
router.get('/write', (req, res, next) => res.render('write'));

router.post('/write', (req, res, next) => {
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
    // 登録したら一覧に戻る
    res.redirect('/');
});
