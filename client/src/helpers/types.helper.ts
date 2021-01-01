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