
export function sortDate(contents:any[], index: string, ascending:boolean){
  let res = contents
  if(ascending){
    res = res.sort((n1,n2) =>{
      return new Date(n1[index]).getTime() - new Date(n2[index]).getTime()
    })
  } else {
    res = res.sort((n1,n2) => {
      return new Date(n2[index]).getTime() - new Date(n1[index]).getTime()
    })
  }
  return res
}