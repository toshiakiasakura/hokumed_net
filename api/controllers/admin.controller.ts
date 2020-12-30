import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'

class AdminController{

  static UserBoard: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
    const users = await userRepository.find()
    res.json({users:users, status:200})
  }

  static UserDetail: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne(id)
    res.json({user:user, status:200})
  }

  static changeApproveStatus: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne(id)
    if(user !== undefined){
      if( user.approval_state === 'waiting'){
        user.approval_state = 'approved'
        EmailSender.approvalNotification(user.email, user.family_name, user.given_name)
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
    let userRepository = getManager().getRepository(User)
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
    let userRepository = getManager().getRepository(User)
    let user = await userRepository.findOne(id)
    if(user !== undefined){
      user.admin = user.admin ? false : true
      await userRepository.save(user)
      res.json({status:200})
    } else {
      res.json({status:401})
    }
  }

  static SubjectBoard: ExpressFunc = async function(req, res){
    console.log('SubjectBoard phase.')
    let subjectRepository = getManager().getRepository(Subject)
    const subjects = await subjectRepository.find()
    res.json({subjects:subjects, status:200})
  }

  static ClassYearBoard: ExpressFunc = async function(req, res){
    let yearRepository = getManager().getRepository(Class_Year)
    const years = await yearRepository.find()
    res.json({years:years, status:200})
  }

  static NotificationBoard: ExpressFunc = async function(req, res){
    let notificationRepository = getManager().getRepository(Notification)
    const notifications = await notificationRepository.find()
    res.json({notifications:notifications, status:200})
  }

}
export { AdminController }
