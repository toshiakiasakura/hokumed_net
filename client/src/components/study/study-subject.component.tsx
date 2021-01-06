import React, { useEffect, useState } from 'react'
import { 
  Route, Switch, Link, Redirect, useHistory 
} from 'react-router-dom'

import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { UserService } from '../../services/user.service'
import { Doc_File, Subject, Class_Year } from '../../entity/study.entity'
import { StudySubjectBody } from './study-body.component'
import { StudyNew } from './study-new.component'

const TopNavItem = (props:{url:string, tabName:string} ) => {
  let last = props.url.split('/')
  let l1 = last[last.length -1]
  let cur_last = window.location.href.split('/')
  let l2 = cur_last[cur_last.length -1]
  let l3 = cur_last[cur_last.length -2 ] // for new and edit page.
  let active_boolean = l1 === l2 || l1 === l3 
  const tabActive = active_boolean ?  "tab--active" : ""
  return(
    <div className={`tab ${tabActive}`}>
        <Link to={`/study/${props.url}`}> {props.tabName} </Link>
    </div>
  )
}

function StudyNavVar(props:{title_en:string}){
  return(
    <div className="tabs">
      <TopNavItem url={`${props.title_en}/exam`} tabName="過去問" />
      <TopNavItem url={`${props.title_en}/quiz`} tabName="小テスト"/>
      <TopNavItem url={`${props.title_en}/summary`} tabName="講義資料" />
      <TopNavItem url={`${props.title_en}/personal`} tabName="個人作成資料"/>
    </div>
  )
}



type MatchStudyType = {match:{ 
  params:{title_en:string, kind:string} 
}}

export type FilesSubjectStatus = {
  contents: {
    items: Doc_File[], 
    subject: Subject,
    class_years: Class_Year[]
  },
  status:number,
  msg: string,
  new: boolean
}

/**
 * This function is processing shared components of 
 * study pages. For example, view list, edit and new pages 
 * for documents. 
 * Especially, navigation bar is same for these 3 pages.
 */
export function StudySubjectBoard( props:MatchStudyType){
  const history = useHistory()
  let title_en = props.match.params.title_en
  let kind = props.match.params.kind
  const PageArray = 'exam quiz summary personal'.split(' ') 
  if(!PageArray.includes(kind)){
    history.push('/error')
  }

  const [state, setState] = useState<
      FilesSubjectStatus 
      >({
        contents:{
          items:[], 
          subject: new Subject(),
          class_years:[]
        }, 
        status:200, 
        msg:'',
        new: false
     })

  /** 
   * Note: The second argument becomes title_en and kind.
   * This is because, react routing does not re-render 
   * when changing within the Route (this case, /study/:title/:kind).
   * Therefore, to forcely re-render, these two variables are chosen.
   */
  useEffect(()=> {
    window.scrollTo(0,0)
    UserService.getFileBoard(
      `file/${title_en}/${kind}`
      )
    .then( res => {
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg,
        new: false
      })
    })
  },[title_en, kind])

  let files = state.contents.items
  let subject = state.contents.subject

  return(
    <FetchValidation status={state.status}>
      {subject === undefined  || subject.id === undefined
        ? <Loading/>
        : 
          <div>
            <h1 className="caption"> {subject.title_ja}</h1>
            <div>
              <StudyNavVar title_en={title_en} />
            </div>
            <Switch>
              <Route 
                path='/study/:title_en/:kind/new' 
                component={ () =>
                <StudyNew
                  files={files} kind={kind} 
                  title_en={title_en} subject={subject} 
                  years={state.contents.class_years}
                />} 
              />
              <Route 
                path='/study/:title_en/:kind' 
                component={ () =>
                <StudySubjectBody 
                  files={files}  subject={subject} 
                  title_en={title_en} kind={kind} 
                />} 
              />
            </Switch>
          </div>
      }
    </FetchValidation>
  )
}
