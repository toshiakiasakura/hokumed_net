import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import { Subject } from '../../entity/study.entity'
import { 
  TableRow, FetchValidation, BackButton, 
  TransitionButton, Loading
} from '../../helpers/utils.component'
import { MatchIDType, State} from '../../helpers/types.helper'
import { DetailPageContainer, DetailFormContainer } from './admin-utils.component'
import { FormRow } from '../../helpers/form.component'
import { SubjectFilter } from './admin-filter.component'


const SubjectRow = (props:{subject:Subject}) => {
  return(
    <tr>
      {/* TO DO: add link to the part.*/}
      <td> {props.subject.id} </td>
      <td> 
        <Link to={`/admin/subject/${props.subject.id}`} >
          {props.subject.title_ja}
        </Link> 
      </td>
      <td> {props.subject.title_en} </td>
      <td> {props.subject.title_ja}の開講期  </td>
    </tr>
  )
}

function SubjectBoard(props:State['Multi']['Subject']){
  const [state, setState] = useState<
      State['Admin']['Subject']     
      >( {contents:[], status:200, msg:'', filtered:[], fil_name:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Subject>('subject', setState)
    .then( _ => {
      setState((prev:any) => ({ ...prev, filtered:prev.contents }))
    })
  },[setState])

  console.log("/admin/subject page started")
 
  const makeContents = (contents:Subject[]) => {
    return contents.map( v=> <SubjectRow subject={v} />)
  }

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading/>
      : 
        <div>
          <p>
            <TransitionButton title="新規作成" url='/admin/subject/new' />
          </p>
          <SubjectFilter 
            state={state}
            setState={setState}
          />
          <table className="table table--condensed">
            <thead className="table__head">
              {/*TO DO: sorting function.  */}
              <th> ID </th>
              <th> 名前 </th>
              <th> 名前(英語) </th>
              <th> 開講期 </th>
            </thead>
            <tbody className="table__body">
                {makeContents(state.filtered)}
            </tbody>
          </table>
        </div>
      }
    </FetchValidation>
  )
}

type SubjectFormData = {title_ja:string, title_en: string}

function SubjectFormBody(
    props:{errors:any, register:any, content: SubjectFormData}
  ){
  return(
    <a>
      <FormRow 
        title="日本語タイトル"
        name="title_ja"
        id="subjectPageEditTitle_ja"
        placeholder="日本語タイトル"
        errors={props.errors} register={props.register}
        reg_json={{
          required:"入力必須項目です",
        }}
      />
      <FormRow 
        title="英語タイトル"
        name="title_en"
        id="subjectPageEditTitle_en"
        placeholder="英語タイトル"
        errors={props.errors} register={props.register}
        reg_json={{
          required:"入力必須項目です",
        }}
      />
    </a>
  )
}

function SubjectEdit(props:{content:Subject}){
  const { register, handleSubmit, errors, formState 
  } = useForm<SubjectFormData>({
    mode:'onBlur',
    defaultValues: {
      title_ja: props.content.title_ja,
      title_en: props.content.title_en
    }
  })
  const content = props.content 
  const editSubmit = (data:SubjectFormData)=>{
    AdminService.editOneObject(`edit/subject/${content.id}`, data)
    .then(res=>{
      if(res.data.status === 200){
        window.location.reload()
      } else {
        alert(res.data.msg)
      }
    })
  }
  return(
    <div>
      <form 
        className="form row"
        role="form"
        name="subjectForm"
        onSubmit={handleSubmit(editSubmit)}
      >
        <DetailFormContainer 
          title="編集"
          formState={formState}
          body={<SubjectFormBody
                  register={register} 
                  errors={errors}
                  content={props.content}
                />}
        />
      </form>
    </div>
  )
}

function SubjectNew(){
  const { register, handleSubmit, errors, formState } =
                            useForm<SubjectFormData>({mode:'onBlur'})
  const history = useHistory()                         
  const newSubmit = (data:SubjectFormData)=>{
    AdminService.editOneObject(`new/subject`, data)
    .then( res => {
      alert('科目を追加しました．')
      history.push(`/admin/subject`)
    })
  }
  const content: SubjectFormData = {title_en:'', title_ja:''}
  return(
    <div>
      <p>
        <BackButton title="一覧に戻る" url="/admin/subject" /> 
      </p>
      <form 
        className="form row"
        role="form"
        name="subjectForm"
        onSubmit={handleSubmit(newSubmit)}
      >
        <DetailFormContainer 
          title="科目の新規作成．"
          formState={formState}
          body={<SubjectFormBody 
                  register={register} 
                  errors={errors}
                  content={content}
                />}
          
        />
      </form>
    </div>
  )
}

function SubjectDetail(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<
      State['One']['Subject']
      >(
        {content:new Subject(), status:200, msg:''}
       )

  useEffect(()=> {
    AdminService.getOneObject<Subject>(`subject/${id}`, setState)
  },[setState])

  console.log("SubjectDetail page started. ")
  let content = state.content
  return(
    <FetchValidation status={state.status}>
      {content === undefined || content.id === undefined 
      ? <Loading />
      : 
        <DetailPageContainer 
          title={`${content.title_ja}`}
          editForm={<SubjectEdit content={content}/>}
          kind="subject"
          id={props.match.params.id}
          >
            <table className='table table--bordered'>
              <tbody>
                <TableRow rowName='ID' item={content.id}/>
                <TableRow rowName='日本語タイトル' item={content.title_ja}/>
                {/* TO DO: set link */}
                <TableRow rowName='英語タイトル' item={`${content.title_en}`}/>
                <TableRow rowName='作成日' item={content.created_at}/>
                <TableRow rowName='更新日' item={content.updated_at}/>
              </tbody>
            </table>
        </DetailPageContainer>
      }
    </FetchValidation>
  )
}

function SubjectPages(){
  return(
    <Switch>
      <Route exact path='/admin/subject' component={SubjectBoard} />
      <Route exact path='/admin/subject/new' component={SubjectNew} />
      <Route path='/admin/subject/:id' component={SubjectDetail} />
    </Switch>
  )
}
export { SubjectPages }
