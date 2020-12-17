import React, { Component } from 'react'
import { Route, useRouteMatch, Switch, Link, Redirect } from 'react-router-dom'
import { AdminService } from '../services/admin.service'
import { Users } from '../services/admin.service'
import { NotFound } from './404.component'

const TopNavItem = (props:{url:string, tabName:string} ) => {
  let match = useRouteMatch()
  return(
    <div className="tab">
      <a href={`${match.url}/${props.url}`}> {props.tabName} </a>
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


const UserBody = (props:{users:Users[]}) => {
  let match = useRouteMatch()
  let table_row = []
  for (let user of props.users){
    table_row.push(
      <tr>
        <td> {user.id} </td>
        <td> {user.class_year_id } </td>
        <td>
          <Link to={`${match.url}/${user.id}`}>
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
      this.setState({
        content: res.data,
        status: 200
      })
    })
    .catch( err => {
      this.setState({
        status:404
      })
    } )

  }

  render() {
    let {content} = this.state
    if (typeof content === 'undefined'){
      return( <div> 読み込み中 </div> )
    } else if (this.state.status === 404){
      return <Redirect to='/' />
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
    return(
      <tr>
        <th> {props.rowName} </th>
        <td> {props.item} </td>
      </tr>
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
        users: [res.data],
        status: 200
      })

    })
    .catch(err => {
      this.setState({
        status:404
      })
    })
  }


  render(){
    let user = this.state.users[0]
    if (typeof user === 'undefined'){
      return <div> 読み込み中 </div>
    } else if (this.state.status === 404){
      return <Redirect to='/' />
    }
    return(
      <div>
        <ul className="list-inline">
          <li> <h3>  {user.handle_name} </h3></li>
          <li>
            <button className="btn btn--sm btn--primary">
              Approve
            </button>
          </li>
          <li>
            <button className="btn btn--sm btn--accent">
              削除する
            </button>
          </li>
        </ul>
          <table className="table table--bordered">
            <tbody>
               <TableRow rowName="ID" item={user.id} />
               <TableRow rowName="ハンドルネーム" item={user.handle_name} />
               <TableRow rowName="氏名" item={`${user.handle_name} ${user.given_name}`} />
               <TableRow rowName="期" item={user.class_year_id} />
               <TableRow rowName="管理者" item={user.admin} />
               <TableRow rowName="承認状態" item={user.approval_state} />
               <TableRow rowName="メールアドレス" item={user.email} />
               <TableRow rowName="携帯メールアドレス" item={user.email_mobile} />
               <TableRow rowName="誕生日" item={user.birthday} />
            </tbody>
          </table>

      </div>

    )
  }
}

const Admin = () => {
  let match = useRouteMatch()
  return(
    <div className="topfix">
      <TopNavVar />
      <Switch>
        <Route exact path={`${match.url}/user`} component={UserBoard} />
        <Route path={`${match.url}/user/:id`} component={UserDetail}/>
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
export { Admin }
