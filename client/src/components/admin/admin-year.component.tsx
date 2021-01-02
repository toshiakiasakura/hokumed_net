import React, { useEffect, useState } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../../helpers/utils.component'
import { Class_Year } from '../../entity/study.entity'
import { TableRow, FetchValidation } from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { DetailPageContainer, DetailFormContainer } from '../../helpers/admin-utils.component'
import { FormRow } from '../../helpers/form.component'


type ClassYearsState = MultiClassStatus<Class_Year>

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

function ClassYearBoard(props:ClassYearsState){
  const [state, setState] = useState<
      ClassYearsState
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Class_Year>('year')
    .then( res => {
      console.log(res)
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

  console.log("/admin/year page started")
 
  const makeContents = (contents:Class_Year[]) => {
    let contents_comp =  contents.map(v=>
        <YearRow year={v} />
    )
    return(contents_comp)
  }

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <div> 読み込み中 </div>
      : 
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
              {makeContents(contents)}
            </tbody>
          </table>
        </div>
      }
    </FetchValidation>
  )
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
    AdminService.editOneObject(`edit/year/${content.id}`, data)
    .then(res=>{
      window.location.reload()
    })
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
    AdminService.editOneObject(`new/year`, data)
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
        {content:new Class_Year(), status:200, msg:''}
       )

  useEffect(()=> {
    AdminService.getOneObject<Class_Year>(`year/${id}`)
    .then(res =>{
      console.log(res.data)
      setState({
        content: res.data.content,
        status: res.data.status,
        msg: res.data.msg
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
