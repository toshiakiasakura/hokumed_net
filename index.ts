/*This moduel works as router for backend.
  If the address is not /api/*, this router passes the connection
  to react application.
 */
import express from 'express'
import { Request, Response} from "express"
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import path from 'path'
import bodyParser from 'body-parser'
import { testRouter } from './routes/tests'
import { userRouter } from './routes/user.route'
import { adminRouter } from './routes/admin.route'
import { ValidateController } from './api/controllers/validate.controller'

/**
 * TO DO: Replace hogehoge with environmental variable. ]
 * All environmental vairables used in this application is declared here.
 * secretKey is used in jwt authentication encryption.
 */
const app = express()
console.log(process.env.HOKUI_SECRET)
app.set("secretKey", process.env.HOKUI_SECRET)


/**
 * In developmental and production stage, CORS policy errors should be
 * avoided. These setHeader methods are placed for this purpose.
 * If you add specific header, you should also its key header value
 * to Access-Control-Allow-Headers.
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader("Access-Control-Allow-Methods", "POST, GET")
  res.setHeader("Access-Control-Max-Age", "3600")
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, x-access-token, x-user-id,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
  next()
})

/**
 * Serve the static files from the React app
 */
app.use(express.static(path.join(__dirname, '/../client/build')))

/**
 + body parser for json
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Routing part.
 */
app.use('/api/test', testRouter )
app.use('/api/user', userRouter)
app.use('/api/admin',ValidateController.validateAdmin, adminRouter)
app.get('/api/*', (req:Request, res:Response) => {
    res.json({status:404})
})

/**
 * Handles any requests that don't match the ones above
 */
app.get('*', (req:Request,res:Response) =>{
    res.sendFile(path.join(__dirname+'/../client/build/index.html'))
})

/**
 * createConnection is one of typeorm function.
 * Database connection should be one, and access
 * via getManager function in * typeORM.
 */
createConnection()
.then(async connection => {
  const port = 3000
  app.listen(port);

  console.log('App is listening on port ' + port);

})
.catch(error => console.log("TypeORM connection error: ", error));
