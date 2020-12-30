import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../utils.component'
import { Class_Year } from '../../entity/study.entity'

type ClassYearState = {
  years: Class_Year[] | null,
  status: number
}

const YearRow = (props:{year:Class_Year} ) => {
  return(
    <tr>
      <td> {props.year.id} </td>
      <td> {props.year.year} </td>
      <td> {props.year.year}期のカリキュラム </td>
    </tr>
  )
}


class ClassYearBoard extends Component<{},ClassYearState>{
  constructor(props:any){
    super(props)
    this.state= {
      years: null,
      status: 200,
    }
  }

  componentDidMount(){
    AdminService.getClassYearBoard()
    .then( res => {
      this.setState({
        years: res.data.years,
        status: res.data.status
      })
    })
  }

  render(){
    let years = this.state.years
    let status = this.state.status
    console.log("/admin/subject page started")
    console.log(status)
    if( status === 404 || status === 401 ){
      return <Redirect to='/error' />
    } else if(years=== null){
      return <div> 読み込み中 </div>
    }

    let content =  years.map(year =>
        <YearRow year={year} />
    )

    return(
      <div>
        <p>
          <TransitionButton title="新規作成" url='/admin/year/new' />
        </p>
        <table className="table table--condensed">
          <thead className="table__head">
            {/*TO DO: sorting function.  */}
            <th> ID </th>
            <th> 期 </th>
            <th> カリキュラム </th>
          </thead>
          <tbody className="table__body">
            {content}
          </tbody>
        </table>
      </div>
    )
  }
}

export { ClassYearBoard }
