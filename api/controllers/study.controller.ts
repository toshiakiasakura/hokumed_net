import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'
import { SemesterSubjects } from '../../client/src/entity/study.entity'
import { subjectsFromSemester, classID2Year } from '../helpers/connect.table.helper' 

class StudyController{
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


export { StudyController }