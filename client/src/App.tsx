import React, { Component } from 'react'
import { BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Login } from './components/login.component'
import { Home, NotificationPages } from './components/home-notification.component'
import { Admin } from './components/admin/admin.component'
import { SignUp } from './components/signup.component'
import { Study } from './components/study/study.component'
import { ErrorPages } from './components/error.component'
import { NavBar } from './components/nav-bar.component'
import { Logout } from './components/logout.component'
import { ProfilePages } from './components/profile.component'
import { ResetPassword } from './components/reset-password.component'
import { VerificationPage } from './components/verification.component'
import './style/_index.sass'


const site_description = "旧北医ネット(hokui.net)からの移行先の北医ネット(hokumed.net)です．"

class App extends Component{
  render() {
    return (
    <Router>
      <Helmet >
        <title> 北医ネット - HOKUMED.NET </title>
        <meta name="description" content={site_description} />
      </Helmet>
      <NavBar />

      <Switch>
        <Route exact path='/' component={ Login } />
        <Route exact path='/login' component= {() => <Redirect to='/' />} />
        <Route exact path='/home' component={ Home } />
        <Route path='/notification' component={ NotificationPages } />
        <Route path='/study' component={ Study } />
        <Route path='/profile' component={ ProfilePages } />
        <Route path='/admin' component={ Admin } />
        <Route exact path='/signup' component={ SignUp } />
        <Route exact path='/logout' component= { Logout } />
        <Route exact path='/reset-password' component= { ResetPassword } />
        <Route path='/verify' component= { VerificationPage } />
        <Route path='/error' component={ ErrorPages } />
        <Route component={() => <Redirect to='/error/404' />}/>
      </Switch>
    </Router>
  )}
}

export default App
