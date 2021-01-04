import { SocialSentimentSatisfied } from 'material-ui/svg-icons';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie'

/**
 *  Function creating navigation item with link.
 */
const NavItem = function(
  props:{
    name:string, path:string, 
    state:any, setState:any 
  }
){
  const onClick = () => {
    props.setState(props.path)
  }
  let active = props.path === props.state ? 'navbar__items__item--active' : ''
  return (
    <div className={`navbar__items__item ${active}`} id={props.name}>
      <Link to={props.path} onClick={()=>onClick()}>
         {props.name}
      </Link>

    </div>
  )
}

/**
 * Navigation bar for login page.
 */
function NavBar(){
  let urls = window.location.href.split('/')
  let url = '/' + urls[urls.length -1]
  url = url=== undefined ? '/' : url
  let [state, setState] = useState('/')
  useEffect(() => {setState(url)}, [url])

  const cookies = new Cookies()
  const isLogIn = cookies.get('isLogIn') === 'true'
  const isAdmin = cookies.get('isAdmin') === 'true'

  return( 
    <div className="navbar">
      <Link to='/'>
        <a className="navbar__brand">
            H<span className="text-accent">O</span>KUMED.NET
        </a>
      </Link>

      {/*TO DO: Make page site for each link.*/}
      <div className="navbar__items">
        {isLogIn && <NavItem name="HOME" path="/home" state={state} setState={setState} /> }
        {isLogIn && <NavItem name="STUDY" path="/study" state={state} setState={setState}  /> }
        {isLogIn && <NavItem name="PROFILE" path="/profile" state={state} setState={setState}  /> }
        {isLogIn && isAdmin && <NavItem name="ADMIN" path="/admin" state={state} setState={setState} /> }
        {isLogIn && <NavItem name="LOGOUT" path="/logout" state={state} setState={setState} /> }
        {!isLogIn && <NavItem name="LOGIN" path="/" state={state} setState={setState} /> }
        {!isLogIn && <NavItem name="SIGNUP" path="/signup" state={state} setState={setState}/> }
        {/* <NavItem name="ERROR" path="/error" />  Later delete this line.*/}
      </div>
    </div>
  )
}

export {NavBar}
