import axios from 'axios'
import { authHeader } from './auth-header'
const API_URL = '/api/admin/'


export interface Users {
    status: number
    id: number
    email: string
    crypted_password: string
    salt: string
    created_at: Date
    updated_at: Date
    approval_state: string
    last_login_at: Date
    last_logout_at: Date
    last_login_from_ip_address: string
    family_name: string
    given_name: string
    handle_name: string
    birthday: Date
    email_mobile: string
    admin: boolean
    class_year_id: string
    ml_member_id: number
}

class AdminService {
  static async getUserBoard() {
    return axios.get<{users:Users[], status:number}>
                    (API_URL + 'user', { headers: authHeader() })
  }

  static async getUserDetail(id: number) {
    return axios.get<{user:Users, status:number}>
                    (API_URL + `user/${id}`, {headers: authHeader()})
  }

  static async changeApproveStatus(id: number){
    return axios.get(API_URL + `approve/${id}`, {headers: authHeader()})
    .then( res => {return(res.data)} )
    .catch( err =>  console.log(err))
  }

  static async deleteUser(id: number){
    return axios.get(API_URL + `delete/${id}`, {headers: authHeader()})
    .then( res => {return(res.data)} )
    .catch( err =>  console.log(err))
  }

  static async changeAdminStatus(id: number){
    return axios.get(API_URL + `change-admin/${id}`, {headers: authHeader()})
    .then( res => {return(res.data)} )
    .catch( err =>  console.log(err))
  }
}


export { AdminService }
