export type MatchIDType = {match:{params:{id:number}}}

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
  code_radio: string,
  files:File[],
  no_doc: string,
  test_kind: string
}