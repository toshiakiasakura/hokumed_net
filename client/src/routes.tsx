import * as React from 'react';
import { BrowserRouter as Router,
  Route,
  Switch } from 'react-router-dom';


import Home from './pages/home'
import NotFound from './pages/404'


export default function RouterFunc(props: any):any {
  return (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)}
