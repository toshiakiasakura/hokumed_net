import React, {Component} from 'react';
import { BrowserRouter as Router,
  Route,
  Switch } from 'react-router-dom';
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
        <Route component={NotFound} />
      </Switch>
    </Router>
  )}
}

export default App
