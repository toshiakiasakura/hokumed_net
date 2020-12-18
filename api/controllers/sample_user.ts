import { getManager } from 'typeorm'
import { Users } from '../entity/Users'
import { newBCryptPassword } from '../helpers/bcrypt.helper'
import { ExpressFunc } from '../helpers/express_typing'

export const addSampleUser: ExpressFunc = async function(req, res){

    console.log('Inserting sample users into the database')
    let user = new Users()
    user.email = 'test@eis.hokudai.ac.jp'
    const [salt, crypted_password] = newBCryptPassword("test")
    user.crypted_password = crypted_password
    user.salt = salt
    user.family_name = 'family'
    user.given_name = "given"
    user.handle_name = 'handle'
    user.birthday = new Date(2020,11,1) // counts month from 0 to 11.
    user.email_mobile = "test@gmail.com"
    user.class_year_id =  '98'

    let userRepository = getManager().getRepository(Users)
    await userRepository.save(user)
    console.log('finish inserting')
    res.json({status:200})
}
export const removeSampleUser: ExpressFunc = async function(req, res){
  console.log('Removing sample users')
  let userRepository = getManager().getRepository(Users)

  let users = await userRepository.find({email:'test@eis.hokudai.ac.jp'})
  for (const user of users){
    await userRepository.remove(user)
  }
  console.log('finish removing')
  res.json({status:200})
}
