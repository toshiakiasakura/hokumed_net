import { Request, Response, NextFunction } from "express";
import { createConnection } from 'typeorm'
import { User } from '../entity/User'

export const addSampleUser = (req:Request, res:Response) => {
  createConnection()
    .then(async connection => {

      console.log("Inserting sample users into the database")
      let user = new User()
      user.email = "test@test.com"
      user.crypted_password = "not_crypted"
      user.salt = "test"
      user.activation_state = "admin"
      user.family_name = "family"
      user.handle_name = "handle"

      let userRepository = connection.getRepository(User)
      await userRepository.save(user)
      console.log("finish inserting")
      res.json({status:200})
    })
    .catch(error => {
      console.log(error)
      res.json({status:404})
    })
}

export const removeSampleUser = (req:Request, res:Response) => {
  createConnection()
  .then(async connection => {
    console.log("Removing sample users")
    let userRepository = connection.getRepository(User)

    let users = await userRepository.find()
    for (const user of users){
      await userRepository.remove(user)
    }
    console.log("finish removing")
    res.json({status:200})
  })
  .catch(error => {
    console.log(error)
    res.json({status:404})
  })
}
