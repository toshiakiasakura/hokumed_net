import { Express } from 'express'
import { getManager } from 'typeorm'
import fs from 'fs'
import multer from 'multer'
import { User } from '../entity/user.entity'
import { ExpressFunc, ExpressMiddleFunc } from '../helpers/express_typing'
import { Subject, Class_Year, Semester_Subject, Semester, Document_File } from '../entity/study.entity'
import { Notification } from '../entity/notification.entity'
import { 
  getOneSemesterSubjects, Year2ClassID, UserFromHeader, 
  classID2Year, subjectsFromSemester, getOneFile
} from '../helpers/connect.table.helper' 

const DOWNLOAD_PATH = `${__dirname}/../../../downloads`
class UserController{

  /**
   * Used for displaying personal account information
   * in individual profile page.
   */
  static ProfileBoard: ExpressFunc = async (req, res) => {
    const user = await UserFromHeader(req)
    if(user){
      res.json({content:user, status:200})
    } else{
      res.json({status:401})
    }
  }

  /**
   * Return notification informations.  
   */
  static NotificationBoard: ExpressFunc = async function(req,res){
    let notifications= await getManager()
      .getRepository(Notification)
      .find()
    res.json({contents: notifications, status:200})
  }

  /**
   * Send data for toggle menus of "/semester" page. 
   */
  static SemesterBoard: ExpressFunc = async (req,res) => {
    const user = await UserFromHeader(req)
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

  static UploadFile: ExpressFunc = async (req, res) => {
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null,'./downloads/')
      },
      filename: (req,file, cb)=>{
        console.log('downloading ', file.originalname)
        cb(null, file.originalname)
      }
    })
    let upload = multer({storage:storage}).array('upload')

    upload(req, res, (err:any)=>{
      console.log('file uploading', req.body)
      console.log('file information', req.files, typeof req.files)
      let dirName = req.body.subject_title_en
      let dirPath = `${DOWNLOAD_PATH}/${dirName}` 
      if(! fs.existsSync(dirPath)){
        fs.mkdir(dirPath, err=>{console.log(err)})
      }
      let MulterFile: Express.Multer.File
      let files = req.files as unknown as typeof MulterFile[]
      let flagDuplicate = false
      
      console.log("filepath",dirName)
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
        files.forEach(f => {
          fs.renameSync(`${DOWNLOAD_PATH}/${f.originalname}`, `${dirPath}/${f.originalname}`,)
        })
        res.json({status:200, msg:'アップロードに成功しました．'})
      }
    })
  }
}

export { UserController }
