import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../../helpers/utils.component'
import { Subject } from '../../entity/study.entity'

type StudyState = {
  subjects: Subject[] | null,
  status: number
}

const SubjectRow = (props:{subject:Subject}) => {
  return(
    <tr>
      {/* TO DO: add link to the part.*/}
      <td> {props.subject.id} </td>
      <td> {props.subject.title_ja} </td>
      <td> {props.subject.title_en} </td>
      <td> {props.subject.title_ja}の開講期  </td>
    </tr>
  )
}


class SubjectBoard extends Component<{},StudyState>{
  constructor(props:any){
    super(props)
    this.state= {
      subjects: null,
      status: 200,
    }
  }

  componentDidMount(){
    AdminService.getSubjectBoard()
    .then( res => {
      this.setState({
        subjects: res.data.subjects,
        status: res.data.status
      })
    })
  }

  render(){
    let subjects = this.state.subjects
    let status = this.state.status
    console.log("/admin/subject page started")
    console.log(status)
    if( status === 404 || status === 401 ){
      return <Redirect to='/error' />
    } else if(subjects === null){
      return <div> 読み込み中 </div>
    }

    let content =  subjects.map(sub=>
        <SubjectRow subject={sub} />
    )
    return(
      <div>
        <p>
          <TransitionButton title="新規作成" url='/admin/subject/new' />
        </p>
        <table className="table table--condensed">
          <thead className="table__head">
            {/*TO DO: sorting function.  */}
            <th> ID </th>
            <th> 名前 </th>
            <th> 名前(英語) </th>
            <th> 開講期 </th>
          </thead>
          <tbody className="table__body">
            {content}
          </tbody>
        </table>
      </div>
    )
  }

}

export { SubjectBoard }
