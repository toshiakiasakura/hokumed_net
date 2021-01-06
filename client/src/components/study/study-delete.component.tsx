import { 
  Route, Switch, Link, Redirect, useHistory 
} from 'react-router-dom'

import { Doc_File, Subject, Class_Year } from '../../entity/study.entity'
import { User } from '../../entity/user.entity'
import { UserService } from '../../services/user.service'

function DeleteButton(props:{back_path:string, id:number}){
  const history = useHistory()
  const deleteHandle = () => {
    if(window.confirm('本当に削除しますか？')){
      UserService.deleteFile(props.id)
      .then( res => {
        if(res.data.status === 200){
          history.push(props.back_path)
        } else if(res.data.status === 201) {
          alert(res.data.msg)
          history.push(props.back_path)
        } else {
          alert(res.data.msg)
        }
        window.setTimeout( () => window.location.reload(),500)
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


export function FileDelete(props:{
  title_en:string, files:Doc_File[], kind:string, id:string
}){
  const history = useHistory()
  let back_path = `/study/${props.title_en}/${props.kind}`

  let filterd = props.files.filter(v => v.id === parseInt(props.id))
  let file = filterd[0]
  if(file === undefined){
    history.push(back_path)
    return(<div></div>)
  } else{
    return(
      <div>
        <a 
          onClick={() => 
            history.push(back_path)
          }
          href="javascript:;"
        >
          一覧に戻る
        </a>
        <h2> {file.file_name} </h2>
        <div className="text-secondary">
          編集する場合は一度，ファイルを削除してから再度アップロードしてください．
        </div>
        <div>
          <ul className="list-inline">
            <li>
              <DeleteButton back_path={back_path} id={file.id}/>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
