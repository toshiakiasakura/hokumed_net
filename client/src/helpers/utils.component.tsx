import moment from 'moment'
import React, { Component } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { AdminService } from '../services/admin.service'

/**
 * One element of TableRow. This component convert information to
 * specific format according to rowName or type of item.
 */
export const TableRow = (props:{rowName:string,
                         item: string | number | boolean | Date
                       }) => {
    const item =[]
    if (typeof props.item === 'boolean'){
      item.push(props.item ? 'true' : 'false')
    } else if (  ['誕生日','作成日', '更新日'].includes(props.rowName) &&
                typeof props.item === 'string') {
      const birthday =  changeDate(props.item)
      item.push(birthday)

    } else if (props.item === null) {
      item.push('NULL')
    } else if(props.item instanceof Date){
      let d = props.item
      const formatDate= `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
      item.push(formatDate)
    } else {
      item.push(props.item)
    }
    return(
      <tr>
        <th> {props.rowName} </th>
          <td> {item} </td>
      </tr>
    )
}


/**
 * This button is used for page transition of
 * editing or create new data.
 */
type ButtonType= {
  title: string
  url: string
  onClick?: any
  secondary?: boolean
}
export const TransitionButton = (props: ButtonType) => {
  const history = useHistory()
  return(
    <button
      className={`btn btn--sm ${props.secondary ? "btn--secondary" : "btn--primary"}` }
      onClick={() => {
        history.push(props.url)
        typeof props.onClick === 'function' && props.onClick()
      } }
    >
      {props.title}
    </button>
  )
}

export function BackButton(props: ButtonType){
  const history = useHistory()
  return(
    <button
      className="btn btn--xs"
      onClick={() => history.push(props.url)}
    >
      {props.title}
    </button>
  )
}

export function TransitionText(props:ButtonType){
  return(
    <a 
      href="javascript;:" 
      onClick={typeof props.onClick === 'function' && props.onClick()} 
    >
      <Link to={props.url}>{props.title}</Link>
    </a>
  )
}

/**
 * Given the database date data, convert it to the formatted date. 
 */
export const changeDate = (date: string | Date) => {
  let d = null 
  if(typeof date === 'string'){
    d = new Date(date)
  } else {
    d = date
  }
  const formatDate= `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
  return formatDate
}

export function dateValidation(
  year:string, month:string, day:string
){
  const date_str = `${year}-${month}-${day}`
  const date_bool = moment(date_str, 'YYYY-M-D',true).isValid()
  if (!date_bool){
    return undefined
  }
  return new Date(date_str)
}

/**
 * According to status infromation, redirect is decided.
 * If non error, return the children component. 
 */
export class FetchValidation extends Component<
    {status:number},
    {}
  >{
    render(){
      let status  =  this.props.status
      if( status !== undefined && status !== 200){
        return(<Redirect to={`/error/${status}`} />)
      } else {
        return(
          <div>
            {this.props.children}
          </div>
        )
      }
    }
}

export function Loading(){
  return(
    <div>読み込み中</div>
  )
}

export function humanFileSize(size:number) {
    var i = Math.floor( Math.log(size) / Math.log(1024) )
    return `${( size / Math.pow(1024, i) ).toFixed(2)}`  + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}