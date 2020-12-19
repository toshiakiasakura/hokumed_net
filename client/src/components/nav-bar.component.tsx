import React from 'react'
import logo from '../img/hokui_logo.png'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie'

type PathSet = {
  name: string
  path: string
}
/** Function creating navigation item with link.
*/
const NavItem = (props:PathSet) =>{
    return (
    <div className="navbar__items__item" id={props.name}>
      <Link to={props.path}>{props.name}</Link>
    </div>
  )
}


/** Navigation bar for login page
 TO DO: Authentification branching should be implemented.
*/
class NavBar extends React.Component {
  render() {
    const cookies = new Cookies()
    const isLogIn = cookies.get('isLogIn') === 'true'
    const isAdmin = cookies.get('isAdmin') === 'true'
    console.log('navigation bar state.',cookies.get("isAdmin"))
    return(
      <div className="navbar">
        {/*TO DO: Change logo to text font.
          The following is original part in jade file.
          a.navbar__brand(ui-sref="home")
            | H
            span.text-accent O
            | KUI.NET
          */}
        <img src={logo} className="navbar__brand" alt="logo" />

        {/*TO DO: Make page site for each link.*/}
        <div className="navbar__items">
          {isLogIn && <NavItem name="HOME" path="/home" /> }
          {isLogIn && <NavItem name="STUDY" path="/study" /> }
          {isLogIn && <NavItem name="PROFILE" path="/profile" /> }
          {isAdmin && <NavItem name="ADMIN" path="/admin" /> }
          {isLogIn && <NavItem name="LOGOUT" path="/logout" /> }
          {!isLogIn && <NavItem name="LOGIN" path="/" /> }
          {!isLogIn && <NavItem name="SIGNUP" path="/signup" /> }
          {/* <NavItem name="ERROR" path="/error" />  Later delete this line.*/}
        </div>
      </div>
    )
  }
}

export {NavBar}
