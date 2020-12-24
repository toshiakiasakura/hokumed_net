import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'

export const Logout = () => {
    console.log('Logout function running.')
    const cookies = new Cookies()
    for(let item of ['isLogIn','isAdmin', 'accessToken', 'userID']){
      cookies.set(item, null, {maxAge:0})
    }
    // To realod the cookie..
    window.setTimeout( () => window.location.reload(),500)
    return(
      <Redirect to="/" />
    )
}
