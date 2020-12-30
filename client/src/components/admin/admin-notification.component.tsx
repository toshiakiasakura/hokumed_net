
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AdminService } from '../../services/admin.service'
import { TransitionButton } from '../../helpers/utils.component'
import { Notification } from '../../entity/notification.entity'

type NotificationState = {
  notifications: Notification[] | null,
  status: number
}

const NotificationRow = (props:{notification:Notification} ) => {
  const d = new Date(props.notification.created_at)
  const create_date= `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
  return(
    <tr>
      <td> {props.notification.id} </td>
      <td> {props.notification.title} </td>
      <td> {create_date} </td>
    </tr>
  )
}


class NotificationBoard extends Component<{},NotificationState>{
  constructor(props:any){
    super(props)
    this.state= {
      notifications: null,
      status: 200,
    }
  }

  componentDidMount(){
    AdminService.getNotificationBoard()
    .then( res => {
      this.setState({
        notifications: res.data.notifications,
        status: res.data.status
      })
    })
  }

  render(){
    let notifications = this.state.notifications
    let status = this.state.status
    console.log("/admin/subject page started")
    console.log(status)
    if( status === 404 || status === 401 ){
      return <Redirect to='/error' />
    } else if(notifications=== null){
      return <div> 読み込み中 </div>
    }

    let content =  notifications.map(notification =>
        <NotificationRow notification={notification} />
    )
    return(
      <div>
        <p>
          <TransitionButton title="新規作成" url='/admin/notification/new' />
        </p>
        <table className="table table--condensed">
          <thead className="table__head">
            {/*TO DO: sorting function.  */}
            <th> ID </th>
            <th> タイトル </th>
            <th> 作成日時</th>
          </thead>
          <tbody className="table__body">
            {content}
          </tbody>
        </table>
      </div>
    )
  }
}

export { NotificationBoard }
