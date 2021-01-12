import { getManager, getRepository } from 'typeorm'
import fs, { fstatSync } from 'fs'

import { ExpressFunc } from '../helpers/express_typing'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester, Document_File } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { EmailSender } from '../helpers/email.helper'
import { SemesterSubjects, SemesterSubjectsDetail } from '../../client/src/entity/study.entity'
import { 
  getOneSemesterSubjects, Year2ClassID
} from '../helpers/connect.table.helper' 
import { DOWNLOAD_PATH, TypeMulterFile } from '../helpers/files.helper'

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
  let dir_old = `${DOWNLOAD_PATH}/${obj.title_en}`
  let dir_new = `${DOWNLOAD_PATH}/${body.title_en}`
  // Change the directory name.
  if(type === 'update'){
    obj.updated_at = new Date()
    fs.renameSync(dir_old, dir_new)
  } else {
    if(! fs.existsSync(dir_new)){
      fs.mkdirSync(dir_new)
    }
  }
  obj.title_en = body.title_en
  obj.title_ja = body.title_ja
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

  let semesterRepo = getRepository(Semester)
  let semSubRepo = getRepository(Semester_Subject)
  let semester = type === 'edit' 
    ? await semesterRepo.findOne(id) 
    : new Semester()

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

  static EditClassYear: ExpressFunc = async (req, res) => {
    let Repo = getRepository(Class_Year)
    let obj = await Repo.findOne(req.params.id)
    if(obj){
      await EditClassYear(Repo, obj, req.body, 'update')
      res.json({status:200, msg:'Edit succeeded.'})
    } else {
      res.json(DataNotFound)
    }
  }

  static EditSubject: ExpressFunc = async (req, res) => {
    let Repo = getRepository(Subject)
    let obj = await Repo.findOne(req.params.id)
    if(obj){
      await EditSubject(Repo, obj, req.body, 'update')
      res.json({status:200, msg:'Edit succeeded.'})
    } else {
      res.json(DataNotFound)
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

  static EditNotification: ExpressFunc = async (req, res) => {
    let Repo = getRepository(Notification)
    let obj = await Repo.findOne(req.params.id)
    if(obj){
      await EditNotification(Repo, obj, req.body, 'update')
      res.json({status:200, msg:'Edit succeeded.'})
    } else {
      res.json(DataNotFound)
    }
  }

  static EditUser: ExpressFunc = async (req, res) => {
    let Repo = getRepository(User)
    let obj = await Repo.findOne(req.params.id)
    if(obj){
      await EditUser(Repo, obj, req.body, 'update')
      res.json({status:200, msg:'Edit succeeded.'})
    } else {
      res.json(DataNotFound)
    }
  }

  static NewClassYear: ExpressFunc = async (req, res) => {
    let Repo = await getRepository(Class_Year)
    const obj = new Class_Year()
    EditClassYear(Repo, obj, req.body, 'new')
    res.json({status:200, msg:'new object was created.'})
  }

  static NewSubject: ExpressFunc = async (req, res) => {
    let Repo = await getRepository(Subject)
    const obj = new Subject()
    EditSubject(Repo, obj, req.body, 'new')
    res.json({status:200, msg:'new object was created.'})
  }

  static NewNotification: ExpressFunc = async (req, res) => {
    let Repo = await getRepository(Notification)
    const obj = new Notification()
    EditNotification(Repo, obj, req.body, 'new')
    res.json({status:200, msg:'new object was created.'})
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

  static DeleteClassYear: ExpressFunc = async function(req, res){
    let yearRepo = getRepository(Class_Year)
    const year = await yearRepo.findOne(req.params.id)
    if(year){
      // delete user
      await getRepository(User).delete({class_year:year.year})

      // delete Semester and Semester_Subject.
      let semesterRepo = getRepository(Semester)
      let semesters =  await semesterRepo.find({class_year_id:year.id})
      let SemSubRepo = getRepository(Semester_Subject)
      for(let i = 0; i < semesters.length; i++){
        await SemSubRepo.delete({semester_id:semesters[i].id})
        await semesterRepo.remove(semesters[i])
      }
      await yearRepo.remove(year)
      res.json({status:200})
    } else {
      res.json(DataNotFound)
    }
  }

  static DeleteSemester: ExpressFunc = async function(req, res){
    let semesterRepo = getRepository(Semester)
    let semester = await semesterRepo.findOne(req.params.id)
    if(semester){
      await getRepository(Semester_Subject).delete({semester_id:semester.id})
      await semesterRepo.remove(semester)
      res.json({status:200})
    } else {
      res.json(DataNotFound)
    }
  }

  static DeleteSubject: ExpressFunc = async (req, res) => {
    let subjectRepo = getRepository(Subject)
    let subject = await subjectRepo.findOne(req.params.id)
    if(subject){
      let dir = `${DOWNLOAD_PATH}/${subject.title_en}`
      fs.rmdirSync(dir, {recursive:true})
      await getRepository(Document_File).delete({subject_id:subject.id})
      await subjectRepo.remove(subject)
      res.json({status:200})
    } else {
      res.json(DataNotFound)
    }
  }

  static DeleteUser: ExpressFunc = async (req, res) => {
    await getRepository(User).delete(req.params.id)
    res.json({status:200})
  }

  static DeleteNotification: ExpressFunc = async (req, res) => {
    await getRepository(Notification).delete(req.params.id)
    res.json({status:200})
  }

  /**
   * Send SemesterSubjects contents. what's a different from 
   * SemesterBoard of UtilsController.  
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
