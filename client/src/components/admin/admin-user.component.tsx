import React, { useEffect, useState } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import { UserFilter } from './admin-filter.component'
import { AdminService } from '../../services/admin.service'
import { User } from '../../entity/user.entity'
import {
   TableRow, FetchValidation, BackButton, Loading, TransitionButton,
   dateValidation,
   TransitionText
} from '../../helpers/utils.component'
import { MatchIDType, State } from '../../helpers/types.helper'
import { UserEditForm } from './admin-form.component'
import { DeleteButton } from './admin-utils.component'
import { FetchMultiUsers, FetchOneUser } from '../../helpers/fetch_data'


/**
 * Approval Button for UserBoard. 
 * Only approve can be done here.
 */
const ApproveButtonForBoard = (props:{ user:User }) => {
  // State for approve
  const [state, setState] = useState({confirm:false,approved:false})
  let user = props.user
  let confirm = state.confirm
  let approved = state.approved
  const changeAdminStatusButton = () => {
    if(confirm){
      AdminService.changeApproveStatus(user.id)
      .then( res =>{
          if (res.status !== 200){
            alert('何らかの問題が発生しました．')
          }
      })
      setState({confirm:true, approved:true})
    } else {
      setState({confirm:true, approved:false})
    }
  }
  
  const ButtonPart = () => {
    if(user.approval_state=== 'approved' || user.activation_status === 'pending'){
      return ''
    } else if (approved){
      return '承認済'
    } else {
      return(
        <button
          className={`btn btn--sm  ${confirm ? "btn--secondary" : "btn--primary"}`}
          onClick={()=>changeAdminStatusButton()}
          
        >
          {confirm ? "本当に？" : "承認"}
        </button>
      )
    }
  }

  return(
    <React.Fragment>
      {ButtonPart()}
    </React.Fragment>
  )
}
/**
 * User row compoent. 
 * TO DO: Approval function from userBoard page. 
 */
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
      <td>
        <div className="text-center">
          <ApproveButtonForBoard user={user}/>
        </div>
      </td>
    </tr>
  )
}

function UserBoard(){
  // TO DO: divide filter state and fetching data related state.
  const {state, setState } = FetchMultiUsers()

  console.log("/admin/user page started")
  const makeContents = (contents:User[]) => {
    return contents.map( v=> <UserRow user={v} />)
  }

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading />
      : 
      <div>
        <UserFilter 
          state={state} 
          setState={setState}
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
              <th> 承認 </th>
            </tr>
          </thead>
          <tbody className="table__body">
            {makeContents(state.filtered)}

          </tbody>
        </table>
      </div>
      }
    </FetchValidation>
  )
}

function UserEdit(props:MatchIDType){
  const id = props.match.params.id
  const {state, setState } = FetchOneUser(id)

  let user = state.content
  return(
    <FetchValidation status={state.status}>
      {user === undefined || user.id === undefined 
      ? <Loading />
      : 
        <React.Fragment>
          <h1>{`${user.family_name} ${user.given_name} の登録情報の編集`}</h1>
          <TransitionText url={`/admin/user/${id}`} title="ユーザー詳細に戻る"/>
          <p>
            ELMSメールを変更したい場合は登録し直してください．
          </p>
          <UserEditForm user={user} />
        </React.Fragment>
      }
    </FetchValidation>
  )
}

export function UserBody(props:{user:User}){
  let user = props.user
  return(
    <table className="table table--bordered">
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
    </table>
  )
}


function UserDetail(props:MatchIDType){
  const id = props.match.params.id
  const {state, setState} = FetchOneUser(id)

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
    if( prompt('master PWを入力してください．') === 'masterPW'){
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
                className="btn btn--sm btn--secondary"
                onClick={()=>changeAdminStatusButton(
                  props.match.params.id, user.admin
                  )}
              >
                {user.admin ? '管理者から外す': '管理者にする' }
              </button>
            </li>
            <li>
              <TransitionButton url={`/admin/user/${id}/edit`} title="編集" />
            </li>
          </ul>
          <UserBody user={user} />
        </div>
      }
    </FetchValidation>
  )
}

function UserPages(){
  return(
    <Switch>
      <Route exact path='/admin/user' component={ UserBoard } />
      <Route path='/admin/user/:id/edit' component={ UserEdit } />
      <Route path='/admin/user/:id' component={ UserDetail } />
    </Switch>
  )
}
export { UserPages }
