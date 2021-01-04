import React from 'react'
import { Link, Redirect, Route, Switch } from 'react-router-dom'

function ErrorPage( props:{title:string} ){
  return(
    <div className="topfix">
      <h1> {props.title} </h1>
      <Link to="/">
        サイトトップに戻る
      </Link>
    </div>
  )
}

function ErrorPages(){
  return(
    <Switch>
      <Route exact path='/error/404' 
        component={ () => <ErrorPage title="404 - Not Found!"/>} 
      />
      <Route exact path='/error/401' 
        component={ () => <ErrorPage title="401 - Not Authorized"/>} 
      />
      <Route exact path='/error/204' 
        component={ () => <ErrorPage title="204 - No Content"/>} 
      />
      <Route component={ () => <Redirect to='/error/404'/>}/> 
    </Switch>
  )

}
export { ErrorPages }
