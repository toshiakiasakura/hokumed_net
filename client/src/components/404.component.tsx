import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => (
  <div>
    <h1> 404 - NotFound! </h1>
    <Link to="/">
      サイトトップに戻る
    </Link>
  </div>
)

export {NotFound}
