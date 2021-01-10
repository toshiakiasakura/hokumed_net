import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import { SemesterSubjects, Subject, SemesterSubjectsDetail } from '../../entity/study.entity'
import { 
  TableRow, FetchValidation, BackButton, 
  TransitionButton, Loading
} from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus, State } from '../../helpers/types.helper'
import { DetailPageContainer, DetailFormContainer } from './admin-utils.component'
import { 
  FormRow, ClassYearBlock, FormGroupContainer, LearnYearBlock, TermBlock
} from '../../helpers/form.component'
import { SemesterFilter } from './admin-filter.component'


const SemesterRow = (props:{semester:SemesterSubjects} ) => {
  const semester = props.semester
  const term = semester.learn_term === 'pre' ? '前期' : '後期'
  const title = `${semester.class_year}期\n${semester.learn_year}年${term}`
  let subjects_str = semester.subjects.map(
    sub => sub ? sub.title_ja : ''
    ).join(',  ')

  return(
    <tr>
      <td> {props.semester.id} </td>
      <td> 
        <Link to={`/admin/semester/${props.semester.id}`} >
          {title} 
        </Link>
      </td>
      <td> {subjects_str} </td>
    </tr>
  )
}

function SemesterBoard(props:State['Multi']['SemesterSubjects']){
  const [state, setState] = useState< 
    State['Admin']['SemesterSubjects'] >({
      contents:[], status:200, msg:'', filtered:[],
      fil_year:NaN, fil_learn_year:NaN, fil_learn_term:'',
      fil_subject:''
      })

  useEffect(()=> {
    AdminService.getMultipleObjects<SemesterSubjects>('semester', setState)
    .then( _ => {
      setState((prev:any) => ({...prev, filtered:prev.contents}))
    })
  },[setState])

  console.log("/admin/semester page started")
 
  const makeContents = (contents:SemesterSubjects[]) => {
    return contents.map( v=> <SemesterRow semester={v} />)
  }

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading/>
      : 
        <div>
          <p>
            <TransitionButton title="新規作成" url='/admin/semester/new' />
          </p>
          <SemesterFilter 
            state={state} 
            setState={setState}
          />
          <table className="table table--condensed">
            <thead className="table__head">
              {/*TO DO: sorting function.  */}
              <th> ID </th>
              <th> 学年 - 学期 </th>
              <th> 教科 </th>
            </thead>
            <tbody className="table__body">
              { makeContents(state.filtered) }
            </tbody>
          </table>
        </div>
      }
    </FetchValidation>
  )
}

type SemesterFormData = {
  item: {
    class_year: number
    learn_year: number
    learn_term: 'pre' | 'post'
  }
  subjects: Subject[]
  checkboxes: boolean[]
}

function CheckBoxBlock(
    props:{errors:any, register:any, content: SemesterFormData}
  ){

    const createCheckboxes = (content:SemesterFormData) => {
      let subjects = props.content.subjects
      let checkboxes = props.content.checkboxes
      let comp = []
      for( let i=0; i < subjects.length; i++){
        comp.push(
          <div className="col--sm-6 col--md-4 col--lg-3 no-gutter">
            <input
              className="form__control"
              type="checkbox"
              id={subjects[i].title_en}
              name={`checkboxes[${i}]`}
              ref={props.register}
            />
            <label htmlFor={`checkboxes[${i}]`}  className="form__label">
            {subjects[i].title_ja}  <br/>
            {subjects[i].title_en} 
            </label>
          </div>
        )
      }
      return comp
    }

  return(
    <FormGroupContainer title="教科">
      { createCheckboxes(props.content) }
    </FormGroupContainer>
  )
}

function SemesterFormBody(
    props:{errors:any, register:any, content: SemesterFormData}
  ){
  return(
    <div>
      <ClassYearBlock register={props.register} name='item.class_year'/>
      <LearnYearBlock 
        register={props.register} 
        errors={props.errors}
        name="item.learn_year"
      />
      <TermBlock 
        register={props.register} 
        errors={props.errors}
        name="item.learn_term"
      />
      <CheckBoxBlock 
        register={props.register} 
        errors={props.errors}
        content={props.content}
      />
    </div>
  )
}

function SemesterEdit(props:{content:SemesterSubjectsDetail}){
  let content = props.content

  const { register, handleSubmit, errors, formState 
  } = useForm<SemesterFormData>({
    mode:'onChange',
    defaultValues:{
      item :{
        class_year: content.item.class_year,
        learn_year: content.item.learn_year,
        learn_term: content.item.learn_term
      },
      subjects: content.subjects,
      checkboxes: content.checkboxes
    }
  })
  const editSubmit = (data:SemesterFormData)=>{
    data.subjects = content.subjects
    console.log('Edit submit process started. ', data)
    AdminService.editOneObject(`edit/semester/${content.item.id}`, data)
    .then( _ =>{
      console.log('Edit semester_subject succeeded.')
      window.location.reload()
    })
    .catch( err => console.log(err))
  }
  return(
    <div>
      <form 
        className="form row"
        role="form"
        name="semesterForm"
        onSubmit={handleSubmit(editSubmit)}
      >
        <DetailFormContainer 
          title="編集"
          formState={formState}
          body={<SemesterFormBody
                  register={register} 
                  errors={errors}
                  content={content}
                />}
        />
      </form>
    </div>
  )
}

function SemesterNew(){
  const [state, setState] = useState<
      State['Multi']['Subject']
      >( {contents: [], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Subject>(`subject`, setState)
    .catch(err => console.log(err))
  },[setState])

  const content_default: SemesterFormData = {
    item:{
      class_year:NaN, 
      learn_year:NaN, 
      learn_term: 'pre'
    },
    subjects: state.contents,
    checkboxes:[]
  }

  const { register, handleSubmit, errors, formState } =
                            useForm<SemesterFormData>({mode:'onBlur'})
  const history = useHistory()                         
  const newSubmit = (data:SemesterFormData)=>{
    data.subjects = state.contents
    console.log("new process in semester", data)
    AdminService.editOneObject(`new/semester`, data)
    .then( res => {
      alert('学期と科目の組を追加しました．')
      history.push(`/admin/semester`)
    })
  }

  return(
    <div>
      <p>
        <BackButton title="一覧に戻る" url="/admin/semester" /> 
      </p>
      <form 
        className="form row"
        role="form"
        name="semesterForm"
        onSubmit={handleSubmit(newSubmit)}
      >
        <DetailFormContainer 
          title="科目の新規作成．"
          formState={formState}
          body={<SemesterFormBody 
                  register={register} 
                  errors={errors}
                  content={content_default}
                />}
          
        />
      </form>
    </div>
  )
}

function SemesterDetail(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<
      OneClassStatus<SemesterSubjectsDetail>
      >( {content:new SemesterSubjectsDetail(), status:200, msg:''})

  useEffect(()=> {
    AdminService.getOneObject<SemesterSubjectsDetail>(`semester/${id}`, setState)
    },[setState])

  const makeTitle = (content:SemesterSubjects) => {
    const jp_term = content.learn_term === 'pre' ? '前期' : '後期'
    const title = `${content.class_year}期 - ${content.learn_year}年 ${jp_term}`
    return (title)
    }

  const wrapUpSubjects = (content:SemesterSubjects) => {
    const subjects = content.subjects.map(sub =>{
      if(sub && sub.title_ja){
        return (
          <span>
           ・  
            <Link to={`/admin/subject/${sub.id}`} >
              {`${sub.title_ja} `} <br />
            </Link>
          </span>        
        )
      }
      })
    // return for wrapUpSubjects.
    return(
      <tr>
        <th>　教科 </th>
        <td> {subjects} </td>
      </tr>
      )
    }

  console.log("SemesterDetail page started. ")
  let semester = state.content ? state.content.item : undefined
  console.log(state.content)
  return(
    <FetchValidation status={state.status}>
      {semester === undefined || semester.id === undefined 
      ? <Loading/>
      : 
        <DetailPageContainer 
          title={ makeTitle(semester)}
          editForm={<SemesterEdit content={state.content}/>}
          kind="semester"
          id={props.match.params.id}
        >
            <table className='table table--bordered'>
              <tbody>
                <TableRow rowName='ID' item={semester.id}/>
                <TableRow rowName='在学期' item={semester.class_year}/>
                {/* TO DO: set link */}
                <TableRow rowName='学習年' item={`${semester.learn_year}`}/>
                <TableRow rowName='学習期' item={`${semester.learn_term === 'pre' ? '前期': '後期'}`}/>
                { wrapUpSubjects( semester ) }
                <TableRow rowName='作成日' item={semester.created_at}/>
                <TableRow rowName='更新日' item={semester.updated_at}/>
              </tbody>
            </table>
        </DetailPageContainer>
      }
    </FetchValidation>
  )
}

function SemesterPages(){
  return(
    <Switch>
      <Route exact path='/admin/semester' component={ SemesterBoard } />
      <Route exact path='/admin/semester/new' component={ SemesterNew } />
      <Route path='/admin/semester/:id' component={ SemesterDetail } />
    </Switch>
  )
}

export { SemesterPages }
