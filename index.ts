/*This moduel works as router for backend.
  If the address is not /api/*, this router passes the connection
  to react application.
 */
import express from 'express'
import { Request, Response} from "express";
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path';
import bodyParser from 'body-parser'
import { testRouter } from './routes/tests'
import { userRouter } from './routes/user.route'
import { studyRouter } from './routes/study.route'
import { adminRouter } from './routes/admin.route'
import { ValidateController } from './api/controllers/validate.controller'

createConnection()
.then(async connection => {

  const app = express()
  app.set("secretKey", "hogehoge")
  // axios post problem
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "POST, GET")
    res.setHeader("Access-Control-Max-Age", "3600")
    // This line is for including variables to headers.
    // Needed for avoiding CORS policy errors.
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, x-access-token, x-user-id,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    next()
  })
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '/../client/build')))

  // body parser for json
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/api/test', testRouter )
  // TO DO: add ValidateController.validateUser for studyRouter
  //        after implementated study pages.
  app.use('/api/user', userRouter)
  app.use('/api/study', studyRouter)
  app.use('/api/admin',ValidateController.validateAdmin, adminRouter)
  app.get('/api/*', (req:Request, res:Response) => {
      res.json({status:404})
  })
  // Handles any requests that don't match the ones above
  app.get('*', (req:Request,res:Response) =>{
      res.sendFile(path.join(__dirname+'/../client/build/index.html'))
  })

  //const port = process.env.PORT || 3000;
  const port = 3000
  app.listen(port);

  console.log('App is listening on port ' + port);

})
.catch(error => console.log("TypeORM connection error: ", error));
