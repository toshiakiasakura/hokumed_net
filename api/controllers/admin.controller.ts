import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { Users } from '../entity/users.entity'
import { approvalNotification } from '../helpers/email.helper'

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
      if( user.approval_state === 'waiting'){
        user.approval_state = 'approved'
        approvalNotification(user.email, user.family_name, user.given_name)
      } else {
        user.approval_state = 'waiting'
      }
      userRepository.save(user)
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
