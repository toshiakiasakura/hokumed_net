import axios from 'axios'
import { authHeader } from './auth-header'
import { User } from '../entity/user.entity'
import { OneClassStatus, MultiClassStatus } from '../helpers/types.helper'
import { url } from 'inspector'
import { FilesSubjectStatus } from '../components/study/study-subject.component'
import fileDownload from 'js-file-download'
import { Doc_File } from '../entity/study.entity' 

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

  static async getFileBoard<T>(url: string){
    return axios.get<FilesSubjectStatus>
      (API_URL + 'multiple/' + url, {headers:authHeader()} )
  }

  static async downloadFile(
    file: Doc_File, type: 'download' | 'preview'
  ){
    console.log("download file.")
    const res = await fetch(`/api/user/file/${file.id}`)
    const blob = await res.blob()
    if(type === 'download'){
      fileDownload(blob, file.file_name)
    } else {
      console.log('preview')
      var fileURL = window.URL.createObjectURL(blob)
      window.open(fileURL, '_blank')
      // fileDownload(blob, file.file_name,undefined ,'open()')
    }
  }
}

export { UserService }
