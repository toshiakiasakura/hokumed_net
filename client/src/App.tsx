import React, {Component} from 'react';
import { BrowserRouter as Router,
  Route,
  Switch,
  Redirect} from 'react-router-dom';
import {Home} from './components/home.component'
import {Login} from './components/login.component'
import {NotFound} from './components/404.component'
import {NavBar} from './components/nav-bar.component'
import './style/_index.sass'


class App extends Component{
  render() {
    return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route exact path="/error" component={NotFound} />
        <Route component={() => <Redirect to="error" />}/>
      </Switch>
    </Router>
  )}
}

export default App
