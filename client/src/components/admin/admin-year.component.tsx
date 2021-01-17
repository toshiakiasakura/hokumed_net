import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import { Class_Year } from '../../entity/study.entity'
import {
   TableRow, FetchValidation, BackButton, Loading,
   TransitionButton
} from '../../helpers/utils.component'
import { MatchIDType, State, Form } from '../../helpers/types.helper'
import { FormRow } from '../../helpers/form.component'
import { DetailPageContainer, DetailFormContainer } from './admin-utils.component'
import { FetchOneClassYear, FetchMultiClassYears } from '../../helpers/fetch_data'


const YearRow = (props:{year:Class_Year} ) => {
  return(
    <tr>
      <td> 
        {props.year.id} 
      </td>
      <td> 
        <Link to={`/admin/year/${props.year.id}`} id={`yearRows`}>
          {props.year.year}期 
        </Link>
      </td>
      <td> 
        {props.year.year} 期のカリキュラム 
      </td>
    </tr>
  )
}

function ClassYearBoard(props:State['Multi']['Class_Year']){
  const {state, setState} = FetchMultiClassYears()

  console.log("/admin/year page started")
 
  const makeContents = (contents:Class_Year[]) => {
    return contents.map( v=> <YearRow year={v} />)
  }

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading />
      : 
        <div>
          <p>！！注意！！学期を消すと，関連するユーザー情報，学期情報も削除されます．</p>
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


function YearFormBody(
    props:{errors:any, register:any, content: Form['Year']}
  ){
  return(
    <FormRow 
      type="number"
      title="期"
      name="year"
      id="yearPageEditYear"
      placeholder="期"
      errors={props.errors} register={props.register}
      reg_json={{
        required:"入力必須項目です",
      }}
    />

  )
}

/**
 * Component of Class Year edit page. 
 * Form of edit is compeleted with <form></form> and <YearFormBody> parts. 
 * <DetailFormContainer> is just a design purpose and irrevalent to react-hook-form. 
 * @param props 
 */
function ClassYearEdit(props:{content:Class_Year}){
  const { register, handleSubmit, errors, formState 
  } = useForm<Form['Year']>({
    mode:'onBlur',
    defaultValues: {year: props.content.year}
  })
  const content = props.content 
  const editSubmit = (data:Form['Year'])=>{
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
                            useForm<Form['Year']>({mode:'onBlur'})
  const history = useHistory()                        
  const newSubmit = (data:Form['Year'])=>{
    AdminService.editOneObject(`new/year`, data)
    .then( res => {
      alert('期を追加しました．')
      history.push(`/admin/year`)
    })

  }
  const content: Form['Year'] = {year:NaN}
  return(
    <div>
      <p>
        <BackButton title="一覧に戻る" url="/admin/year" /> 
      </p>
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
    </div>
  )
}

function ClassYearDetail(props:MatchIDType){
  const id = props.match.params.id
  const {state, setState} = FetchOneClassYear(id)

  console.log("ClassYearDetail page started. ")
  let content = state.content
  return(
    <FetchValidation status={state.status}>
      {content === undefined || content.id === undefined 
      ? <Loading />
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
