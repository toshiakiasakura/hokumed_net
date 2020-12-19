import axios from 'axios'
import { authHeader } from './auth-header'
import { Users } from './admin.service'

const API_URL = '/api/user/'


class UserService {
  static async getProfileBoard(){
    return axios.get<{user:Users, status: number}>
                  (API_URL+'profile', {headers: authHeader()})
  }
  
}

export { UserService }
