import { Request, Response } from 'express'
import { getManager, getRepository } from 'typeorm'
import { User } from '../entity/user.entity'
import { 
  Subject, Class_Year, Semester_Subject, 
  Semester, Document_File, File_Code
} from '../entity/study.entity'
import { 
  SemesterSubjects, SemesterSubjectsDetail, Doc_File
} from '../../client/src/entity/study.entity'

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
  const semesterSubject: SemesterSubjects = {
    id: sem.id,
    class_year_id: sem.class_year_id,
    // To avoid undefined.
    class_year: class_year ? class_year : 9999999, 
    learn_year: sem.learn_year,
    learn_term: sem.learn_term,
    created_at: sem.created_at, 
    updated_at: sem.updated_at,
    subjects: subjects
  }
  return(semesterSubject)
}

/**
 * Given a one document file, construct File object. 
 * @param req 
 */
export async function getOneFile(
  doc_file:Document_File,
){
  let userRepository = getManager().getRepository(User)
  let user = await userRepository.findOne(doc_file.user_id) 
  let codeRepository = getManager().getRepository(File_Code)
  let file_code = await codeRepository.findOne(
        {where: {code:doc_file.code}}
        )
  let subjectRepo = getManager().getRepository(Subject)
  let subject = await subjectRepo.findOne(doc_file.subject_id)
  if(user && file_code && subject ){
    const file: Doc_File = {
      id: doc_file.id,
      subject_id: doc_file.subject_id,
      user_id: doc_file.user_id,
      class_year: doc_file.class_year,
      file_name: doc_file.file_name,
      file_content_type: doc_file.file_content_type,
      code: doc_file.code,
      comment: doc_file.comment,
      download_count: doc_file.download_count,
      created_at: doc_file.created_at,
      updated_at: doc_file.updated_at,
      subject: subject,
      user: user,
      file_code: file_code 
    }
    return(file)
  } else {
    return null
  }
}

/**
 * From header, user object is extracted. 
 */
export async function UserFromCookies(req:Request){
  let userRepository = getManager().getRepository(User)
  const userID = req.cookies['userID']
  let user = undefined
  if (typeof userID === 'string'){
    user = await userRepository.findOne(parseInt(userID))
  }
  return user

}