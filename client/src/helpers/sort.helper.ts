
export function sortDate(
  contents:any[], index: string, ascending:boolean
){
  if(contents=== undefined){
    return contents
  } else {
    let c = contents
      c = c.sort((n1,n2) =>{
        if(ascending){
          return new Date(n1[index]).getTime() - new Date(n2[index]).getTime()
        } else {
          return new Date(n2[index]).getTime() - new Date(n1[index]).getTime()
        }
      })
    return c
  }
}


export function sortLearnYearTerm(
  contents:any[], ascending:boolean
){
  if(contents === undefined){
    return contents
  } else {
    let c = contents
    c = c.sort((n1,n2)=>{
      let year1: number = n1.learn_year
      let year2: number  = n2.learn_year
      let term1 = n1.learn_term === 'pre' ? 0 : 0.5
      let term2 = n2.learn_term === 'pre' ? 0 : 0.5
      let num1 = year1 + term1
      let num2 = year2 + term2
      if(ascending){
        return num1 - num2 
      } else {
        return num2 - num1
      }
    })
    return c

  }
}