import React from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie'

type PathSet = {
  name: string
  path: string
}
/**
 *  Function creating navigation item with link.
 */
const NavItem = (props:PathSet) =>{
    return (
    <div className="navbar__items__item" id={props.name}>
      <Link to={props.path}>{props.name}</Link>
    </div>
  )
}

/**
 * Navigation bar for login page.
 */
function NavBar(){
  const cookies = new Cookies()
  const isLogIn = cookies.get('isLogIn') === 'true'
  const isAdmin = cookies.get('isAdmin') === 'true'
  console.log('navigation bar state.',cookies.get("isAdmin"))

  return( 
    <div className="navbar">
      <Link to='/'>
        <a className="navbar__brand">
            H<span className="text-accent">O</span>KUMED.NET
        </a>
      </Link>

      {/*TO DO: Make page site for each link.*/}
      <div className="navbar__items">
        {isLogIn && <NavItem name="HOME" path="/home" /> }
        {isLogIn && <NavItem name="STUDY" path="/study" /> }
        {isLogIn && <NavItem name="PROFILE" path="/profile" /> }
        {isLogIn && isAdmin && <NavItem name="ADMIN" path="/admin" /> }
        {isLogIn && <NavItem name="LOGOUT" path="/logout" /> }
        {!isLogIn && <NavItem name="LOGIN" path="/" /> }
        {!isLogIn && <NavItem name="SIGNUP" path="/signup" /> }
        {/* <NavItem name="ERROR" path="/error" />  Later delete this line.*/}
      </div>
    </div>
  )
}

export {NavBar}
