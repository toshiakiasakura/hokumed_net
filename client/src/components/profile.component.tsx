import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { UserService } from '../services/user.service'
import Cookies from 'universal-cookie'
import { User } from '../entity/user.entity'
import { TableRow } from './utils.component'

class Profile extends Component<{},{user:User[], status:number}> {
  constructor(props:any){
    super(props)
    this.state = {
      user: [],
      status: 200
    }
  }
  componentDidMount(){
    UserService.getProfileBoard()
    .then( res => {
      this.setState({
        user: [res.data.user],
        status: res.data.status
      })
    })
    .catch(err => console.log(err))
  }
  render(){
    console.log('profile componenct access.')
    const user = this.state.user[0]
    const status = this.state.status
    console.log(user, status)
    if (status === 404 || status === 401){
      return <Redirect to='/error' />
    } else if( typeof user === 'undefined'){
      return( <div> 読み込み中 </div> )
    }
    return(
      <div className="topfix">
        <div className="container">
          <ul className="list-inline">
            <li>
              <h1>プロフィール </h1>
            </li>
            <li>
              <a className="btn btn--primary">
                <i className="fa fa-pencil">
                  編集
                </i>
              </a>
            </li>
            <table className="table table--bordered no-mb">
              <tbody>
               <TableRow rowName="ハンドルネーム" item={user.handle_name} />
               <TableRow rowName="氏名" item={`${user.family_name} ${user.given_name}`} />
               <TableRow rowName="期" item={user.class_year} />
               <TableRow rowName="管理者" item={user.admin} />
               <TableRow rowName="承認状態" item={user.approval_state} />
               <TableRow rowName="メールアドレス" item={user.email} />
               <TableRow rowName="携帯メールアドレス" item={user.email_mobile} />
               <TableRow rowName="誕生日" item={user.birthday} />
               <TableRow rowName="作成日" item={user.created_at} />
              </tbody>
            </table>
          </ul>
        </div>
      </div>

    )
  }
}
export { Profile }
