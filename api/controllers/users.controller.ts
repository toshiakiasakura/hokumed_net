//const userModel = require('../models/users');
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express";

export const login = (req:Request, res:Response) => {
  // later delete log
  console.log('access to /api/signin')
  console.log(req)
  res.json({accessToken:'abcdefg', email:req.body.email   })
}
