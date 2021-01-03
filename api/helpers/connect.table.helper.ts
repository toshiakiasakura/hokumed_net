import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { 
  Subject, Class_Year, Semester_Subject, Semester 
} from '../entity/study.entity'

export const subjectsFromSemester = async (semester_id: number) => { 
  let semSubRepo = getManager().getRepository(Semester_Subject)
  let subjectRepo = getManager().getRepository(Subject)
  const semSubs = await semSubRepo.find({where:{semester_id:semester_id}} )
  let subjects = semSubs.map( async (semSub) => {
      const subject = await subjectRepo.findOne(semSub.subject_id)
      return(subject)
    })
  return Promise.all(subjects)
}

export const classID2Year = async (id: number)  => {
  let yearRepo = getManager().getRepository(Class_Year)
  const class_year= await yearRepo.findOne(id)
  const year = class_year ? class_year.year : null
  return(year)
}

export const Year2ClassID = async (year: number) => {
  let yearRepo = getManager().getRepository(Class_Year)
  const obj = await yearRepo.findOne({where:{year:year}})
  const id = obj ? obj.id : null
  return(id)
}

/**
 * Given a one semester data, return semesterSubjects data. 
 * @param sem semester object.
 */
export async function getOneSemesterSubjects(sem: Semester){
  const class_year =  await classID2Year(sem.class_year_id)
  let pre_subjects = await subjectsFromSemester(sem.id)
  let subjects = pre_subjects.filter(v => v !== undefined) as Subject[]
  const semesterSubject = {
    id: sem.id,
    class_year_id: sem.class_year_id,
    class_year: class_year, 
    learn_year: sem.learn_year,
    learn_term: sem.learn_term,
    created_at: sem.created_at, 
    updated_at: sem.updated_at,
    subjects: subjects
  }
  return(semesterSubject)
}

/**
 * From header, user object is extracted. 
 */
export async function UserFromHeader(req:any){
  let userRepository = getManager().getRepository(User)
  const userID = req.headers['x-user-id']
  let user = undefined
  if (typeof userID === 'string'){
    user = await userRepository.findOne(parseInt(userID))
  }
  console.log('UserFromHeader process ',userID, user, typeof userID, typeof user)
  return user

}