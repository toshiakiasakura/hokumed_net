/**
 * Index file. This file is entry point for routing table.
 */
import express from 'express';
import sqlite3 from 'sqlite3';
import {displayDatabase,
        registerDatabase
} from '../controllers/test_sqlite'

export const router = express.Router();

/* GET home page. */
router.get('/', displayDatabase);

// For write
router.get('/write', (req, res, next) => res.render('write'));

router.post('/write', (req, res, next) => {
  registerDatabase({req,res,next})
  // 登録したら一覧に戻る
  res.redirect('/');
});
