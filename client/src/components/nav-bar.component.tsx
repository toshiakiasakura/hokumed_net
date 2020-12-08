import React from 'react'
import logo from '../img/hokui_logo.png'
import { Link } from 'react-router-dom';

type PathSet = {
  name: string
  path: string
}
/** Function creating navigation item with link.
*/
const NavItem = (props:PathSet) =>{
    return (
    <div className="navbar__items__item">
      <Link to={props.path}>{props.name}</Link>
    </div>
  )
}

/** Navigation bar for login page
 TO DO: Authentification branching should be implemented.
*/
class NavBar extends React.Component {
  render() {
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
          <NavItem name="HOME" path="/" />
          <NavItem name="STUDY" path="/study" />
          <NavItem name="MAILLIST" path="/maillist" />
          <NavItem name="PROFILE" path="/profile" />
          <NavItem name="ADMIN" path="/admin" />
          <NavItem name="LOGIN" path="/login" />
          <NavItem name="Error" path="/error" />
        </div>
      </div>
    )
  }
}

export {NavBar}
