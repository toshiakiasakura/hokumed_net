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
