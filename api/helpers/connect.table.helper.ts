import { getManager } from 'typeorm'
import { User } from '../entity/user.entity'
import { Subject, Class_Year, Semester_Subject, Semester } from '../entity/study.entity'

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