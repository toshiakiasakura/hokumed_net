import React, { useEffect, useState } from 'react'
import { Route, Switch, Link } from 'react-router-dom'

import { AdminService } from '../../services/admin.service'
import { User } from '../../entity/user.entity'
import {
   TableRow, FetchValidation, BackButton, Loading
} from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { DeleteButton } from '../../helpers/admin-utils.component'

type UsersState = MultiClassStatus<User>

const UserRow = (props:{user:User}) => {
  let user = props.user
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
      <td> {user.approval_state} </td>
    </tr>
  )
}

function UserBoard(props:UsersState){
  const [state, setState] = useState<
        UsersState
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<User>('user')
    .then( res => {
      console.log(res)
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

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
        <table className="table table--bordered">
          <thead className="table__head">
            <tr>
              <th> ID </th>
              <th> 期 </th>
              <th> ハンドルネーム </th>
              <th> 氏名 </th>
              <th> メールアドレス </th>
              <th> 状態 </th>
            </tr>
          </thead>
          <tbody className="table__body">
            {makeContents(contents)}

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
      <TableRow rowName="承認状態" item={user.approval_state} />
      <TableRow rowName="メールアドレス" item={user.email} />
      <TableRow rowName="携帯メールアドレス" item={user.email_mobile} />
      <TableRow rowName="誕生日" item={user.birthday} />
      <TableRow rowName="作成日" item={user.created_at} />
      {/*// TO DO: Add last login, logout, ip address information.*/}
    </tbody>
  )
}


function UserDetail(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<
      OneClassStatus<User>
      >(
        {content:new User(), status:200, msg:''}
       )

  useEffect(()=> {
    AdminService.getOneObject<User>(`user/${id}`)
    .then(res =>{
      console.log(res.data)
      setState({
        content: res.data.content,
        status: res.data.status,
        msg: res.data.msg
      })
    })
    .catch(err => console.log(err))
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
    })
   }

   const changeAdminStatusButton = function(id:number){
     AdminService.changeAdminStatus(id)
     .then( res =>{
        if (res.status === 200){
          window.location.reload()
        }
     })
   }

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
                onClick={()=>changeAdminStatusButton(props.match.params.id)}
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
