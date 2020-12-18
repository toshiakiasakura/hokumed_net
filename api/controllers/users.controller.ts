/* User authentication and register user are defined here.
 */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getManager } from 'typeorm'
import { newBCryptPassword } from '../helpers/bcrypt.helper'
import { Users } from '../entity/Users'
import { ExpressFunc } from '../helpers/express_typing'

// This typing is called contextual typing.

class UserController{

  static login: ExpressFunc = async function (req, res){
    // later delete log
    let userRepository = getManager().getRepository(Users)
    const user = await userRepository.findOne({where: {email:req.body.email}})
    console.log(req.body)
    console.log(user)
    if ( user === undefined ){
      res.json({status:401, msg:'Login failure. User is not found.'}) // User not found and password fail is different
    } else if(
      bcrypt.compareSync(req.body.password + user.salt, user.crypted_password)
    ){
    // Create
      const token = jwt.sign({id: user.id},
                              req.app.get("secretKey"),
                              {expiresIn:3600}  )
      res.json({status:200,
                msg:'successfuly login.',
                accessToken:token,
                email:req.body.email
              })
    } else {
      res.json({status:401, msg:'Login failure. Password is not correct.'})
    }
  }
  static signup: ExpressFunc = async function signup(req, res){
    let userRepository = getManager().getRepository(Users)

    let users = await userRepository.find({email: req.body.email})
    if ( !users.length ){
      const body = req.body
      let user = new Users()
      user.email = body.email
      const [ salt, crypted_password ] = newBCryptPassword(body.password)
      user.salt = salt
      user.crypted_password = crypted_password
      user.family_name = body.family_name
      user.given_name = body.given_name
      user.handle_name = body.handle_name
      user.birthday = body.birth_day
      user.email_mobile = body.email_mobile
      user.class_year_id = body.class_year_id

      user.created_at = new Date()

      await userRepository.save(user)
      res.json({status:200, msg:"successfully signup."})
      console.log('signup success.')
    } else {
      res.json({status:400,
        msg:'signup fail. That Email is already registerd.'
      })
      console.log(users)
      console.log('signup fail.')
    }
  }
}

export { UserController }
