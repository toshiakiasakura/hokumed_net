/* User authentication and register user are defined here.
 */
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const saltRounds = 10

/*
  bcrypt.genSalt(saltRounds)
*/

export const login = (req:Request, res:Response) => {
  // later delete log
  console.log('access to /api/signin')

  // TO DO: This process is needed for register
  // TO DO: how to generate salt for password?
  const saltWhat = "asdfasdfajoiaf" // This saltWhat represents salt in sqlite
  const salt = bcrypt.genSaltSync(saltRounds)
  const myHash = bcrypt.hashSync("error" + saltWhat, salt)

  // TO DO: Here add Read component
  console.log("salt and hash: ",salt, myHash)
  // This compareSync uses myHash's salt part.
  if (bcrypt.compareSync(req.body.password + saltWhat, myHash)){
    //TO DO: swap correct and incorrect process
    res.json({status:403})
  } else {

    // Create accessToken
    const token = jwt.sign({id: 1}, req.app.get("secretKey"), {expiresIn:3600}  )
    res.json({status:200,
              accessToken:token,
              email:req.body.email
            })
  }
}
