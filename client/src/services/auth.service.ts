import axios from "axios";
import Cookies from 'universal-cookie'

const API_URL = '/api/user/'
type String = string | null
type Token = {accessToken:string,
              userID:number,
              status: number,
              msg:string,
              admin: boolean}

class AuthService {
  static login(email: String, password: String) {
    return axios
      .post<Token>
          (API_URL + "login", { email, password })
      .then((response) => {
        console.log("autho.service.ts: post method succeded!!")
        console.log(response)
        if (response.data
            && response.data.accessToken
            && response.data.userID){
          const cookies = new Cookies()
          const options = {path:'/', maxAge:3600}
          cookies.set('accessToken', response.data.accessToken,options)
          cookies.set('userID', response.data.userID, options)
          cookies.set('isLogIn', 'true', options)
          cookies.set('isAdmin', response.data.admin ? 'true' : 'false')
          console.log(cookies.getAll())
        }
        return response.data

      })
      .catch((err) => {
          console.log(API_URL+'login')
          console.log('axios post method failure in auth.service.ts')
          console.log(err)
      })
  }

  static logout() {
    localStorage.removeItem("user")
  }

  static signup(data: any) {
    return axios.post(API_URL + "signup", data)
    .then((response) => {
      return(response.data)
    })
    .catch((err) => {
      console.log('axios signup failure')
      console.log(err)
    })
  }
}

export {AuthService}
