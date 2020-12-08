import * as React from 'react';
import { BrowserRouter as Router,
  Route,
  Switch } from 'react-router-dom';


import Home from './components/home.component'
import NotFound from './components/404.component'


function RouterFunc(props: {}) {
  return (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)}

export default RouterFunc
