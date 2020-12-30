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
type TransitionButtonType = {
  title:string
  url: string
}
export const TransitionButton = (props: TransitionButtonType) => {
  const history = useHistory()
  return(
    <button
      className="btn btn--sm btn--primary"
      onClick={() => history.push(props.url)}
    >
      {props.title}
    </button>
  )
}

type VoidFunc = () => void
export function EditButton(props:{func:VoidFunc}){
  return(
    <button 
      className='btn btn--sm btn--accent'
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
export const DeleteButton = (props:{page:string,id: number}) => {
  const history = useHistory()
  const deleteHandle = (id:number ) => {
    if (window.confirm('本当に削除しますか？')){
      AdminService.deleteOneObject(`${props.page}/${props.id}`)
      .then( (res) => {
        console.log(res)
        if( res.data.status === 200 ){
          history.push(`/admin/${props.page}`)
        } else {
          alert(res.data.msg)
        }
      })
    }

  }
  return(
    <button
      className="btn btn--sm btn--accent"
      onClick={() => deleteHandle(props.id)}
    >
      削除
    </button>
  )
}

/**
 * Given the database date data, convert it to the formatted date. 
 */
export const changeDate = (date:string) => {
    const d = new Date(date)
    const formatDate= `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
    return formatDate
}

