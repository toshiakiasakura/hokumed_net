import React from 'react'
import { Link, Redirect, Route, Switch } from 'react-router-dom'

function NotFound(){
  return(
    <div className="topfix">
      <h1> 404 - NotFound! </h1>
      <Link to="/">
        サイトトップに戻る
      </Link>
    </div>
  )
}

function AuthError(){
  return(
    <div className="topfix">
      <h1> 401 - Unauthorized Access </h1>
      <Link to="/">
        サイトトップに戻る
      </Link>
    </div>
  )
}

function ErrorPages(){
  return(
    <Switch>
      <Route exact path='/error/404' component={ NotFound } />
      <Route exact path='/error/401' component={ AuthError } />
      <Route component={ () => <Redirect to='/error/404'/>}/> 
    </Switch>
  )

}
export { ErrorPages }
