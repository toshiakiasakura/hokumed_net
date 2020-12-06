import * as React from 'react';
import { BrowserRouter as Router,
  Route,
  Switch } from 'react-router-dom';


import Home from './components/Home'
import NotFound from './components/404'


export default function RouterFunc(props: any):any {
  return (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)}
