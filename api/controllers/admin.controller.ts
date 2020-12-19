import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { Users } from '../entity/Users'


class AdminController{

  static UserBoard: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(Users)
    const users = await userRepository.find()
    res.json({users:users, status:200})
  }

  static UserDetail: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(Users)
    const user = await userRepository.findOne(id)
    res.json({user:user, status:200})
  }

  static changeApproveStatus: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(Users)
    const user = await userRepository.findOne(id)
    if(user !== undefined){
      user.approval_state = user.approval_state === 'waiting' ? 'approved' : 'waiting'
      userRepository.save(user)

      // TO DO: send email to Approved user.
      res.json({status:200})
    } else {
      res.json({status:401})
    }
  }

  static deleteUser: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(Users)
    let user = await userRepository.findOne(id)
    if(user !== undefined){
      await userRepository.remove(user)
      res.json({status:200})
    } else {
      res.json({status:401})
    }
  }

  static changeAdminStatus: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(Users)
    let user = await userRepository.findOne(id)
    if(user !== undefined){
      user.admin = user.admin ? false : true
      await userRepository.save(user)
      res.json({status:200})
    } else {
      res.json({status:401})
    }
  }
}

export { AdminController }
