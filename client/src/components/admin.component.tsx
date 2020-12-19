import React, { Component } from 'react'
import { Route, Switch,
         Link, Redirect, useHistory } from 'react-router-dom'
import { AdminService } from '../services/admin.service'
import { Users } from '../services/admin.service'
import { NotFound } from './404.component'
import Cookies from 'universal-cookie'

const TopNavItem = (props:{url:string, tabName:string} ) => {
  return(
    <div className="tab">
      <Link to={`/admin/${props.url}`}> {props.tabName} </Link>
    </div>
  )
}

const TopNavVar = () => {
  return(
    <div className="tabs">
      <div className="container">
        <TopNavItem url="" tabName="TOP" />
        <TopNavItem url="user" tabName="ユーザー" />
        <TopNavItem url="year" tabName="学年" />
        <TopNavItem url="subject" tabName="教科" />
        <TopNavItem url="term" tabName="学期" />
        <TopNavItem url="notification" tabName="お知らせ" />
      </div>
    </div>
  )
}

const TopItem = (props:{href:string, col1:string, col2:string})=>{
  return(
    <tr>
      <th>
        <a href={props.href}>
          {props.col1}
        </a>
      </th>
      <td>
        {props.col2}
      </td>
    </tr>
  )
}

const Top = () => {
  return(
  <table  className="table table--bordered">
    <tr>
      <th> <a href="/admin/user" > ユーザー </a>
      </th>
      <td>
        <strong>
        取得 ， 管理人の認証(approve) ，削除，管理人の管理
        </strong>
        をすることが出来ます．
      </td>
    </tr>
    <TopItem href="/admin/year" col1="学年" col2="93期以降から作成可能です．" />
    <TopItem href="/admin/subject" col1="教科"
      col2={'英語名には半角英数字と「_(アンダーバー)」のみ設定できます． '+
      '教科のページのURLに使われるので慎重に設定しましょう．' }/>
    <TopItem href="/admin/semester" col1="学期" col2="各学年のセメスター(前期・後期)ごとの履修科目のマップです．" />
    <TopItem href="/admin/notification" col1="お知らせ" col2="お知らせの編集が出来ます．" />


  </table>
  )
}

const UserBody = (props:{users:Users[]}) => {
  let table_row = []
  for (let user of props.users){
    table_row.push(
      <tr>
        <td> {user.id} </td>
        <td> {user.class_year_id } </td>
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

class UserBoard extends Component<{},{content: Users[], status: number}> {
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

const TableRow = (props:{rowName:string,
                         item: string | number | boolean | Date
                       }) => {
    const item =[]
    if (typeof props.item === 'boolean'){
      item.push(props.item ? 'true' : 'false')
    } else if (  ['誕生日','作成日'].includes(props.rowName) &&
                typeof props.item === 'string') {
      const d = new Date(props.item)
      const birthday = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
      item.push(birthday)
    } else if (props.item === null) {
      item.push('NULL')
    } else {
      item.push(props.item)
    }
    return(
      <tr>
        <th> {props.rowName} </th>
          <td> {item} </td>
      </tr>
    )
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
                          {match:{params:{id:number}}},
                          {users: Users[], status:number}
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

  approveButton(id:number){
    AdminService.changeApproveStatus(id)
    .then( res =>{
        if (res.status === 200){
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
              onClick={()=>this.approveButton(this.props.match.params.id)}
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
               <TableRow rowName="期" item={user.class_year_id} />
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

const Admin = () => {
  console.log("Try to access admin page.  ")
  const cookies = new Cookies()
  console.log(cookies.getAll())
  if (cookies.get('isLogIn') !== 'true' || cookies.get('isAdmin') !== 'true'){
    return( <Redirect to='/error' />)
  }
  return(
    <div className="topfix">
      <TopNavVar />
      <Switch>
        <Route exact path='/admin' component={Top} />
        <Route exact path='/admin/user' component={UserBoard} />
        <Route path='/admin/user/:id' component={UserDetail}/>
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
export { Admin }
