import React, { useEffect, useState } from 'react'
import { Route, Switch, Link } from 'react-router-dom'

import { AdminService } from '../services/admin.service'
import { Notification } from '../entity/notification.entity'
import { MatchIDType, OneClassStatus, MultiClassStatus } from '../helpers/types.helper'
import { 
  FetchValidation, changeDate, BackButton
} from '../helpers/utils.component'
import { sortDate } from '../helpers/sort.helper'

type NotificationsStatus = MultiClassStatus<Notification>

const NotificationRow = (props:{notification: Notification}) => {
  const create_date = changeDate(props.notification.updated_at)
  return(
    <tr>
      <th style={{width: "160px"}}> {create_date} </th>
      <td> 
        <Link to={`/notification/${props.notification.id}`}>
          {props.notification.title} 
        </Link>
      </td>
    </tr>
  )
}

function Home(){
  const [state, setState] = useState<
      NotificationsStatus
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Notification>('notification')
    .then( res => {
      console.log(res)
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

  const makeContents = (contents:Notification[]) => {
    let disp = sortDate(contents, 'created_at', false).slice(0,5)
    disp = disp.map(v => <NotificationRow notification={v} />)
    return(disp)
  }

  return(
    <div className="hero">
      <div className="hero__bg" />
      <div className="hero__welcome">
        <div className="hero__welcome__title">北医ネット </div>
        <div className="hero__welcome__elocution">
          {/*TO DO: Connect with backend and display notification. */}
          <h3> お知らせ </h3>
          <table className="table table--bordered">
            <tbody className="table__body">
              {makeContents(state.contents)}
            </tbody>
          </table>
          <p className="text-right">
            <Link to="/notification">
              お知らせ一覧
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 

function NotificationBoard(){
  const [state, setState] = useState<
      NotificationsStatus
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Notification>('notification')
    .then( res => {
      console.log(res)
      setState({
        contents: res.data.contents, 
        status: res.data.status,
        msg: res.data.msg
      })
    })
  },[setState])

  const makeContents = (contents:Notification[]) => {
    let disp = sortDate(contents, 'created_at', false)
    disp = disp.map(v => <NotificationRow notification={v} />)
    return(disp)
  }

  return(
    <div className="topfix container" >
      <h1> お知らせ一覧 </h1>
      <table className="table table--bordered">
        <tbody className="table__body">
          {makeContents(state.contents)}
        </tbody>
      </table>

    </div>
  )
} 

function NotificationDetail(props:MatchIDType){

  const id = props.match.params.id
  const [state, setState] = useState<
      OneClassStatus<Notification>
      >(
        {content:new Notification(), status:200, msg:''}
       )

  useEffect(()=> {
    AdminService.getOneObject<Notification>(`notification/${id}`)
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

  console.log("NotificationDetail page started. ")
  let content = state.content
  return(
    <FetchValidation status={state.status}>
      {content === undefined || content.id === undefined 
      ? <div> 読み込み中 </div>
      : 

        <div className="topfix container">
          <p>
            <BackButton title="お知らせ一覧に戻る" url="/notification" />
          </p>
          <h1>
            {content.title}
          </h1>
          <div className="text-right">
            {changeDate(content.created_at)}
          </div>
          <hr />
          <div>
            {content.text}
          </div>

        </div>
      }
    </FetchValidation>
  )
}

function NotificationPages(){
  return(
    <Switch>
      <Route exact path='/notification' component={ NotificationBoard } />
      <Route path='/notification/:id' component={ NotificationDetail } />
    </Switch>
  )
}

export { Home, NotificationPages }
