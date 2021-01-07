import { Doc_File, Subject, Class_Year } from '../entity/study.entity'
import { User } from '../entity/user.entity'

export type MatchIDType = {match:{params:{id:number}}}

export type StatusMsg = {
  status: number, msg: string
}

/**
 * One object and status. Use with AdminService.getOneDetail.
 */
export type OneClassStatus<T> = {
  content: T , status:number, msg:string
}  

/**
 * content is the array of one class. 
 */
export type MultiClassStatus<T> = {
  contents: T[], status:number, msg:string
}

/**
 * File form data type.
 */
export type FileFormData = {
  class_year: string,
  comment: string,
  code_radio: '問題' | '解答',
  files:File[],
  no_doc: string,
  test_kind:'本試' | '追試' 
}

/**
 * File subject status for study subject page.
 */
export type FilesSubjectStatus = {
  contents: {
    items: Doc_File[], 
    subject: Subject,
    class_years: Class_Year[]
  },
  status:number,
  msg: string,
  new: boolean
}

/**
 * Admin-user filtering function.
 */
export type UsersState = {
  contents: User[], status:number, msg:string, 
  filtered: User[], fil_year: number, fil_name:string,
  fil_state: string, fil_mail:string
} 