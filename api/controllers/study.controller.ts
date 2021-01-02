import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'
import { SemesterSubjects } from '../../client/src/entity/study.entity'
import { subjectsFromSemester, classID2Year } from '../helpers/connect.table.helper' 

const switchDic: {[index: string]: 
    typeof Class_Year | typeof Notification
  } = {
  year: Class_Year, 
  notification:Notification
}
const switchKeys = Object.keys(switchDic)


function EditClassYear (
  Repo:any , obj: Class_Year, body: Class_Year, update:boolean
){
  obj.year = body.year
  if(update){
    obj.updated_at = new Date()
  }
  Repo.save(obj)
}

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
    res.json({contents:years, status:200})
  }

  static NotificationBoard: ExpressFunc = async function(req, res){
    let notificationRepository = getManager().getRepository(Notification)
    const notifications = await notificationRepository.find()
    res.json({notifications:notifications, status:200})
  }

  static SendOneObject: ExpressFunc = async function(req, res) {
    if(req.params && switchKeys.includes(req.params.kind)){
        let cls = switchDic[req.params.kind]
        let Repo = getManager().getRepository(cls)
        const obj = await Repo.findOne(req.params.id)
        if(obj){
          res.json({content:obj, status:200})
        } else {
          res.json({status:401, msg:'There is no matched id.'})
        }
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  static SendMultipleObjects: ExpressFunc = async function(req, res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let cls = switchDic[req.params.kind]
      let Repo = getManager().getRepository(cls)
      const clsObjects = await Repo.find()
      res.json({contents:clsObjects, status:200})
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  static DeleteOneObject: ExpressFunc = async function(req, res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let cls = switchDic[req.params.kind]
      let Repo = getManager().getRepository(cls)
      const obj = await Repo.findOne(req.params.id)
      if(obj){
        await Repo.remove(obj)
        res.json({status:200})
      } else {
        res.json({status:401, msg:'Data not found. '})
      }
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  static EditOneObject: ExpressFunc = async function(req, res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let cls = switchDic[req.params.kind]
      let Repo = getManager().getRepository(cls)
      const obj = await Repo.findOne(req.params.id)
      if(obj){
        let kind = req.params.kind 

        // Add new patterns here. 
        if(kind === 'year'){
          EditClassYear(Repo, obj, req.body, true)
        }
        res.json({status:200, msg:'Edit succeeded.'})
      } else {
        res.json({status:401, msg:'Data not found. '})
      }
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  static NewOneObject: ExpressFunc = async function(req,res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let cls = switchDic[req.params.kind]
      let Repo = getManager().getRepository(cls)
      
      // Add new patterns here. 
      if(req.params.kind === 'year'){
        const obj = new Class_Year()
        EditClassYear(Repo, obj, req.body, false)
      }
      res.json({status:200, msg:'new object was created.'})
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }

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
          return(semesterSubject)
      })
      Promise.all(semSubs)
      .then( result => {
        res.json({semesters: result, status:200})
      })
    } else {
      res.json({status:401, msg:"データがありません．"})
    }

  }
}


export { StudyController }