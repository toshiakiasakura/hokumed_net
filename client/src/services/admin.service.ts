import axios from 'axios'
import {authHeader } from './auth-header'
const API_URL = 'http://localhost:3000/api/admin/'


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
  static getUserBoard() {
    return axios.get<Users[]>(API_URL + 'user')
  }

  static getUserDetail(id: number) {
  return axios.get<Users>(API_URL + `user/${id}`)
  }
}


export { AdminService }
