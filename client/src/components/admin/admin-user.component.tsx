import React, { useEffect, useState } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import { UserFilter } from './admin-filter.component'
import { AdminService } from '../../services/admin.service'
import { User } from '../../entity/user.entity'
import {
   TableRow, FetchValidation, BackButton, Loading
} from '../../helpers/utils.component'
import { 
  MatchIDType, OneClassStatus, MultiClassStatus,
  UsersState
 } from '../../helpers/types.helper'
import { DeleteButton } from '../../helpers/admin-utils.component'


const UserRow = (props:{user:User}) => {
  let user = props.user
  let bariconClass = 'baricon--question'
  let approval = user.approval_state === 'approved' 
  let active = user.activation_status === 'active'
  if(approval && active) bariconClass = 'baricon--heart baricon--accent'
  if(!approval && active) bariconClass = 'baricon--exclamation baricon--primary clickable'
  if(!approval && !active) bariconClass = 'baricon--times'
  if(user.admin) bariconClass = 'baricon--star baricon--secondary'
    
  return(
    <tr>
      <td> {user.id} </td>
      <td> {user.class_year } </td>
      <td>
        <Link to={`/admin/user/${user.id}`}>
          {user.handle_name }
        </Link>
      </td>
      <td> { `${user.family_name} ${user.given_name}`} </td>
      <td> {user.email} </td>
      <td > 
        <div className="text-center">
          <button
            className="button-unstyled inline-block tooltip tooltip--left"
            id={`tooltip${user.id}`}
            data-toggle="tooltip"
            data-html="true"
            title="aaa"
          >
            {/** Tooltip and approve function needs to be implemented. */}
            <div className={`baricon baricon--intext ${bariconClass}`}>
              <div className="baricon__bar"/>
              <div className="baricon__bar"/>
              <div className="baricon__bar"/>
            </div>
          </button>
        </div>
      </td>
    </tr>
  )
}




function UserBoard(props:UsersState){
  /**
   * Many arguments are for filtering function.
   */
  const [userState, setUserState] = useState<
        UsersState
      >( {contents:[], status:200, msg:'', 
      filtered:[], fil_year:NaN, fil_name:'', 
      fil_state:'', fil_mail:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<User>('user', setUserState)
    .then( _ => {
      setUserState((prev:any) => ({ ...prev, filtered:prev.contents }))
    })
  },[setUserState])

  console.log("/admin/user page started")
 
  const makeContents = (contents:User[]) => {
    return contents.map( v=> <UserRow user={v} />)
  }

  let contents = userState.contents
  return(
    <FetchValidation status={userState.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading />
      : 
      <div>
        <UserFilter 
          userState={userState} 
          setUserState={setUserState}
        />
        <table className="table table--condensed">
          <thead className="table__head">
            <tr>
              <th className="text-small"> ID </th>
              <th> 期 </th>
              <th> ハンドルネーム </th>
              <th> 氏名 </th>
              <th> メールアドレス </th>
              <th> 状態 </th>
            </tr>
          </thead>
          <tbody className="table__body">
            {makeContents(userState.filtered)}

          </tbody>
        </table>
      </div>
      }
    </FetchValidation>
  )
}


export function UserBody(props:{user:User}){
  let user = props.user
  return(
    <tbody>
      <TableRow rowName="ID" item={user.id} />
      <TableRow rowName="ハンドルネーム" item={user.handle_name} />
      <TableRow rowName="氏名" item={`${user.family_name} ${user.given_name}`} />
      <TableRow rowName="期" item={user.class_year} />
      <TableRow rowName="管理者" item={user.admin} />
      <TableRow rowName="メールアクティベート" item={user.activation_status} />
      <TableRow rowName="承認状態" item={user.approval_state} />
      <TableRow rowName="メールアドレス" item={user.email} />
      <TableRow rowName="携帯メールアドレス" item={user.email_mobile} />
      <TableRow rowName="誕生日" item={user.birthday} />
      <TableRow rowName="作成日" item={user.created_at} />
      <TableRow rowName="更新日" item={user.updated_at} />
      {/*// TO DO: Add last login, logout, ip address information.*/}
    </tbody>
  )
}


function UserDetail(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<OneClassStatus<User>>
    ({content:new User(), status:200, msg:''})

  useEffect(()=> {
    AdminService.getOneObject<User>(`user/${id}`, setState)
    },[setState])

  const approveButton= function(id: number,approval_state: string){
    AdminService.changeApproveStatus(id)
    .then( res =>{
        if (res.status === 200){
          if(approval_state === 'waiting'){
            alert('承認しました．承認メールを送信しました．')
          }
          window.location.reload()
        }
    })}

  const changeAdminStatusButton = function(id:number, admin:boolean){
    if(admin || 
      (!admin && prompt('master PWを入力してください．') === 'masterPW')
    ){
      AdminService.changeAdminStatus(id)
        .then( res =>{
          if (res.status === 200){
            window.location.reload()
          }
        })
    }}

  console.log("SubjectDetail page started. ")
  let user = state.content
  return(
    <FetchValidation status={state.status}>
      {user === undefined || user.id === undefined 
      ? <Loading />
      : 
        <div>
        <p>
          <BackButton title="一覧に戻る" url="/admin/user" /> 
        </p>
          <ul className="list-inline">
            <li> <h3>  {user.handle_name} </h3></li>
            <li>
              <button
                className="btn btn--sm btn--primary"
                onClick={()=>approveButton(
                  props.match.params.id,
                  user.approval_state
                  )}
              >
                {user.approval_state==='waiting' ? 'Approve' : 'Disapprove'}
              </button>
            </li>
            <li>
              <DeleteButton kind="user" id={props.match.params.id}/>
            </li>
            <li>
              <button
                className="btn btn--sm btn--primary"
                onClick={()=>changeAdminStatusButton(
                  props.match.params.id, user.admin
                  )}
              >
                {user.admin ? '管理者から外す': '管理者にする' }
              </button>
            </li>
          </ul>
            <table className="table table--bordered">
              <UserBody user={user} />
            </table>
        </div>
      }
    </FetchValidation>
  )
}

function UserPages(){
  return(
    <Switch>
      <Route exact path='/admin/user' component={ UserBoard } />
      <Route path='/admin/user/:id' component={ UserDetail } />
    </Switch>
  )
}
export { UserPages }
