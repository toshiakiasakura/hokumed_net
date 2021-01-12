import { getManager, getRepository } from 'typeorm'
import { ExpressFunc, ExpressMiddleFunc } from '../helpers/express_typing'
import { User } from '../entity/user.entity'
import { 
  Subject, Class_Year, Semester_Subject, Semester, Document_File 
} from '../entity/study.entity'
import { 
  getOneSemesterSubjects, Year2ClassID, UserFromCookies, 
  classID2Year, subjectsFromSemester, getOneFile
} from '../helpers/connect.table.helper' 
import { Notification } from '../entity/notification.entity'



export class UtilsController{
  // Return multiple objects or one objects for each class.
  static NotificationBoard: ExpressFunc = async function(req,res){
    let notifications= await getRepository(Notification).find()
    res.json({contents: notifications, status:200})
  }

  static OneNotification: ExpressFunc = async function (req, res){
    let notification = await getRepository(Notification)
        .findOne(req.params.id)
    res.json({content: notification, status:200})
  }

  static SubjectBoard: ExpressFunc = async (req, res) =>{
    let subjects = await getRepository(Subject).find()
    res.json({contents: subjects, status:200})
  }

  static OneSubject: ExpressFunc = async function (req, res){
    let subject= await getRepository(Subject)
        .findOne(req.params.id)
    res.json({content: subject, status:200})
  }

  static ClassYearBoard: ExpressFunc = async (req, res) => {
    let years = await getRepository(Class_Year).find()
    res.json({contents: years, status:200})
  }

  static OneClassYear: ExpressFunc = async function (req, res){
    let year = await getRepository(Class_Year)
        .findOne(req.params.id)
    res.json({content: year, status:200})
  }

  static UserBoard: ExpressFunc = async (req, res) => {
    let users = await getRepository(User).find()
    res.json({contents: users, status:200})
  }

  static OneUser: ExpressFunc = async (req, res) => {
    let user = await getRepository(User)
        .findOne(req.params.id)
    res.json({content: user, status:200})
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

  static OneSemester: ExpressFunc = async function(req, res){
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
}