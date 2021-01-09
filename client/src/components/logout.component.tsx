import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthService } from '../services/auth.service'
import { Loading } from '../helpers/utils.component'
import Cookies from 'universal-cookie'

/**
 * This structure is for correctly logout.
 */
export const Logout = () => {
  AuthService.logout()
  const [state, setState] = useState(false)
  
  let cookies = new Cookies()
  useEffect(() => {
    while (cookies.getAll().length){
      console.log("waiting.")
      let a =1
    }
    setState(true)
  }, [setState])
  
  if(state){
    window.setTimeout( () => window.location.reload(),1000)
    return <Redirect to="/" />
  } else {
    return <Loading />
  }
}
