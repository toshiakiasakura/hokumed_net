import React, { Component, useEffect, useState } from 'react'
import { Route, Switch, Link, Redirect} from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../../helpers/utils.component'
import { Class_Year } from '../../entity/study.entity'
import { TableRow, FetchValidation } from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus } from '../../helpers/types.helper'
import { DetailPageContainer, DetailFormContainer } from '../../helpers/admin-utils.component'
import { FormRow } from '../../helpers/form.component'

type ClassYearState = {
  years: Class_Year[] | null,
  status: number
}

const YearRow = (props:{year:Class_Year} ) => {
  return(
    <tr>
      <td> 
        {props.year.id} 
      </td>
      <td> 
        <Link to={`/admin/year/${props.year.id}`}>
          {props.year.year}期 
        </Link>
      </td>
      <td> 
        {props.year.year} 期のカリキュラム 
      </td>
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

type YearFormData = {year:number}

function YearFormBody(
    props:{errors:any, register:any, content: YearFormData}
  ){
  return(
    <FormRow 
      type="number"
      title="期"
      name="year"
      id="yearPageEditYear"
      placeholder={`${props.content.year}`}
      errors={props.errors} register={props.register}
      reg_json={{
        required:"入力必須項目です",
      }}
    />

  )
}

function ClassYearEdit(props:{content:Class_Year}){
  const { register, handleSubmit, errors, formState } =
                            useForm<YearFormData>({mode:'onBlur'})
  const content = props.content 
  const editSubmit = (data:YearFormData)=>{
    AdminService.editOneObject(`year/edit/${content.id}`, data)
  }
  return(
    <form 
      className="form row"
      role="form"
      name="yearForm"
      onSubmit={handleSubmit(editSubmit)}
    >
      <DetailFormContainer 
        title="編集"
        formState={formState}
        body={<YearFormBody 
                register={register} 
                errors={errors}
                content={props.content}
              />}
        
      />
    </form>
  )
}

function ClassYearNew(){
  const { register, handleSubmit, errors, formState } =
                            useForm<YearFormData>({mode:'onBlur'})
  const newSubmit = (data:YearFormData)=>{
    AdminService.editOneObject(`year/new`, data)
  }
  const content: YearFormData = {year:NaN}
  return(
    <form 
      className="form row"
      role="form"
      name="yearForm"
      onSubmit={handleSubmit(newSubmit)}
    >
      <DetailFormContainer 
        title="期の新規作成．"
        formState={formState}
        body={<YearFormBody 
                register={register} 
                errors={errors}
                content={content}
              />}
        
      />
    </form>
  )
}

function ClassYearDetail(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<
      OneClassStatus<Class_Year>
      >(
        {content:new Class_Year(), status:200}
       )

  useEffect(()=> {
    AdminService.getOneObject<Class_Year>(`year/${id}`)
    .then(res =>{
      // TO DO: delete comment part. 
      content = {id:1, year:1, created_at:'', updated_at:''}
      setState({
        // content: res.data.content,
        // status: res.data.status
        content: content,
        status:200
      })
    })
    .catch(err => console.log(err))
  },[setState])

  console.log("ClassYearDetail page started. ")
  let content = state.content
  return(
    <FetchValidation status={state.status}>
      {content === undefined || content.id === undefined 
      ? <div> 読み込み中 </div>
      : 
        <DetailPageContainer 
          title={`${content.year}期`}
          editForm={<ClassYearEdit content={content}/>}
          kind="year"
          id={props.match.params.id}
          >
            <table className='table table--bordered'>
              <tbody>
                <TableRow rowName='ID' item={content.id}/>
                <TableRow rowName='期' item={content.year}/>
                {/* TO DO: set link */}
                <TableRow rowName='カリキュラム' item={`${content.year}のカリキュラム`}/>
                <TableRow rowName='作成日' item={content.created_at}/>
                <TableRow rowName='更新日' item={content.updated_at}/>
              </tbody>
            </table>
        </DetailPageContainer>
      }
    </FetchValidation>
  )
}

function ClassYearPages(){
  return(
    <Switch>
      <Route exact path='/admin/year' component={ClassYearBoard} />
      <Route exact path='/admin/year/new' component={ClassYearNew} />
      <Route path='/admin/year/:id' component={ClassYearDetail} />
    </Switch>
  )
}
export { ClassYearPages }
