/* User authentication and register user are defined here.
 */
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const saltRounds = 10
import { getManager } from 'typeorm'
import { newBCryptPassword } from '../helpers/bcrypt.helper'
import { Users } from '../entity/Users'

/*
  bcrypt.genSalt(saltRounds)
*/

export async function login(req:Request, res:Response){
  // later delete log
  let userRepository = getManager().getRepository(Users)
  const user = await userRepository.findOne({where: {email:req.body.email}})
  console.log(req.body)
  console.log(user)
  if ( user === undefined ){
    res.json({status:401, msg:'Login failure. User is not found'}) // User not found and password fail is different
  } else if(
    bcrypt.compareSync(req.body.password + user.salt, user.crypted_password)
  ){
  // Create
    const token = jwt.sign({id: user.id},
                            req.app.get("secretKey"),
                            {expiresIn:3600}  )
    res.json({status:200,
              accessToken:token,
              email:req.body.email
            })
  } else {
    res.json({status:401, msg:'Login failure. Password is not correct'})
  }
}
