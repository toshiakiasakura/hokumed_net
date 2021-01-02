import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'
import { SemesterSubjects } from '../../client/src/entity/study.entity'
import { subjectsFromSemester, classID2Year } from '../helpers/connect.table.helper' 

const switchDic: {[index: string]: 
  typeof User |
  typeof Class_Year |
  typeof Subject | 
  typeof Notification 
  } = {
  user: User,
  year: Class_Year, 
  subject: Subject,
  notification:Notification
}

const switchKeys = Object.keys(switchDic)
type UpdateOrNew = 'update' | 'new'

type EditFunc<T> = (
  Repo: any, obj: T, body: T, type: UpdateOrNew
) => void

const DataNotFound: {
  status: number,
  msg: string
} = {
  status: 401,
  msg: 'Data not found.'
}

const EditClassYear:EditFunc<Class_Year> =  async ( 
  Repo, obj, body , type 
) => {
  obj.year = body.year
  if(type === 'update'){
    obj.updated_at = new Date()
  }
  await Repo.save(obj)
}

const EditSubject: EditFunc<Subject> = async (
  Repo, obj, body, type 
) => {
  obj.title_en = body.title_en
  obj.title_ja = body.title_ja
  if(type === 'update'){
    obj.updated_at = new Date()
  }
  await Repo.save(obj)
}

const EditNotification: EditFunc<Notification> = async (
  Repo, obj, body, type 
) => {
  obj.title = body.title
  obj.text = body.text
  if(type === 'update'){
    obj.updated_at = new Date()
  }
  await Repo.save(obj)
}

class StudyController{

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
        res.json(DataNotFound)
      }
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  static EditOneObject: ExpressFunc = async function(req, res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let kind = req.params.kind
      let obj = undefined

      // Add new patterns here. 
      if(kind === 'year'){
        let Repo = getManager().getRepository(Class_Year)
        let obj = await Repo.findOne(req.body.id)
        if(obj){
          await EditClassYear(Repo, obj, req.body, 'update')
          res.json({status:200, msg:'Edit succeeded.'})
        } else {
          res.json(DataNotFound)
        }
      } else if (kind === 'subject'){
        let Repo = getManager().getRepository(Subject)
        let obj = await Repo.findOne(req.body.id)
        if(obj){
          await EditSubject(Repo, obj, req.body, 'update')
          res.json({status:200, msg:'Edit succeeded.'})
        } else {
          res.json(DataNotFound)
        }
      } else if (kind === 'notification'){
        let Repo = getManager().getRepository(Notification)
        let obj = await Repo.findOne(req.body.id)
        if(obj){
          await EditNotification(Repo, obj, req.body, 'update')
          res.json({status:200, msg:'Edit succeeded.'})
        } else {
          res.json(DataNotFound)
        }
      }
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  static NewOneObject: ExpressFunc = async function(req,res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let cls = switchDic[req.params.kind]
      let kind = req.params.kind
      let Repo = getManager().getRepository(cls)

      
      // Add new patterns here. 
      if(kind === 'year'){
        const obj = new Class_Year()
        EditClassYear(Repo, obj, req.body, 'new')
      } else if (kind === 'subject'){
        const obj = new Subject()
        EditSubject(Repo, obj, req.body, 'new')
      } else if (kind === 'notification'){
        const obj = new Notification()
        EditNotification(Repo, obj, req.body, 'new')
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