import { getManager, getRepository } from 'typeorm'
import fs from 'fs'
import multer from 'multer'

import { User } from '../entity/user.entity'
import { newBCryptPassword} from '../helpers/bcrypt.helper'
import { ExpressFunc, ExpressMiddleFunc } from '../helpers/express_typing'
import { 
  Subject, Class_Year, Semester_Subject, Semester, Document_File 
} from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { 
  getOneSemesterSubjects, Year2ClassID, UserFromCookies, 
  classID2Year, subjectsFromSemester, getOneFile
} from '../helpers/connect.table.helper' 

const DOWNLOAD_PATH = `${__dirname}/../../../downloads`
let MulterFile: Express.Multer.File
type TypeMulterFile = typeof MulterFile[]

class UserController{

  /**
   * Used for displaying personal account information
   * in individual profile page.
   */
  static ProfileBoard: ExpressFunc = async (req, res) => {
    const user = await UserFromCookies(req)
    if(user){
      res.json({content:user, status:200})
    } else{
      res.json({status:401})
    }
  }

  static EditProfile: ExpressFunc = async(req, res) => {
    const userRepo = getManager().getRepository(User)
    const user = await userRepo.findOne(req.cookies.userID)
    if(user){
      user.handle_name = req.body.handle_name
      user.email_mobile = req.body.email_mobile
      user.birthday = req.body.bitrhday
      await userRepo.save(user)
      res.json({status:200, msg:'編集しました．'})
    } else {
      res.json({status:401, msg:"ユーザーが見つかりませんでした．"})
    }
  }

  static ChangePassword: ExpressFunc = async(req, res) => {
    const userRepo = getManager().getRepository(User)
    const user = await userRepo.findOne(req.cookies.userID)
    if(user){
      const [ salt, crypted_password ] = newBCryptPassword(req.body.password)
      user.salt = salt
      user.crypted_password = crypted_password
      await userRepo.save(user)
      res.json({status:200, msg:'編集しました．'})
    } else {
      res.json({status:401, msg:'編集に失敗しました．'})
    }
  }

  /**
   * Return notification information.
   */
  static NotificationBoard: ExpressFunc = async function(req,res){
    let notifications= await getManager()
      .getRepository(Notification)
      .find()
    res.json({contents: notifications, status:200})
  }

  static OneNotification: ExpressFunc = async function (req, res){
    let notification = await  getManager()
      .getRepository(Notification)
      .findOne(req.params.id)
    res.json({content: notification, status:200})
  }

  /**
   * Return subject information. 
   */
  static SubjectBoard: ExpressFunc = async (req, res) =>{
    let subjects = await getManager()
      .getRepository(Subject)
      .find()
    res.json({contents: subjects, status:200})
  }

  /**
   * Send data for toggle menus of "/semester" page. 
   */
  static SemesterBoard: ExpressFunc = async (req,res) => {
    const user = await UserFromCookies(req)
    if(user){
      const class_year_id = await Year2ClassID(user.class_year)
      if(class_year_id){
        const semesters= await getManager().getRepository(Semester)
          .find({class_year_id:class_year_id})

        if(semesters){
          const semSubs = semesters.map(getOneSemesterSubjects)
          Promise.all(semSubs)
          .then(result =>{
            res.json({contents: result, status:200})
          })
        }
      }
    }
  }
  /**
   * Document_File[] with File_Code, Subject, User is created. 
   * Based on req.params.kind value 
   * @param req.params.title_en subject english title. 
   * @param req.params.kind Take exam, quiz, summary or personal.
   */
  static FileBoard: ExpressFunc = async (req, res) => {
    let subject = await getManager()
      .getRepository(Subject)
      .findOne( {where:{title_en:req.params.title_en}} )
    if(subject){
      let doc_files = await getManager()
        .getRepository(Document_File)
        .find({subject_id:subject.id})
      let files = doc_files.map(getOneFile)
      let class_years = await getManager()
        .getRepository(Class_Year)
        .find()

      Promise.all(files)
      .then(result =>{
        let filtered_result = result.filter(
          v => {
            return v !== null && v.file_code.kind === req.params.kind
          })
        res.json({
          contents: {
            items:filtered_result, 
            subject: subject,
            class_years:class_years
          },
          status:200
        })
      })
    }
  }

  static DownloadFile: ExpressFunc = async (req, res) => {
    let docRepo = getManager().getRepository(Document_File)
    let doc_file = await docRepo.findOne(req.params.id)
    if(doc_file){
      let subject= await getManager()
        .getRepository(Subject)
        .findOne(doc_file.subject_id)
      if(subject){
        let title_en = subject.title_en
        const filePath = `${DOWNLOAD_PATH}/${title_en}/${doc_file.file_name}`
        res.download(filePath)

        doc_file.download_count += 1 
        docRepo.save(doc_file)
      }
    }
  }

  /**
   * Upload file to /downloads/subject_title_en/file_name. 
   * If one of the uploading files is duplicated, delete all the 
   * uploading files. 
   */
  static UploadFile: ExpressFunc = async (req, res) => {
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null,'./downloads/')
      },
      filename: (req,file, cb)=>{
        cb(null, file.originalname)
      }
    })
    let upload = multer({storage:storage}).array('upload')

    upload(req, res, (err:any)=>{
      let dirName = req.body.subject_title_en
      let dirPath = `${DOWNLOAD_PATH}/${dirName}` 
      let files = req.files as unknown as TypeMulterFile

      // subject directory.
      if(! fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, )
      }

      let flagDuplicate = false
      let msgDuplicate = ''
      files.forEach(f => {
        if(fs.existsSync(dirPath + '/' + f.originalname)){
          msgDuplicate += `・${f.originalname}\n`
          flagDuplicate = true
        }
      })
      if(flagDuplicate){
        let msg = ''
        files.forEach(f => {
          fs.unlinkSync(DOWNLOAD_PATH + '/' + f.originalname)
        })
        res.json({status:401, msg:'重複するファイルがありました．\n' + msgDuplicate})
      } else {
        uploadProcessor(files,req.body,dirPath, req.cookies.userID)
        res.json({status:200, msg:'アップロードに成功しました．'})
      }
    })
  }

  static DeleteFile: ExpressFunc = async (req, res) => {
    let user = await UserFromCookies(req)
    if(user && 
      (user.admin || user.id === parseInt(req.params.id) )
    ){
      let fileRepo = getManager().getRepository(Document_File)
      let file = await fileRepo.findOne(req.params.id)
      let subject = await getManager()
        .getRepository(Subject)
        .findOne(file?.subject_id)
      if(file && subject){
        let filePath = `${DOWNLOAD_PATH}/${subject.title_en}/${file.file_name}`
        await fileRepo.delete(req.params.id)
        if(!fs.existsSync(filePath)){
          res.send({status:401, msg:'データベースの削除のみ行いました．'})
        } else {
          fs.unlinkSync(filePath)
          res.send({status:200,msg:'削除しました．'})
        }
      } else {
        res.send({status:201, msg:'削除に失敗しました．'})
      }
    } else { 
      res.send({status:401, msg:'削除権限がありません．\n削除出来るのはアップロードした人か管理者のみです．'})
    } 
  }
}

/**
 * Save file information to database. 
 */
function uploadProcessor(
  files: TypeMulterFile, body:any, 
  dirPath: string, userID: string
 ){
  let fileRepo = getManager().getRepository(Document_File)
  files.forEach(f => {
    fs.renameSync(`${DOWNLOAD_PATH}/${f.originalname}`, `${dirPath}/${f.originalname}`,)
    let newFile = new Document_File() 
    newFile.subject_id = parseInt(body.subject_id)
    newFile.user_id = parseInt(userID) 
    newFile.class_year = parseInt(body.class_year)
    newFile.file_name = f.originalname
    newFile.file_content_type = f.mimetype
    newFile.code = codeConverter(body)
    newFile.comment = body.comment
    fileRepo.save(newFile)
  })
}

/**
 * Convert string information to "code" in file__code table.
 */
function codeConverter(body:any){
  let kind = body.page_kind
  let no_doc = body.no_doc
  let test_kind = body.test_kind 
  let type = body.code_radio
  const add_dict = { 
    'exam':0, 'quiz':2000, 'summary':4000, 'personal':5000
  }
  let code = 0 
  if(kind === 'exam'){
    if(no_doc[0] === '第') code += parseInt(no_doc.slice(1, -1))
    if(no_doc === '中間' && test_kind ==='本試' ) code += 98
    if(no_doc === '期末' && test_kind ==='本試' ) code += 99
    if(no_doc === '中間' && test_kind ==='追試' ) code += 96
    if(no_doc === '期末' && test_kind ==='追試' ) code += 97
    if(type === '解答') code += 1000
  } else if(kind==='quiz'){
    code =  2000 
    code += parseInt(no_doc.slice(1,-1))
    if(type === '解答') code += 1000
  } else if(kind==='summary'){
    code = 4000 
    code += parseInt(no_doc.slice(1,-1))
  } else if(kind==='personal'){
    code = 5000
  }
  return code 
}

export { UserController }
