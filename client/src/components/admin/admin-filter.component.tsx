import { useState, useEffect} from 'react'

import { Class_Year } from '../../entity/study.entity'
import { AdminService } from '../../services/admin.service'
import {
   TableRow, FetchValidation, BackButton, Loading
} from '../../helpers/utils.component'
import {
   MultiClassStatus, UsersState 
} from '../../helpers/types.helper'


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

type ClassYearsState = MultiClassStatus<Class_Year>
export function UserFilter(
  props:{ userState:UsersState, setUserState:any }
){
  const [state, setState] = 
    useState<ClassYearsState>({contents:[], status:200, msg:''})

  let userState = props.userState
  let years = state.contents
  useEffect(()=> {
    AdminService.getMultipleObjects<Class_Year>('year', setState )
    },[setState])

  /**
   * Filtering function.  
   */
  const filtering = (v:string, kind:string) => {
    let newState = Object.assign({},userState)
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

    props.setUserState((prev:any) => ({...newState}))
    }

  return(
    <FetchValidation status={state.status}>
      {years === undefined || years.length === 0
      ? <div></div>
      : 
        <table className="table table--bordered table--condensed">
          <FilterRow title="状態">
            <FilterItem
              cond = {userState.fil_state=== ''}
              item="すべて"
              func= {()=>filtering('', 'state')}
            />
            <FilterItem
              cond = {userState.fil_state === 'admin'}
              item="管理者"
              func= {()=>filtering('admin', 'state')}
            />
            <FilterItem
              cond = {userState.fil_state === 'active'}
              item="メール承認待ち"
              func= {()=>filtering('active', 'state')}
            />
            <FilterItem
              cond = {userState.fil_state === 'approval'}
              item="管理人承認待ち"
              func= {()=>filtering('approval', 'state')}
            />
          </FilterRow>
          <FilterRow title="学年">
            <FilterItem
              cond = {isNaN(userState.fil_year)}
              item="すべて"
              func= {()=>filtering('すべて', 'year')}
            />
            { years.map(year => 
              <FilterItem
                cond = {userState.fil_year === year.year}
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
        </table>
      }
    </FetchValidation>
  )
}