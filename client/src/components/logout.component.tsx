import { Redirect } from 'react-router-dom'
import { AuthService } from '../services/auth.service'

export const Logout = () => {
    AuthService.logout()
    window.setTimeout( () => window.location.reload(),1000)
    return(
      <Redirect to="/" />
    )
}
