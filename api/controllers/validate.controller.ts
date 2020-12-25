import { getManager } from 'typeorm'
import { ExpressMiddleFunc } from '../helpers/express_typing'
import { Users } from '../entity/Users'
import jwt from 'jsonwebtoken'

/**
 * User and admin validation is implemented here.
 * static method is put in the middle of routing.
 * See index.ts for usage of this static method. 
 */
class ValidateController {
  static validateUser: ExpressMiddleFunc = async function(req, res, next){
    let userRepository = getManager().getRepository(Users)
    const userID = req.headers['x-user-id']
    const accessToken = req.headers['x-access-token']
    if( typeof userID === 'string' && typeof accessToken === 'string' ){
      const user = await userRepository.findOne(parseInt(userID))
      if( user
          && user.accessToken === accessToken
          && user.approval_state === 'approved'
        ){
        req.body.userID = userID
        next()

      } else{
        const msg = 'Authentication error.'
        console.log(msg)
        res.json({status:401, msg:msg })
      }
    } else {
      const msg = 'Headers are lack.'
      console.log(msg)
      res.json({status:401, msg:msg})
    }
  }

  static validateAdmin: ExpressMiddleFunc = async function(req, res, next){
    let userRepository = getManager().getRepository(Users)
    const userID = req.headers['x-user-id']
    const accessToken = req.headers['x-access-token']

    if( typeof userID === 'string' && typeof accessToken === 'string' ){
      const user = await userRepository.findOne(parseInt(userID))
      if( user && user.accessToken === accessToken && user.admin ){
        req.body.userID = userID
        next()
      } else{
        const msg = 'Authentication error.'
        console.log(msg)
        res.json({status:401, msg:msg })
      }

    } else {
      const msg = 'Headers are lack.'
      console.log(msg)
      res.json({status:401, msg:msg})
    }
  }
}

export { ValidateController }
