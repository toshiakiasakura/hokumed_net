import { Redirect } from 'react-router-dom'
import { AuthService } from '../services/auth.service'

export const Logout = () => {
    AuthService.logout()
    // To realod the cookie..
    window.setTimeout( () => window.location.reload(),500)
    return(
      <Redirect to="/" />
    )
}
