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
    const userID = req.headers['x-user-id']
    const accessToken = req.headers['x-access-token']
    if( typeof userID === 'string' && typeof accessToken === 'string' ){
      const user = await userRepository.findOne(parseInt(userID))
      if( user
          && user.access_token === accessToken
          && user.approval_state === 'approved'
        ){
        req.body.userID = userID
        next()

      } else{
        const msg = 'Authentication error.'
        console.log(msg)
        res.json({status:401})
      }
    } else {
      const msg = 'Headers are lack.'
      console.log(msg)
      res.json({status:401})
    }
  }

  static validateAdmin: ExpressMiddleFunc = async function(req, res, next){
    let userRepository = getManager().getRepository(User)
    const userID = req.headers['x-user-id']
    const accessToken = req.headers['x-access-token']

    if( typeof userID === 'string' && typeof accessToken === 'string' ){
      const user = await userRepository.findOne(parseInt(userID))
      if( user
          && user.access_token === accessToken
          && user.admin
        ){
        req.body.userID = userID
        next()
      } else{
        const msg = 'Authentication error.'
        console.log(msg)
        res.json({status:401})
      }

    } else {
      const msg = 'Headers are lack.'
      console.log(msg)
      res.json({status:401})
    }
  }
}

export { ValidateController }
