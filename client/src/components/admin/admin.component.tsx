import { Route, Switch, Link, Redirect} from 'react-router-dom'
import { NotFound } from '../404.component'
import Cookies from 'universal-cookie'
import { Top } from './admin-top.component'
import { UserBoard, UserDetail } from './admin-user.component'
import { SubjectPages } from './admin-subject.component'
import { ClassYearPages } from './admin-year.component'
import { SemesterBoard } from './admin-semester.component'
import { NotificationPages } from './admin-notification.component'


const TopNavItem = (props:{url:string, tabName:string} ) => {
  return(
    <div className="tab">
      <Link to={`/admin/${props.url}`}> {props.tabName} </Link>
    </div>
  )
}

const TopNavVar = () => {
  return(
    <div className="tabs">
        <TopNavItem url="" tabName="TOP" />
        <TopNavItem url="user" tabName="ユーザー" />
        <TopNavItem url="year" tabName="学年" />
        <TopNavItem url="subject" tabName="教科" />
        <TopNavItem url="semester" tabName="学期" />
        <TopNavItem url="notification" tabName="お知らせ" />
    </div>
  )
}

const Admin = () => {
  console.log("Try to access admin page.  ")
  const cookies = new Cookies()
  console.log(cookies.getAll())
  if (cookies.get('isLogIn') !== 'true' || cookies.get('isAdmin') !== 'true'){
    return( <Redirect to='/error' />)
  }
  return(
    <div className="topfix container">
      <TopNavVar />
      <Switch>
        <Route exact path='/admin' component={Top} />
        <Route exact path='/admin/user' component={UserBoard} />
        <Route path='/admin/user/:id' component={UserDetail}/>
        <Route path='/admin/subject' component={ SubjectPages } />
        <Route path='/admin/year' component={ ClassYearPages } />
        <Route exact path='/admin/semester' component={SemesterBoard} />
        <Route path='/admin/notification' component={ NotificationPages } />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
export { Admin }
