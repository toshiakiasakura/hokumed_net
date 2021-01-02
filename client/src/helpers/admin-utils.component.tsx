import React, { Component } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { AdminService } from '../services/admin.service'
import { SaveButton } from './form.component'


type VoidFunc = () => void
export function EditButton(props:{func:VoidFunc}){
  return(
    <button 
      className='btn btn--sm btn--primary'
      onClick={() => props.func()}
    >
      編集
    </button>
  )
}

/**
 * This delete button is for admin. 
 * @param props page and id expand to `/api/${kind}/${id}`
 */
export const DeleteButton = (props:{kind:string,id: number}) => {
  const history = useHistory()
  const deleteHandle = () => {
    if (window.confirm('本当に削除しますか？')){
      AdminService.deleteOneObject(`delete/${props.kind}/${props.id}`)
      .then( (res) => {
        console.log(res)
        if( res.data.status === 200 ){
          history.push(`/admin/${props.kind}`)
        } else {
          alert(res.data.msg)
        }
      })
    }

  }
  return(
    <button
      className="btn btn--sm btn--accent"
      onClick={() => deleteHandle()}
    >
      削除
    </button>
  )
}

/**
 * Container for /admin/:kind/:id pages.  
 * this.props.children contains the table information. 
 * @param editForm React Component for form of each page. 
 * @param kind page kind. Ex. year, semester, notification. 
 */
export class DetailPageContainer extends Component<
    {
        title:string, 
        editForm :any, 
        kind:string, 
        id:number, 
    },
    {edit: boolean}
  >{

  constructor(props:any){
    super(props)
    this.state = {edit: false }
    this.editButton = this.editButton.bind(this)
  }

  editButton(){
    let edit = this.state.edit
    this.setState({
      edit: edit ? false : true 
    })
  }

  render(){
    return(
      <div className="container">
        <ul className="list-inline">
          <li>
            <h3> {this.props.title} </h3>
          </li>
          <li>
            <EditButton func={this.editButton}/>
          </li>
          <li>
            <DeleteButton 
              kind={this.props.kind} 
              id={this.props.id}
             />
          </li>

        </ul>
        {this.props.children}

        {this.state.edit && 
          <div>
          {this.props.editForm}
            <button 
              className="btn btn--primary"
              onClick={() => this.editButton()}
            >
              編集をやめる
            </button>
          </div>
        }
      </div>
    )
  }
}

/**
 * Forma container for /admin/:kind/:id pages. 
 * @param body form body part. 
 */
export function DetailFormContainer(props:{
    body:any, formState:any, title:string
  }){
  return(
    <div className="panel">
      <div className="panel__head">
        <h3> {props.title}　</h3>
      </div>
      <div className="panel__body">
        {props.body}
      </div>
      <div className="panel__foot">
        <div className="clearfix">
          <div className="pull-right">
            <SaveButton formState={props.formState} />
          </div>
        </div>
      </div>
    </div>
  )
}