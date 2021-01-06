import { useEffect, useState } from 'react' 
import { 
  Route, Switch, Link, Redirect, useHistory
} from 'react-router-dom'

import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { UserService } from '../../services/user.service'
import { Doc_File, Subject, Class_Year } from '../../entity/study.entity'
import { FilesSubjectStatus } from '../../helpers/types.helper' 

import { StudySubjectBody } from './study-body.component'
import { FileDelete } from './study-delete.component' 
import { StudyNavVar  } from "./study-top-nav.component";
import { StudyToggleMenus } from './study-toggle.component'
import { StudyTop } from './study-top-nav.component'
import { StudyNew } from './study-new.component'


type MatchStudyType = {match:{ 
  params:{title_en:string, kind:string} 
}}


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
                path='/study/:title_en/:kind/delete/:id'
                component={ (props:{match:{params:{id:string}}}) => 
                  <FileDelete 
                  files={files} kind={kind}
                  title_en={title_en} id={props.match.params.id}
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

function Study(){
  return(
    <div className="topfix container v-spacer row">
      <StudyToggleMenus /> 
      <div className="col--sm-12 col--md-9 col--xs-12 pull-right">
        <Switch>
          <Route exact path='/study' component={StudyTop} />
          <Route 
            path='/study/:title_en/:kind/:any' 
            component={ StudySubjectBoard } 
          />
          <Route 
            path='/study/:title_en/:kind' 
            component={ StudySubjectBoard } 
          />
        </Switch>
      </div>
    </div>
  )
}
export { Study }
