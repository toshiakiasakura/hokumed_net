export type MatchIDType = {match:{params:{id:number}}}

export type OneClassStatus<T> = {
  content: T | null, status:number
}  