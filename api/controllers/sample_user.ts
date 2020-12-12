import { Request, Response, NextFunction } from "express";
import { getManager } from 'typeorm'
import { Users } from '../entity/Users'
import { newBCryptPassword } from '../helpers/bcrypt.helper'

export async function addSampleUser(req:Request, res:Response){

    console.log('Inserting sample users into the database')
    let user = new Users()
    user.email = 'test@eis.hokudai.ac.jp'
    const [salt, crypted_password] = newBCryptPassword("test")
    user.crypted_password = crypted_password
    user.salt = salt
    user.approval_state = 'test'
    user.family_name = 'family'
    user.given_name = "given"
    user.handle_name = 'handle'
    user.birth_date = new Date(2020,12,1)
    user.email_mobile = "test@gmail.com"
    user.class_year_id =  98

    let userRepository = getManager().getRepository(Users)
    await userRepository.save(user)
    console.log('finish inserting')
    res.json({status:200})
}
export async function removeSampleUser(req:Request, res:Response){
  console.log('Removing sample users')
  let userRepository = getManager().getRepository(Users)

  let users = await userRepository.find({approval_state:'test'})
  for (const user of users){
    await userRepository.remove(user)
  }
  console.log('finish removing')
  res.json({status:200})
}
