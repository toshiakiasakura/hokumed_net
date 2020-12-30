import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'
import { SemesterSubjects } from '../../client/src/entity/study.entity'
import { json } from 'body-parser'

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

  static SemesterBoard: ExpressFunc = async function(req, res){
    console.log('SemesterBoard process started. ')
    let semesterRepo = getManager().getRepository(Semester)
    let semesters = await semesterRepo.find()
    if (semesters){
      const semSubs =  semesters.map( 
        async sem => {
          const class_year =  await classID2Year(sem.class_year_id)
          const subjects = await subjectsFromSemester(sem.id)

          const semesterSubject = {
            id: sem.id,
            class_year_id: sem.class_year_id,
            class_year: class_year, 
            learn_year: sem.learn_year,
            learn_term: sem.learn_term,
            created_at: new Date, 
            subjects: subjects
          }
          return( semesterSubject)
      })
      Promise.all(semSubs)
      .then( result => {
        console.log(result)
        res.json({semesters: result, status:200})
      })
    } else {
      res.json({status:401, msg:"データがありません．"})
    }

  }
}

const subjectsFromSemester = async (semester_id: number) => { 
  let semSubRepo = getManager().getRepository(Semester_Subject)
  let subjectRepo = getManager().getRepository(Subject)
  const semSubs = await semSubRepo.find({where:{semester_id:semester_id}} )
  let subjects = semSubs.map( async (semSub) => {
      const subject = await subjectRepo.findOne(semSub.subject_id)
      return(subject)
    })
  return Promise.all(subjects)
}

const classID2Year = async (id: number)  => {
  let yearRepo = getManager().getRepository(Class_Year)
  const class_year= await yearRepo.findOne(id)
  const year = class_year ? class_year.year : null
  return(year)
}

export { AdminController }
