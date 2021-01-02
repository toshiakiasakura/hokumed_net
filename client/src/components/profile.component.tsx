import { useState, useEffect } from 'react'
import { AdminService } from '../services/admin.service'
import { User } from '../entity/user.entity'
import { FetchValidation, TableRow } from '../helpers/utils.component'
import { UserBody } from './admin/admin-user.component'
import { MatchIDType, MultiClassStatus, OneClassStatus } from '../helpers/types.helper'

function Profile(props:MatchIDType){
  const id = props.match.params.id
  const [state, setState] = useState<
      OneClassStatus<User>
      >( {content:new User(), status:200, msg:''})

  useEffect(()=> {
    AdminService.getOneObject<User>(`user/${id}`)
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
      ? <div> 読み込み中 </div>
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
