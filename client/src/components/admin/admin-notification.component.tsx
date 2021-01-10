import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import { Notification } from '../../entity/notification.entity'
import { 
  TableRow, FetchValidation, changeDate, 
  BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { 
  DetailPageContainer, DetailFormContainer, 
} from './admin-utils.component'
import { FormRow } from '../../helpers/form.component'

type NotificationsStatus = MultiClassStatus<Notification>

const NotificationRow = (props:{notification:Notification} ) => {
  const create_date = changeDate(props.notification.created_at)
  return(
    <tr>
      <td> {props.notification.id} </td>
      <td> 
        <Link to={`/admin/notification/${props.notification.id}`}>
          {props.notification.title} 
        </Link>
      </td>
      <td> {create_date} </td>
    </tr>
  )
}

function NotificationBoard(props:NotificationsStatus){
  const [state, setState] = useState<
      NotificationsStatus
      >( {contents:[], status:200, msg:''})

  useEffect(()=> {
    AdminService.getMultipleObjects<Notification>('notification', setState)
  },[setState])

  console.log("/admin/Notification page started")
 
  const makeContents = (contents:Notification[]) => {
    return contents.map( v=> <NotificationRow notification={v} />)
  }

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined 
      ? <Loading/>
      : 
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
              {makeContents(contents)}
            </tbody>
          </table>
        </div>
      }
    </FetchValidation>
  )
}

type NotificationFormData = {title:string, text: string}

function NotificationFormBody(
    props:{errors:any, register:any, content: NotificationFormData}
  ){
  return(
    <div>
      <FormRow 
        title="タイトル"
        name="title"
        id="NotificationPageEditTitle"
        placeholder="タイトル"
        errors={props.errors} register={props.register}
        reg_json={{
          required:"入力必須項目です",
        }}
      />
      <FormRow 
        title="テキスト"
        name="text"
        id="NotificationPageEditText"
        placeholder="テキスト"
        errors={props.errors} register={props.register}
        reg_json={{
          required:"入力必須項目です",
        }}
      />
    </div>
  )
}

function NotificationEdit(props:{content:Notification}){
  const { register, handleSubmit, errors, formState 
  } = useForm<NotificationFormData>({
    mode:'onBlur',
    defaultValues: {
      title: props.content.title,
      text: props.content.text
    }
  })
  const content = props.content 
  const editSubmit = (data:NotificationFormData)=>{
    AdminService.editOneObject(`edit/notification/${content.id}`, data)
    .then(res=>{
      window.location.reload()
    })
  }
  return(
    <form 
      className="form row"
      role="form"
      name="notificationForm"
      onSubmit={handleSubmit(editSubmit)}
    >
      <DetailFormContainer 
        title="編集"
        formState={formState}
        body={<NotificationFormBody
                register={register} 
                errors={errors}
                content={props.content}
              />}
      />
    </form>
  )
}

function NotificationNew(){
  const { register, handleSubmit, errors, formState } =
                            useForm<NotificationFormData>({mode:'onBlur'})
  const history = useHistory()                         
  const newSubmit = (data:NotificationFormData)=>{
    AdminService.editOneObject(`new/notification`, data)
    .then( res => {
      alert('通知を追加しました．')
      history.push(`/admin/notification`)
    })
  }
  const content: NotificationFormData = {title:'', text:''}
  return(
    <div>
      <p>
        <BackButton title="一覧に戻る" url="/admin/notification" /> 
      </p>
      <form 
        className="form row"
        role="form"
        name="NotificationForm"
        onSubmit={handleSubmit(newSubmit)}
      >
        <DetailFormContainer 
          title="通知の新規作成．"
          formState={formState}
          body={<NotificationFormBody 
                  register={register} 
                  errors={errors}
                  content={content}
                />}
          
        />
      </form>
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
    AdminService.getOneObject<Notification>(`notification/${id}`, setState)
  },[setState])

  console.log("NotificationDetail page started. ")
  let content = state.content
  return(
    <FetchValidation status={state.status}>
      {content === undefined || content.id === undefined 
      ? <Loading/>
      : 
        <DetailPageContainer 
          title={`${content.title}`}
          editForm={<NotificationEdit content={content}/>}
          kind="notification"
          id={props.match.params.id}
          >
            <table className='table table--bordered'>
              <tbody>
                <TableRow rowName='ID' item={content.id}/>
                <TableRow rowName='タイトル' item={content.title}/>
                {/* TO DO: set link */}
                <TableRow rowName='説明文' item={`${content.text}`}/>
                <TableRow rowName='作成日' item={content.created_at}/>
                <TableRow rowName='更新日' item={content.updated_at}/>
              </tbody>
            </table>
        </DetailPageContainer>
      }
    </FetchValidation>
  )
}
function NotificationPages(){
  return(
    <Switch>
      <Route exact path='/admin/notification' component={NotificationBoard} />
      <Route exact path='/admin/notification/new' component={NotificationNew} />
      <Route path='/admin/notification/:id' component={NotificationDetail} />
    </Switch>
  )
}
export { NotificationPages }
