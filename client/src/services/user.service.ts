import axios from 'axios'
import { authHeader } from './auth-header'
import { User } from '../entity/user.entity'

const API_URL = '/api/user/'


class UserService {
  static async getProfileBoard(){
    return axios.get<{user:User, status: number}>
                  (API_URL+'profile', {headers: authHeader()})
  }

}

export { UserService }
