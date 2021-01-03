import React, { Component } from 'react';
import { BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { Login } from './components/login.component'
import { Home, NotificationPages } from './components/home-notification.component'
import { Admin } from './components/admin/admin.component'
import { SignUp } from './components/signup.component'
import { Study } from './components/study/study.component'
import { NotFound } from './components/404.component'
import { NavBar } from './components/nav-bar.component'
import { Logout } from './components/logout.component'
import { Profile } from './components/profile.component'
import { ResetPassword } from './components/reset-password.component'
import { VerificationPage } from './components/verification.component'
import './style/_index.sass'


class App extends Component{
  render() {
    return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path='/' component={ Login } />
        <Route exact path='/login' component= {() => <Redirect to='/' />} />
        <Route exact path='/home' component={ Home } />
        <Route path='/notification' component={ NotificationPages } />
        <Route path='/study' component={ Study } />
        <Route path='/profile' component={ Profile } />
        <Route path='/admin' component={ Admin } />
        <Route exact path='/signup' component={ SignUp } />
        <Route exact path='/logout' component= { Logout } />
        <Route exact path='/reset-password' component= { ResetPassword } />
        <Route path='/verify' component= { VerificationPage } />
        <Route exact path='/error' component={ NotFound } />
        <Route component={() => <Redirect to='error' />}/>
      </Switch>
    </Router>
  )}
}

export default App
