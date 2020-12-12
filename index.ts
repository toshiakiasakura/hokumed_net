/*This moduel works as router for backend.
  If the address is not /api/*, this router passes the connection
  to react application.
 */
import express from 'express'
import { Request, Response, NextFunction } from "express";
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path';
import bodyParser from 'body-parser'
import { testRouter } from './routes/tests'
import { userRouter } from './routes/user.route'
import { studyRouter } from './routes/study.route'

createConnection()
.then(async connection => {
  const app = express()
  app.set("secretKey", "hogehoge")
  // axios post problem
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')))

  // body parser for json
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/api/test', testRouter )
  app.use('/api/user', userRouter)
  app.use('/api/study', studyRouter)

  // Handles any requests that don't match the ones above
  app.get('*', (req:Request,res:Response) =>{
      res.sendFile(path.join(__dirname+'../client/build/index.html'));
  })

  //const port = process.env.PORT || 3000;
  const port = 3000
  app.listen(port);

  console.log('App is listening on port ' + port);

})
.catch(error => console.log("TypeORM connection error: ", error));
