import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'

import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { UserService } from '../../services/user.service'
import { SemesterSubjects } from '../../entity/study.entity'
import { sortLearnYearTerm } from '../../helpers/sort.helper'
import arrow from '../../img/arrow.svg'
import { sortString } from '../../helpers/sort.helper'


function StudyToggleMenu(props:{semester: SemesterSubjects}){
  let subjects = props.semester.subjects
  subjects = sortString(subjects, 'title_ja', true)
  const subjectButtons = subjects.map((sub, index) =>{
    return(
      <li key={index} >
        <Link to={`/study/${sub.title_en}/exam`}> {sub.title_ja} </Link>
      </li>
    )
  })
  const term = props.semester.learn_term === 'pre' ? '前期' : '後期'
  const title= `${props.semester.learn_year}年-${term}`

  // toggle function part.
  const [disp, setDisp] = useState('none')
  const changeDisplay = () =>{ 
    setDisp(disp === 'block' ? 'none' : 'block')
  }
  let rotateStyle = {transform:`rotate(${disp === 'block' ? '0' : '-90'}deg)`}
  return(
      <div className="toggle-mennu">
        <div className="toggle-menu__toggler">
          <a href="javascript:;" onClick={() => changeDisplay()}>
            <img 
              src={arrow} width={24} height={24} 
              className="fa fa-lg fa-angle-right toggle-menu__toggler__icon"
              style={ rotateStyle }
            />
            {title}
          </a>
        </div>
        <div 
          className="toggle-menu__content toggle-menu__content--shown" 
          style={{display:disp}}
         >
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

  const makeSemesterToggles = () => {
    return sortLearnYearTerm(
      state.contents, true
    ).map(
    semSub => <StudyToggleMenu semester={semSub} />
    )
  }
  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading />
      : 
        <div className="col--sm-12 col--md-3 col--xs-10 col--no-gutter">
          <div className="col--xs-6 col--sm-12">
            {makeSemesterToggles()}
          </div>
        </div>
      }
    </FetchValidation>
  )
}