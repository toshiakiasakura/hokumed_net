import React, { Component } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { AdminService } from '../services/admin.service'


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
 * @param props page and id expand to `/api/${url}/${id}`
 */
export const DeleteButton = (props:{kind:string,id: number}) => {
  const history = useHistory()
  const deleteHandle = () => {
    if (window.confirm('本当に削除しますか？')){
      AdminService.deleteOneObject(`${props.kind}/delete/${props.id}`)
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

class DetailPageContainer extends Component<
    {title:string, editPage:any, kind:string, id:number},
    {edit: boolean}
  >{

  constructor(props:any){
    super(props)
    this.state = {edit: false }
    this.editButton = this.editButton.bind(this)
  }

  editButton(){
    this.setState({
      edit:true
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
        {this.state.edit && this.props.editPage }
      </div>
    )
  }
}

export { DetailPageContainer }