
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../../helpers/utils.component'
import { SemesterSubjects } from '../../entity/study.entity'

type SemesterState= {
  semesters: SemesterSubjects[] | null,
  status: number
}

const SemesterRow = (props:{semester:SemesterSubjects} ) => {
  const semester = props.semester
  const term = semester.learn_term === 'pre' ? '前期' : '後期'
  const title = `${semester.class_year}期\n${semester.learn_year}年${term}`
  console.log(semester)
  let subjects = semester.subjects.map(sub => sub ? sub.title_ja : '')

  let subjects_str = subjects.join(',  ')

  return(
    <tr>
      <td> {props.semester.id} </td>
      <td> {title} </td>
      <td> {subjects_str} </td>
    </tr>
  )
}


class SemesterBoard extends Component<{},SemesterState>{
  constructor(props:any){
    super(props)
    this.state= {
      semesters: null,
      status: 200,
    }
  }

  componentDidMount(){
    AdminService.getSemesterBoard()
    .then( res => {
      this.setState({
        semesters: res.data.semesters,
        status: res.data.status
      })
    })
  }

  render(){
    let semesters = this.state.semesters
    let status = this.state.status
    console.log("/admin/subject page started")
    console.log(status)
    if( status === 404 || status === 401 ){
      return <Redirect to='/error' />
    } else if(semesters=== null){
      return <div> 読み込み中 </div>
    }

    console.log(semesters)
    let content =  semesters.map((semester) =>{
      return <SemesterRow semester={semester} />
    })
    return(
      <div>
        <p>
          <TransitionButton title="新規作成" url='/admin/semester/new' />
        </p>
        <table className="table table--condensed">
          <thead className="table__head">
            {/*TO DO: sorting function.  */}
            <th> ID </th>
            <th> 学年 - 学期 </th>
            <th> 教科 </th>
          </thead>
          <tbody className="table__body">
            {content}
          </tbody>
        </table>
      </div>
    )
  }
}

export { SemesterBoard }
