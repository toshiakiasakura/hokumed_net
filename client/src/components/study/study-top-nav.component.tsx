import { useEffect, useState } from 'react' 
import { Route, Switch, Link, Redirect} from 'react-router-dom'
import { UserService } from '../../services/user.service'
import { Subject } from '../../entity/study.entity'

import { MatchIDType, OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'

type SubjectsStatus = {
  contents: Subject[], status:number, 
  msg:string, searched: Subject[], value:string
}

export function StudyTop(){
  const [state, setState] = useState<
        SubjectsStatus 
      >( {contents:[], status:0, msg:'', searched:[], value:''})

  useEffect(()=> {
    UserService.getMultipleObjects<Subject>('subject')
    .then(res => {
      setState({
        contents: res.data.contents,
        status: res.data.status,
        msg: res.data.msg,
        searched: state.searched,
        value:state.value
      })
    })
  },[setState])

  /**
   * For input searching by onBlur. 
   */
  const searchSubjects = (v:string) =>{
    let subjects = state.contents.filter(
      subject => subject.title_en.includes(v) || subject.title_ja.includes(v)
    )
    setState({
      contents:state.contents,
      status: state.status,
      msg: state.msg,
      searched:subjects,
      value: v
    })
  }

  /**
   * Display search results.
   */
  const createHit = () => {
    if(state.value === ''){
      return(<div></div>)
    } else if(state.searched.length === 0){
      return(<div>該当する教科は見つかりませんでした．</div>)
    }{
      return(
        <div>
          {`${state.searched.length}件見つかりました．`} 
          <ul>
            { state.searched.map(sub => 
                <li>
                  <Link to={`/study/${sub.title_en}/exam`} >
                    {sub.title_ja}
                  </Link>
                </li>
            )}
          </ul>
        </div>
      )
    }
  }
  
  return(
    <div>
      <h1> 資料トップ </h1>
      <p>
        左のメニューから教科を選んでください．
      </p>
      <h2> 教科を検索する </h2>
      <p>
        履修前の科目も検索することできます．<br/>お探しの教科がメニューに無い場合はご利用ください．
      </p>
      { state.status === 0 || state.searched === undefined
      ? <p className="text-secondary"> 検索準備中 </p>
      :
        <p>
          <input
            type="text"
            className="search"
            placeholder="教科名の日本語 or 英語"
            onChange={v => searchSubjects(v.target.value)}
          />
        </p>
      }
      {createHit()}
    </div>
  )
}
   
const TopNavItem = (props:{url:string, tabName:string} ) => {
  let last = props.url.split('/')
  let l0 = last[last.length -1]
  let cur_last = window.location.href.split('/')
  let l1 = cur_last[cur_last.length -1]
  let l2 = cur_last[cur_last.length -2 ] // for new and edit page.
  let l3 = cur_last[cur_last.length -3 ] // for new and edit page.
  let active_boolean = [l1, l2, l3].includes(l0)
  const tabActive = active_boolean ?  "tab--active" : ""
  return(
    <div className={`tab ${tabActive}`}>
        <Link to={`/study/${props.url}`}> {props.tabName} </Link>
    </div>
  )
}

export function StudyNavVar(props:{title_en:string}){
  return(
    <div className="tabs">
      <TopNavItem url={`${props.title_en}/exam`} tabName="過去問" />
      <TopNavItem url={`${props.title_en}/quiz`} tabName="小テスト"/>
      <TopNavItem url={`${props.title_en}/summary`} tabName="講義資料" />
      <TopNavItem url={`${props.title_en}/personal`} tabName="個人作成資料"/>
    </div>
  )
}
