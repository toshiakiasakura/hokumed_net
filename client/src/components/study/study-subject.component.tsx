import React, { useEffect, useState } from 'react'
import { 
  Route, Switch, Link, Redirect, useHistory 
} from 'react-router-dom'
import Cookies from 'universal-cookie'

import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { UserService } from '../../services/user.service'
import { Doc_File, Subject } from '../../entity/study.entity'
import { sortLearnYearTerm } from '../../helpers/sort.helper'
import { NotFound } from '../404.component'
import arrow from '../../img/arrow.svg'
import { propTypes } from 'react-notification-system'


const TopNavItem = (props:{url:string, tabName:string} ) => {
  return(
    <div className="tab">
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

function FileControl(props:{children:any}){
  return(
    <div className="file-control">
      {props.children}
    </div>
  )
}

function FileRow(props:{file: Doc_File, subject:Subject}){
  let file = props.file
  let subject = props.subject
  let cookie = new Cookies()
  let userID = cookie.get('userID')

  return(
    <td>
      <div className="file-row">
        <div className="file-caption">
          {file.file_name}
        </div>
        <div className="file-left-controls">
          <div className="file-controls">
            <FileControl>
              <a>
                <i className="fa fa-floppy-o">
                </i>
                <span>ダウンロード</span>
              </a>
            </FileControl>
            <FileControl>
              <a>
                <i className="fa fa-ey">
                </i>
                <span className="hidden-xs"> プレビュー</span>
              </a>
            </FileControl>
            {userID === file.user_id &&
              <FileControl>
                <a>
                  <i className="fa fa-cog">
                  </i>
                  <span>編集</span>
                </a>
              </FileControl>
            }
          
          </div>
        </div>
        <div className="file-right-controls">
          <FileControl>
            <span className="text-gray">
              {file.download_count}回
            </span>
          </FileControl>
          <FileControl>
            <span className="text-gray">
              {file.user.handle_name}
            </span>
          </FileControl>

        </div>
      </div>
    </td>
  )

}

function StudySubjectBody(
  props:{files: Doc_File[], kind:string, subject:Subject}
){
  let files = props.files
  let kind = props.kind
  const show1 = kind !== 'personal'
  const show2 = kind !== 'personal' && kind !== 'summary'

  const makeContents = (files: Doc_File[]) => {
    // TO DO : change the way in the end.
      return files.map(file => {
        return(
          <tr>
            <td className="text-center"> {file.class_year}期 </td>
            {show1 && 
              <td className="text-center"> 
                {file.file_code.no_doc} 
              </td>}
            {show2 && 
              <td className="text-center"> 
                {file.file_code.type} 
              </td>} 
            <FileRow file={file} subject={props.subject} />
          </tr>
        )
      }) 
    }
  return(
    <table className="table table--condensed table--bordered">
      <tr>
        <th> 期 </th>
        {show1 && <th> 回 </th>}
        {show2 && <th> 種別 </th> }
        <th> ファイル </th>
      </tr>
      { makeContents(files) }

    </table>
  )
}


type MatchStudyType = {match:{ 
  params:{title:string, kind:string} 
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
  let title_en = props.match.params.title
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

  useEffect(()=> {
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

function StudySubjectPages(){
  return(
    <Switch>
      <Route 
        path='/study/:title/:kind' 
        component={(props:MatchStudyType) => 
        <StudySubjectBoard match={props.match}/>} 
       />
    </Switch>
  )
}
export { StudySubjectPages }