import React, { Component } from 'react';
import { BrowserRouter as Router,
  Route,
  Switch,
  Redirect} from 'react-router-dom';
import { Login } from './components/login.component'
import { Home } from './components/home.component'
import { SignUp } from './components/signup.component'
import { NotFound } from './components/404.component'
import { NavBar } from './components/nav-bar.component'
import './style/_index.sass'


class App extends Component{
  render() {
    return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/login' component= {() => <Redirect to='/' />} />
        <Route path='/home' component={Home} />
        <Route path='/signup' component={ SignUp } />
        <Route exact path='/error' component={NotFound} />
        <Route component={() => <Redirect to='error' />}/>
      </Switch>
    </Router>
  )}
}

export default App
