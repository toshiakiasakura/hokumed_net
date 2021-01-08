import { useState, useEffect} from 'react'

import { Class_Year } from '../../entity/study.entity'
import { AdminService } from '../../services/admin.service'
import {
   TableRow, FetchValidation, BackButton, Loading
} from '../../helpers/utils.component'
import { State } from '../../helpers/types.helper'


/**
 * FilterContainer, FilterRow, FilterItem is 
 * objects to construct filter function.
 * Usage is :
 * <FilterContainer>
 *  <FilterRow>
 *    <FilterItem>
 *    </FilterItem>
 *    * n1
 *  </FilterRow>
 *  *n2
 * <FilterContainer>
 */
function FilterContainer(props:{children:any}){
  return(
    <table className="table table--bordered table--condensed">
      {props.children}
    </table>
  )
}

function FilterRow(props:{title:string, children:any}){
  return(
    <tr>
      <th className="text-small"> {props.title} </th>
      <td>
        <ul className="tips tips--nomargin">
        {props.children}
        </ul>
      </td>
    </tr>
  )
}

/**
 * One filter item. 
 * @param cond active condition. 
 * @param func event function.
 */
function FilterItem(props:{
  cond:boolean, item:string,
  func:() => void
}){
  return(
    <li className={`tip ${props.cond && "tip--active"}`}>
      <a
        href="javascript:;" 
        onClick={props.func}
      >
        {props.item}
      </a>
    </li>
  )
}

export function UserFilter(
  props:{ state:State['Admin']['User'], setState:any }
){
  let state= props.state

  // Fetch class_year information.
  const [yearState, setYearState] = 
    useState<State['Multi']['Class_Year']>({contents:[], status:200, msg:''})
  let years = yearState.contents
  useEffect(()=> {
    AdminService.getMultipleObjects<Class_Year>('year', setYearState )
    },[setYearState])

  /**
   * Filtering function.  
   */
  const filtering = (v:string, kind:string) => {
    let newState = Object.assign({},state)
    if(kind === 'state') newState.fil_state = v
    if(kind === 'year') newState.fil_year = parseInt(v)
    if(kind === 'name') newState.fil_name = v
    if(kind === 'mail') newState.fil_mail = v

    newState.filtered = newState.contents.filter( user => {
      let b1 = true
      if(newState.fil_state==='admin') b1 = user.admin 
      else if(newState.fil_state==='active') b1 = user.activation_status !== 'active'
      else if(newState.fil_state==='approval'){
        b1 = user.activation_status === 'active'
          ? user.approval_state === 'waiting'
          : false 
      } 
      
      let b2 = isNaN(newState.fil_year) 
        ? true
        : user.class_year === newState.fil_year 
      let b3 = [
        user.family_name,user.given_name,user.handle_name
        ].join(' ').includes(newState.fil_name)
      
      let b4 = user.email
        .split("@")[0]
        .includes(newState.fil_mail)
      return b1 && b2 && b3 && b4
      })

    props.setState((prev:any) => ({...newState}))
    }

  return(
    <FetchValidation status={yearState.status}>
      {years === undefined || years.length === 0
      ? <div></div>
      : 
        <FilterContainer>
          <FilterRow title="状態">
            <FilterItem
              cond = {state.fil_state=== ''}
              item="すべて"
              func= {()=>filtering('', 'state')}
            />
            <FilterItem
              cond = {state.fil_state === 'admin'}
              item="管理者"
              func= {()=>filtering('admin', 'state')}
            />
            <FilterItem
              cond = {state.fil_state === 'active'}
              item="メール承認待ち"
              func= {()=>filtering('active', 'state')}
            />
            <FilterItem
              cond = {state.fil_state === 'approval'}
              item="管理人承認待ち"
              func= {()=>filtering('approval', 'state')}
            />
          </FilterRow>
          <FilterRow title="学年">
            <FilterItem
              cond = {isNaN(state.fil_year)}
              item="すべて"
              func= {()=>filtering('', 'year')}
            />
            { years.map(year => 
              <FilterItem
                cond = {state.fil_year === year.year}
                item={`${year.year}期`}
                func= {()=>filtering(String(year.year), 'year')}
              />
            )}
          </FilterRow>
          <FilterRow title="ハンドルネーム/氏名">
            <li>
              <input
                type="text"
                className="search"
                placeholder="ハンドルネーム/氏名"
                onChange={v => filtering(v.target.value,'name')}
              />
            </li>
          </FilterRow>
          <FilterRow title="メールアドレス">
            <li>
              <input
                type="text"
                className="search"
                placeholder="@以下は検索対象に入りません．"
                onChange={v => filtering(v.target.value,'mail')}
              />
            </li>
          </FilterRow>
        </FilterContainer>
      }
    </FetchValidation>
  )
}

export function SubjectFilter(
  props:{state:State['Admin']['Subject'], setState:any}
){
  let state = props.state
  const filtering = (v:string) => {
    let newState = Object.assign({},state)
    newState.filtered = newState.contents.filter( subject=> {
      let b1 = [subject.title_en,subject.title_ja]
        .join(' ')
        .includes(v)
      return b1
      })
    props.setState((prev:any) => ({...newState}))
    }
    
  return(
    <table className="table table--bordered table--condensed">
      <FilterRow title="日本語/英語名">
        <li>
          <input
            type="text"
            className="search"
            placeholder="日本語/英語名"
            onChange={v => filtering(v.target.value)}
          />
        </li>
      </FilterRow>
    </table>
  )
}

export function SemesterFilter(
  props:{state:State['Admin']['SemesterSubjects'], setState:any}
){
  let state= props.state

  // Fetch class_year information.
  const [yearState, setYearState] = 
    useState<State['Multi']['Class_Year']>({contents:[], status:200, msg:''})
  let years = yearState.contents
  useEffect(()=> {
    AdminService.getMultipleObjects<Class_Year>('year', setYearState )
    },[setYearState])

  /**
   * Filtering function.  
   */
  const filtering = (v:string, kind:string) => {
    let newState = Object.assign({}, state)
    console.log(newState)
    if(kind === 'year') newState.fil_year = parseInt(v)
    if(kind === 'learn_year') newState.fil_learn_year = parseInt(v)
    if(kind === 'learn_term') newState.fil_learn_term = v
    if(kind === 'subject') newState.fil_subject = v

    newState.filtered = newState.contents.filter(semSubs=>{
      let b1 = isNaN(newState.fil_year) 
        ? true : semSubs.class_year === newState.fil_year
      let b2 = isNaN(newState.fil_learn_year)
        ? true : semSubs.learn_year === newState.fil_learn_year
      let b3 = newState.fil_learn_term  === ''
        ? true : semSubs.learn_term === newState.fil_learn_term
      let b4 = semSubs.subjects.map(subject=> subject.title_ja)
        .join(' ').includes(newState.fil_subject)

      return b1 && b2 && b3 && b4
      })
    props.setState((prev:any) => ({...newState}))
    }

  return(
    <FetchValidation status={yearState.status}>
      {years === undefined || years.length === 0
      ? <div></div>
      : 
        <FilterContainer>
          <FilterRow title="学年">
            <FilterItem
              cond = {isNaN(state.fil_year)}
              item="すべて"
              func= {()=>filtering('すべて', 'year')}
            />
            { years.map(year => 
              <FilterItem
                cond = {state.fil_year === year.year}
                item={`${year.year}期`}
                func= {()=>filtering(String(year.year), 'year')}
              />
            )}
          </FilterRow>
          <FilterRow title="履修学年">
            <FilterItem
              cond = {isNaN(state.fil_learn_year)}
              item="すべて"
              func= {()=>filtering('', 'learn_year')}
            />
            { [1,2,3,4,5,6].map(learn_year => 
              <FilterItem
                cond = {state.fil_learn_year === learn_year}
                item={`${learn_year}年`}
                func= {()=>filtering(String(learn_year), 'learn_year')}
              />
            )}
          </FilterRow>
          <FilterRow title="前期・後期">
            <FilterItem
              cond = {state.fil_learn_term === ''}
              item="すべて"
              func= {()=>filtering('', 'learn_term')}
            />
            <FilterItem
              cond = {state.fil_learn_term === '前期'}
              item="前期"
              func= {()=>filtering('pre', 'learn_term')}
            />
            <FilterItem
              cond = {state.fil_learn_term === '後期'}
              item="後期"
              func= {()=>filtering('post', 'learn_term')}
            />
          </FilterRow>
          <FilterRow title="教科">
            <li>
              <input
                type="text"
                className="search"
                placeholder="教科名を検索します．"
                onChange={v => filtering(v.target.value,'subject')}
              />
            </li>
          </FilterRow>
        </FilterContainer>
      }    

    </FetchValidation>
  )
}
