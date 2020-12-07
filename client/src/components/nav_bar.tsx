import React from 'react'
import logo from '../img/hokui_logo.png'
import '../style/_navbar.sass'
import { Link } from 'react-router-dom';

type Props = {
  name: string
  path: string
}
/** Function creating navigation item with link.
*/
const NavItem = (Props:Props) =>{
    return (
    <div className="navbar__items__item">
      <Link to={Props.path}>{Props.name}</Link>
    </div>
  )
}

/** Navigation bar for login page
 TO DO: Authentification branching should be implemented.
*/
class Navbar extends React.Component {
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
          <NavItem name="Home" path="/" />
          <NavItem name="STUDY" path="/study" />
          <NavItem name="MAILLIST" path="/maillist" />
          <NavItem name="PROFILE" path="/profile" />
          <NavItem name="ADMIN" path="/admin" />
          <NavItem name="Error" path="/error" />
        </div>
      </div>
    )
  }
}

export {}
export default Navbar
