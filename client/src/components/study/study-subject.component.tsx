import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'

import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { UserService } from '../../services/user.service'
import { SemesterSubjects } from '../../entity/study.entity'
import { sortLearnYearTerm } from '../../helpers/sort.helper'
import { NotFound } from '../404.component'
import arrow from '../../img/arrow.svg'


type FileStatus= MultiClassStatus<File>
type MatchStudyType = { params:{title:string, kind:string} }

function StudySubjectBoard(
  props:{
    match: MatchStudyType,
    contents: File[]
  }
){
  return(
    <div>テスト</div>
  )
}

/**
 * Since exam, quiz, summary, personal have similar dataset,
 * first get all the information and enable user to quickly 
 * change the tab. 
 * This function is only for obtaining data. 
 */
function GetSubjectBoard(
  props:{ match: {params:{title:string}}, }
){
  console.log('study subject pagegs process started.')

  const [state, setState] = useState<
      FileStatus 
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    UserService.getMultipleObjects<File>('file')
    .then( res => {
      console.log(res)
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
        ? <Loading/>
        : 
          <Route 
            path='/study/:title/:kind'
            component={
              (props:{match:MatchStudyType}) => 
              <StudySubjectBoard 
                match={props.match} 
                contents={contents}
              />
            }
          />
      }
    </FetchValidation>
  )
}

function StudySubjectPages(){
  return(
    <Route path='/study/:title' component={ GetSubjectBoard } />
  )
}
export { StudySubjectPages }