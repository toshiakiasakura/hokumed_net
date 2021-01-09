import { Doc_File, Subject, Class_Year, SemesterSubjects } from '../entity/study.entity'
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

export type State = {
  // Used inside axios functions.
  Multi: {
    Class_Year : MultiClassStatus<Class_Year>
    Doc_File: MultiClassStatus<Doc_File>
    Subject: MultiClassStatus<Subject>
    User: MultiClassStatus<User>
    SemesterSubjects: MultiClassStatus<SemesterSubjects>
  }
  // Used inside axios functions.
  One : {
    Class_Year : OneClassStatus<Class_Year>
    Doc_File: OneClassStatus<Doc_File>
    Subject: OneClassStatus<Subject>
    User: OneClassStatus<User>
  }
  // Including states for board in list page.
  Admin: {
    User : {
      contents: User[], status:number, msg:string, 
      filtered: User[], fil_year: number, fil_name:string,
      fil_state: string, fil_mail:string
    }
    Subject : {
      contents: Subject[], status: number, msg:string,
      filtered: Subject[], fil_name:string
    }
    SemesterSubjects: {
      contents: SemesterSubjects[], status:number, msg:string,
      filtered: SemesterSubjects[],
      fil_year: number,
      fil_learn_year: number,
      fil_learn_term: string,
      fil_subject: string
    }
  }
}

/**
 * Form type declaration.
 */
export type Form = {
  File: {
    class_year: string,
    comment: string,
    code_radio: '問題' | '解答',
    no_doc: string,
    test_kind:'本試' | '追試' 
  }
  /**
   * This type is data format for input.
   * @param birthday The combination of bith related parameters.
   *                 This value is used for database.
   */
  SignUp: {
    email: string
    password: string
    family_name: string
    given_name: string
    handle_name: string
    birth_year: string
    birth_month: string
    birth_day: string
    birthday: Date
    email_mobile: string
    class_year: number
    reenteredPassword: string
  }

  Profile: {
    email: string
    family_name: string
    given_name: string 
    handle_name: string
    birth_year: string
    birth_month: string
    birth_day: string
    birthday: Date 
    email_mobile: string
    class_year: number
  }
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
