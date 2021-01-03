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

function StudyToggleMenu(props:{semester: SemesterSubjects}){
  const subjects = props.semester.subjects
  const subjectButtons = subjects.map((sub, index) =>{
    return(
      <li key={index} >
        <Link to={`/study/${sub.title_en}/exam`}> {sub.title_ja} </Link>
      </li>
    )
  })
  const term = props.semester.learn_term === 'pre' ? '前期' : '後期'
  const title= `${props.semester.learn_year}年-${term}`
  return(
      <div className="toggle-mennu">
        <div className="toggle-menu__toggler">
          <img src={arrow} width={24} height={24} />
          {title}

        </div>
        <div className="toggle-menu__content toggle-menu__content--shown">
          <ul className="">{subjectButtons} </ul>
        </div>
      </div>
  )
}

type SemestersStatus= MultiClassStatus<SemesterSubjects>

export function StudyToggleMenus(){
  console.log('study toggle menu process started.')

  const [state, setState] = useState<
      SemestersStatus
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    UserService.getMultipleObjects<SemesterSubjects>('semester')
    .then( res => {
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

  const semesterToggles = sortLearnYearTerm(
      state.contents, true
    ).map(
    semSub => <StudyToggleMenu semester={semSub} />
    )
  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading />
      : 
        <div className="col--sm-12 col--md-3 col--xs-10 col--no-gutter">
          <div className="col--xs-6 col--sm-12">
            {semesterToggles}
          </div>
        </div>
      }
    </FetchValidation>
  )
}