import axios from "axios";
import Cookies from 'universal-cookie'
import { MultiClassStatus } from '../helpers/types.helper'

const API_URL = '/api/auth/'
type Token = {accessToken:string,
              userID:number,
              status: number,
              msg:string,
              admin: boolean}

class AuthService {
  static async login(
    email: string, password: string, keepLogin: boolean
  ){
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
          // maxAge undefined meaning while session.  
          const options = {
            path:'/', 
            maxAge:keepLogin ? 3600*24*7: undefined
          }
          cookies.set('accessToken', response.data.accessToken,options)
          cookies.set('userID', response.data.userID, options)
          cookies.set('isLogIn', 'true', options)
          cookies.set('isAdmin', response.data.admin ? 'true' : 'false', options)
          cookies.set('editFile', 'false', options)
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
    console.log('Logout function running.')
    const cookies = new Cookies()
    const cookies_dict = cookies.getAll()
    Object.keys(cookies_dict).forEach( key => {
      cookies.set(key, null, {maxAge:0})
    })
  }

  /**
   * Post data to backend.
   * @param data If try to specify param. you should import SignUpData type
   *             from signup.component.tsx. It will be circular dependent,
   *             so that here we set any for type declaration.
   */
  static async signup(data: any) {
    return axios.post(API_URL + "signup", data)
    .then((response) => {
      return(response.data)
    })
    .catch((err) => {
      console.log('axios signup failure')
      console.log(err)
    })
  }

  /**
   * When email is inputted, ask backend server for duplication
   * of the name.
   * @return true or error message. Used for react-hook-form.
   */
  static async checkEmail(email: string){
    console.log("AdminService.checkEmail process starts.")
    const reg = /^[A-Z0-9._%+-]+@(eis|elms).hokudai.ac.jp$/i
    if (!reg.test(email)){
      return("@以下は(elms or eis).hokudai.ac.jpのみ有効です．")
    }
    const data = await axios.post(API_URL + "check-email", {email} )
        .then(res => {
          return(res.data.status === 200 ? true : res.data.msg)
        })
        .catch((err) => {
          console.log('axios checkEmail failure')
          console.log(err)
        })
    return(data)
  }

  /**
   * When handle name is inputted, ask backend server for duplication
   * of the name.
   * @return true or error message. Used for react-hook-form.
   */
  static async checkHandle(handle: string){
    console.log("AdminService.checkHandle process starts.")
    const data = await axios.post(API_URL + "check-handle", {handle})
      .then(res => {
        return(res.data.status === 200 ? true : res.data.msg)
      })
      .catch((err) => {
        console.log('axios checkHandle failure')
        console.log(err)
      })
    return(data)
  }

  static async resetPassword(email: string, password: string){
    return axios.post<{status:number, msg:string}>
              (API_URL + "reset-password", {email, password})
      .then(res=>{
        return(res)
      })
      .catch((err) => {
        console.log('axios ResetPassword failure')
        console.log(err)
      })
  }

  static async ClassYearBoard<T>(setState:any){
    return axios.get<MultiClassStatus<T>>(API_URL + 'multiple/year')
      .then(res=>{
        setState({
          contents: res.data.contents,
          status: res.data.status,
          msg: res.data.msg
        })
      })
  }
}

export { AuthService }
