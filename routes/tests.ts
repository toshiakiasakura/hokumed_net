/* This module is for tests.
   Test codes are written here.
   Finally it should delete.
 */
import express from 'express'
const router = express.Router()
import { Request, Response, NextFunction } from "express";

router.get('/hello', (req, res) => {
    console.log("Hello, Get method ")
  res.send({ express: 'Hello From Express' });
})

router.post('/world', (req:Request ,res:Response) => {
    console.log(req.body)
    res.send(`I received your POST request. ${req.body.post}`)
    console.log('Hello world!!! ')
})
export { router as testRouter }
