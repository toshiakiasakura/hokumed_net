import { getManager } from 'typeorm'
import { ExpressMiddleFunc } from '../helpers/express_typing'
import { User } from '../entity/user.entity'

/**
 * User and admin validation is implemented here.
 * static method is put in the middle of routing.
 * See index.ts for usage of this static method.
 */
class ValidateController {
  static validateUser: ExpressMiddleFunc = async function(req, res, next){
    let userRepository = getManager().getRepository(User)
    const userID = req.cookies['userID']
    const accessToken = req.cookies['accessToken'] 
    if( typeof userID === 'string' && typeof accessToken === 'string' ){
      const user = await userRepository.findOne(parseInt(userID))
      if( user
          && user.access_token === accessToken
          && user.approval_state === 'approved'
        ){
        req.body.userID = userID
        next()

      } else{
        const msg = 'User Authentication error.'
        console.log(msg)
        res.json({status:401})
      }
    } else {
      const msg = 'User validation error. Cookies problem.'
      console.log(msg)
      res.json({status:401})
    }
  }

  static validateAdmin: ExpressMiddleFunc = async function(req, res, next){
    let userRepository = getManager().getRepository(User)
    const userID = req.cookies['userID']
    const accessToken = req.cookies['accessToken'] 

    if( typeof userID === 'string' && typeof accessToken === 'string' ){
      const user = await userRepository.findOne(parseInt(userID))
      if( user
          && user.access_token === accessToken
          && user.admin
        ){
        req.body.userID = userID
        next()
      } else{
        const msg = 'Admin Authentication error.'
        console.log(msg)
        res.json({status:401})
      }

    } else {
      const msg = 'Admin validation error. Cookies problem.'
      console.log(msg)
      res.json({status:401})
    }
  }

  static validateGraduate: ExpressMiddleFunc = async function(req, res, next){
    if(req.query.sha1 === "34149F8241ED0D69C747D409AE79D572EF73267A"){
      next()
    } else {
      res.json({status:404})
    }
  }
}

export { ValidateController }
