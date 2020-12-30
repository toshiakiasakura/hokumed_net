import { Link, Redirect, useHistory } from 'react-router-dom'
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
    } else if (  ['誕生日','作成日'].includes(props.rowName) &&
                typeof props.item === 'string') {
      const d = new Date(props.item)
      const birthday = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
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
