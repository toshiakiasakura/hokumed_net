import { useState, useEffect } from 'react'
import { UserService } from '../services/user.service'
import { User } from '../entity/user.entity'
import { FetchValidation, Loading } from '../helpers/utils.component'
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
                <a className="btn btn--primary">
                  <i className="fa fa-pencil">
                    編集
                  </i>
                </a>
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

export { Profile }
