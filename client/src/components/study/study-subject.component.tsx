import React, { useEffect, useState } from 'react'
import { 
  Route, Switch, Link, Redirect, useHistory 
} from 'react-router-dom'

import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { UserService } from '../../services/user.service'
import { Doc_File, Subject } from '../../entity/study.entity'
import { StudySubjectBody } from './study-body.component'


const TopNavItem = (props:{url:string, tabName:string} ) => {
  let last = props.url.split('/')
  let l1 = last[last.length -1]
  let cur_last = window.location.href.split('/')
  let l2 = cur_last[cur_last.length -1]
  const tabActive = l1 === l2 ? "tab--active" : ""
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
    subject: Subject
  },
  status:number,
  msg: string
}

function StudySubjectBoard( props:MatchStudyType){
  console.log('study subject pagegs process started.')
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
        contents:{items:[], subject: new Subject()}, 
        status:200, 
        msg:''
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
        msg: res.data.msg
      })
    })
  },[title_en, kind])

  let files = state.contents.items
  let subject = state.contents.subject
  console.log('StudySubjectBoard contents.',files)
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
            <p>
              <TransitionButton title='新規アップロード' url={`/study/${title_en}/new`}/>
            </p>
            { files.length !== 0 
            ? <StudySubjectBody 
                files={files} kind={kind} subject={subject}
               />
            : '資料がまだ投稿されていません．'
            }
          </div>
      }
    </FetchValidation>
  )
}

function Prepare(){
  return(
    <h1>準備中</h1>
  )
}

function StudySubjectPages(){
  return(
    <Switch>
      <Route path='/study/:title_en/new' component={ Prepare}/>
      <Route 
        path='/study/:title_en/:kind' 
        component={ StudySubjectBoard } 
       />
    </Switch>
  )
}
export { StudySubjectPages }