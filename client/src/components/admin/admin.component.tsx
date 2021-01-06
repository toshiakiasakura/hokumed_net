import { useState, useEffect} from 'react'
import { Route, Switch, Link, Redirect} from 'react-router-dom'
import Cookies from 'universal-cookie'
import { Top } from './admin-top.component'
import { UserPages } from './admin-user.component'
import { SubjectPages } from './admin-subject.component'
import { ClassYearPages } from './admin-year.component'
import { SemesterPages } from './admin-semester.component'
import { NotificationPages } from './admin-notification.component'


const TopNavItem = function(
  props:{
    url:string, tabName:string, state:any, setState:any
  } 
){
  let active = props.url === props.state ? 'tab--active' : ''
  return(
    <div className={`tab ${active}`}>
      <Link to={`/admin/${props.url}`}> 
        {props.tabName} 
      </Link>
    </div>
  )
}

const TopNavVar = () => {
  let urls = window.location.href.split('/')
  let url = '' + urls[urls.length -1]
  url = url=== undefined ? '' : url
  let [state, setState] = useState('/')
  useEffect(() => {setState(url)}, [url])

  return(
    <div className="tabs">
        <TopNavItem url="" tabName="TOP" state={state} setState={setState}/>
        <TopNavItem url="user" tabName="ユーザー" state={state} setState={setState}/>
        <TopNavItem url="year" tabName="学年" state={state} setState={setState}/>
        <TopNavItem url="subject" tabName="教科" state={state} setState={setState}/>
        <TopNavItem url="semester" tabName="学期" state={state} setState={setState}/>
        <TopNavItem url="notification" tabName="お知らせ" state={state} setState={setState}/>
    </div>
  )
}

function Admin(){
  console.log("Try to access admin page.  ")
  const cookies = new Cookies()
  console.log(cookies.getAll())
  if (cookies.get('isLogIn') !== 'true' || cookies.get('isAdmin') !== 'true'){
    return( <Redirect to='/error/401' />)
  }
  return(
    <div className="topfix container">
      <TopNavVar />
      <Switch>
        <Route exact path='/admin' component={Top} />
        <Route path='/admin/user' component={ UserPages } />
        <Route path='/admin/subject' component={ SubjectPages } />
        <Route path='/admin/year' component={ ClassYearPages } />
        <Route path='/admin/semester' component={ SemesterPages } />
        <Route path='/admin/notification' component={ NotificationPages } />
        <Route component={() => <Redirect to='/error/404'/>} />
      </Switch>
    </div>
  )
}
export { Admin }
