import React from 'react'
import logo from "../img/hokui_logo.png"
import { Link, useHistory } from 'react-router-dom';

type props= {
  name: string
  path: string
}
class NavItem extends React.Component<props> {
  constructor(props:props){
    super(props)
    const history = useHistory()
  }

  render() {
    return (
    <button className="nav__items">{this.props.name}
    </button>
  )}
}
