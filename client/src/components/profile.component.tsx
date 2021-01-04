import { useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { UserService } from '../services/user.service'
import { User } from '../entity/user.entity'
import { FetchValidation, Loading, TransitionButton } from '../helpers/utils.component'
import { UserBody } from './admin/admin-user.component'
import { MatchIDType, MultiClassStatus, OneClassStatus } from '../helpers/types.helper'

function Profile(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<
      OneClassStatus<User>
      >( {content:new User(), status:200, msg:''})

  useEffect(()=> {
    UserService.getProfileBoard()
    .then( res => {
      console.log(res)
      setState({
        content: res.data.content, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

  console.log('profile componenct access.')
  let user= state.content
  return(
    <FetchValidation status={state.status}>
      {user === undefined || user.id === undefined 
      ? <Loading />
      : 
        <div className="topfix">
          <div className="container">
            <ul className="list-inline">
              <li>
                <h1>プロフィール </h1>
              </li>
              <li>
                <TransitionButton title='編集' url='/profile/edit'/> 
              </li>
              <table className="table table--bordered no-mb">
                <UserBody user={user} />
              </table>
            </ul>
          </div>
        </div>
      }
    </FetchValidation >
  )
}

function Prepare(){
  return(
    <h1 className="topfix container">準備中</h1>
  )
}

function ProfilePages(){
  return(
    <Switch>
      <Route exact path='/profile' component={ Profile } />
      <Route exact path='/profile/edit' component={ Prepare }/> 
      <Route component={ () => <Redirect to='/error'/>}/> 
    </Switch>
  )
}
export { ProfilePages }
