import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'
import { SemesterSubjects, SemesterSubjectsDetail } from '../../client/src/entity/study.entity'
import { 
  getOneSemesterSubjects, Year2ClassID
} from '../helpers/connect.table.helper' 


const switchDic: {[index: string]: 
  typeof User |
  typeof Class_Year |
  typeof Subject | 
  typeof Notification |
  typeof Semester 
  } = {
  user: User,
  year: Class_Year, 
  subject: Subject,
  notification:Notification,
  semester: Semester

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
  if(type==='update'){
    obj.updated_at = new Date()
  }
  await Repo.save(obj)
}

const EditUser : EditFunc<User> = async (
  Repo, obj, body, type 
) => {
  obj.family_name = body.family_name
  obj.given_name = body.given_name
  obj.handle_name = body.handle_name
  obj.email_mobile = body.email_mobile
  obj.birthday = body.birthday
  obj.class_year = body.class_year
  if(type==='update'){
    obj.updated_at = new Date()
  }
  await Repo.save(obj)
}

/**
 * Delete all the appropriate semester_id from Semester_Subject,
 * and register all the subject_id with its semester_id.  
 */
async function EditSemesterCore(
    req:{body:SemesterSubjectsDetail},
    type: 'edit' | 'new',
    id?: string 
){
  let semSubs = req.body.item
  let subjects  = req.body.subjects
  let checkboxes = req.body.checkboxes
  semSubs.subjects = subjects.map(
    (v,i) => checkboxes[i] ? v : undefined 
  ).filter(v => v !== undefined ) as Subject[]

  let semesterRepo = getManager().getRepository(Semester)
  let semSubRepo = getManager().getRepository(Semester_Subject)
  let semester = type === 'edit' ? await semesterRepo.findOne(id) : new Semester()

  if(semester){
    // Semester Register part 
    const class_year_id = await Year2ClassID(semSubs.class_year)
    semester.class_year_id = class_year_id ? class_year_id : NaN
    semester.learn_year = semSubs.learn_year
    semester.learn_term = semSubs.learn_term
    semester.updated_at = new Date()

    await semesterRepo.save(semester)
    if(type === 'edit' && id){
      console.log('deleting process.')
      await semSubRepo.delete( {semester_id:parseInt(id)})
    }

    console.log('saving, process')
    const promise = semSubs.subjects.map(async v => {
      let new_semSub = new Semester_Subject()

      // This 999999 is to avoid undefined semeseter.
      new_semSub.semester_id = semester ? semester.id : 999999 
      new_semSub.subject_id = v.id
      await semSubRepo.save(new_semSub)
      return 'finish'
    })
    return Promise.all(promise)
    .then(_=> "finish")
    .catch(err => console.log(err))
  } else {
    return false
  }
}

class AdminController{

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

  static SendOneObject: ExpressFunc = async function(req, res) {
    if(req.params && switchKeys.includes(req.params.kind)){
        let cls = switchDic[req.params.kind]
        let obj = await getManager()
          .getRepository(cls)
          .findOne(req.params.id)
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
      let clsObjects = await getManager()
        .getRepository(cls)
        .find()
      res.json({contents:clsObjects, status:200})
    } else {
      res.json({status:401, msg:'kind part is not existed.'})
    }
  }

  /**
   * Delete One object. 
   * @param req.kind Takes user, year, subject, semester, notification. 
   *  If subject or semester, related Semester_Subject objects are 
   *  also deleted. 
   * @param res 
   */
  static DeleteOneObject: ExpressFunc = async function(req, res){
    if(req.params && switchKeys.includes(req.params.kind)){
      let cls = switchDic[req.params.kind]
      let Repo = getManager().getRepository(cls)
      const obj = await Repo.findOne(req.params.id)
      if(obj){
        await Repo.remove(obj)
        if(req.params.kind === 'subject'){
          await getManager()
            .getRepository(Semester_Subject)
            .delete({subject_id:obj.id})
        } else if (req.params.kind === 'semester'){
          await getManager()
            .getRepository(Semester_Subject)
            .delete({semester_id:obj.id})
        }
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
        let obj = await Repo.findOne(req.params.id)
        if(obj){
          await EditClassYear(Repo, obj, req.body, 'update')
          res.json({status:200, msg:'Edit succeeded.'})
        } else {
          res.json(DataNotFound)
        }
      } else if (kind === 'subject'){
        let Repo = getManager().getRepository(Subject)
        let obj = await Repo.findOne(req.params.id)
        if(obj){
          await EditSubject(Repo, obj, req.body, 'update')
          res.json({status:200, msg:'Edit succeeded.'})
        } else {
          res.json(DataNotFound)
        }
      } else if (kind === 'notification'){
        let Repo = getManager().getRepository(Notification)
        let obj = await Repo.findOne(req.params.id)
        if(obj){
          await EditNotification(Repo, obj, req.body, 'update')
          res.json({status:200, msg:'Edit succeeded.'})
        } else {
          res.json(DataNotFound)
        }
      } else if (kind === 'user'){
        let Repo = getManager().getRepository(User)
        let obj = await Repo.findOne(req.params.id)
        if(obj){
          await EditUser(Repo, obj, req.body, 'update')
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
  /**
   * Send SemesterSubjects contents.  
   */
  static SemesterBoard: ExpressFunc = async function(req, res){
    let semesters = await getManager()
      .getRepository(Semester)
      .find()
    if (semesters){
      const semSubs =  semesters.map(getOneSemesterSubjects)
      Promise.all(semSubs)
      .then( result => {
        res.json({contents: result, status:200})
      })
    } else {
      res.json({status:401, msg:"データがありません．"})
    }
  }

  static SemesterDetail: ExpressFunc = async function(req, res){
    let semester = await getManager()
      .getRepository(Semester)
      .findOne(req.params.id)
    let subjects = await getManager()
      .getRepository(Subject)
      .find()
    if(semester && subjects ){
      const semSubs = await getOneSemesterSubjects(semester)
      const semSubArray = semSubs.subjects.map(sub =>  sub.title_en )
      const checkboxes = subjects.map(
        sub => semSubArray.includes(sub.title_en)
      )
      res.json({
        content:{
          item: semSubs,
          subjects: subjects,
          checkboxes : checkboxes
        },
        status:200
        })

    }
  }

  static EditSemester:ExpressFunc = async function(req,res ){
    console.log('Edit semester process started')
    const result = await EditSemesterCore(req, 'edit', req.params.id)
    console.log('Edit semester result log: ', result)
    if(result==='finish'){
      res.json({status:200})
    } else {
      (DataNotFound)
    }
  }
  
  static NewSemester:ExpressFunc = async function(req,res){
    console.log('New semester process started')
    const result = await EditSemesterCore(req, 'new')
    console.log('New semester result log: ', result)
    if(result==='finish'){
      res.json({status:200})
    } else {
      (DataNotFound)
    }
  }

  static checkHandle: ExpressFunc = async function(req,res){
    const userRepo = getManager().getRepository(User)
    let handle_user = await userRepo
      .findOne({where:{handle_name: req.body.handle}})
    if (handle_user){
      let reqUser = await userRepo.findOne(req.body.editUserID)
      if(reqUser && reqUser.id === handle_user.id){
        res.json({ status:200, })
      } else {
        res.json({
          status:401,
          msg:'そのハンドルネームは既に用いられています．'
        })
      }
    } else {
      res.json({ status:200, })
    }
  }
}

export { AdminController }
