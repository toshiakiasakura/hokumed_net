import axios from 'axios'
import { authHeader } from './auth-header'
import { User } from '../entity/user.entity'
import { OneClassStatus, MultiClassStatus } from '../helpers/types.helper'
import { url } from 'inspector'

const API_URL = '/api/user/'


class UserService {
  /**
   * Since profile page does not contain id information in its path, 
   * specific API is prepared in backend. 
   * user id information is extracted from the cookie, which is in 
   * return value of authHeader function. 
   */
  static async getProfileBoard(){
    return axios.get<OneClassStatus<User>>
                  (API_URL+'profile', {headers: authHeader()})
  }

  /**
   * User version of getMultipleObjects. 
   * Expected return is filtered by userID.
   * @param url /api/user/multiple/${url} is inputted here.
   */
  static async getMultipleObjects<T>(url: string){
    return axios.get<MultiClassStatus<T>>
      (API_URL + 'multiple/' + url, {headers:authHeader()} )
  }
}

export { UserService }
