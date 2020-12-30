import React, { Component } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { AdminService } from '../../services/admin.service'
import { User } from '../../entity/user.entity'
import { TableRow } from '../../helpers/utils.component'
import { MatchIDType } from '../../helpers/types.helper'

const UserBody = (props:{users:User[]}) => {
  let table_row = []
  for (let user of props.users){
    table_row.push(
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
  return(
    <tbody className="table__body">
      {table_row}
    </tbody>
  )
}

class UserBoard extends Component<{},{content: User[], status: number}> {
  constructor(props:any){
    super(props)
    this.state = {
      content: [],
      status: 200
    }

  }
  componentDidMount() {
    AdminService.getUserBoard()
    .then( (res) =>{
      console.log('getUserBoard componentDidMount process starts.')
      console.log(res)
      this.setState({
        content: res.data.users,
        status: res.data.status
      })
    })
    .catch( err => {
      console.log(err)
      this.setState({
        status:404
      })
    } )

  }

  render() {
    let {content, status} = this.state
    if (status === 404 || status === 401){
      return <Redirect to='/error' />
    } else if (typeof content === 'undefined'){
      return( <div> 読み込み中 </div> )
    }
    return(
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
        <UserBody users={content}/>
      </table>
    )
  }
}

const DeleteButton = (props:{id: number}) => {
  const history = useHistory()
  const deleteHandle = (id:number ) => {
    if (window.confirm('本当に削除しますか？')){
      AdminService.deleteUser(id)
      .then( (res) => {
        console.log(res)
        if( res.status === 200 ){
          history.push('/admin/user')
        } else {
          alert(res.msg)
        }
      })
    }

  }
  return(
    <button
      className="btn btn--sm btn--accent"
      onClick={() => deleteHandle(props.id)}
    >
      削除する
    </button>
  )

}


class UserDetail extends Component<
    MatchIDType,
    {users: User[], status:number}
  >{
  constructor(props:any){
    super(props)
    this.state = {
      users: [],
      status: 200
    }
  }

  componentDidMount(){
    AdminService.getUserDetail(this.props.match.params.id)
    .then( res => {
      this.setState({
        users: [res.data.user],
        status: res.data.status
      })
    })
    .catch(err => {
      console.log(err)
      this.setState({
        status:404
      })
    })
  }

  approveButton(id: number,approval_state: string){
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

   changeAdminStatusButton(id:number){
     AdminService.changeAdminStatus(id)
     .then( res =>{
        if (res.status === 200){
          window.location.reload()
        }
     })
   }

  render(){
    let user = this.state.users[0]
    let status = this.state.status
    if (status === 404 || status === 401){
      return <Redirect to='/error' />
    } else if (typeof user === 'undefined'){
      return <div> 読み込み中 </div>
    }
    return(
      <div>
        <ul className="list-inline">
          <li> <h3>  {user.handle_name} </h3></li>
          <li>
            <button
              className="btn btn--sm btn--primary"
              onClick={()=>this.approveButton(
                this.props.match.params.id,
                user.approval_state
              )}
            >
              {user.approval_state==='waiting' ? 'Approve' : 'Disapprove'}
            </button>
          </li>
          <li>
            <DeleteButton id={this.props.match.params.id}/>
          </li>
          <li>
            <button
              className="btn btn--sm btn--primary"
              onClick={()=>this.changeAdminStatusButton(this.props.match.params.id)}
            >
              {user.admin ? '管理者から外す': '管理者にする' }
            </button>
          </li>
        </ul>
          <table className="table table--bordered">
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
          </table>

      </div>

    )
  }
}

export { UserBoard, UserDetail }
