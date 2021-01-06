import axios from 'axios'
import { authHeader } from './auth-header'
import { OneClassStatus, MultiClassStatus } from '../helpers/types.helper'

const API_URL = '/api/admin/'

class AdminService {
  static async changeApproveStatus(id: number){
    return axios.get(API_URL + `user/approve/${id}`)
    .then( res => {return(res.data)} )
    .catch( err =>  console.log(err))
  }

  static async changeAdminStatus(id: number){
    return axios.get(API_URL + `user/change-admin/${id}`)
    .then( res => {return(res.data)} )
    .catch( err =>  console.log(err))
  }

  /**
   * Fetch one object data. 
   * @param url /api/admin/one/url is inputted here.
   */
  static async getOneObject<T>(url:string){
    return axios.get<OneClassStatus<T>> (API_URL + 'one/' + url)
  }

  /**
   * Fetch multiple objects data.
   * @param url /api/admin/multiple/${url} is inputted here.
   */
  static async getMultipleObjects<T>(url:string){
    return axios.get<MultiClassStatus<T>> (API_URL +'multiple/'+  url)
  }

  /**
   * Edit or create new object. 
   * url should start with edit or new. 
   * @param url /api/admin/${url} is inputted here.
   * @param data one object information. User, Class_Year, etc...
   */
  static async editOneObject(url:string, data:any){
    return axios.post(API_URL + url, data )
  }

  static async deleteOneObject(url:string ){
    return axios.get< {status:number, msg:string} >(API_URL + url)
  }
}


export { AdminService }
