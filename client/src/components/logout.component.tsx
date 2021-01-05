import { Redirect } from 'react-router-dom'
import { AuthService } from '../services/auth.service'

export const Logout = () => {
    AuthService.logout()
    return(
      <Redirect to="/" />
    )
}
