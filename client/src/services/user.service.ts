import axios from 'axios'
import {serialize} from 'object-to-formdata'

import { authHeader } from './auth-header'
import { User } from '../entity/user.entity'
import { OneClassStatus, MultiClassStatus, FileFormData } from '../helpers/types.helper'
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
                  (API_URL+'profile' )
  }

  /**
   * User version of getMultipleObjects. 
   * Expected return is filtered by userID.
   * @param url /api/user/multiple/${url} is inputted here.
   */
  static async getMultipleObjects<T>(url: string){
    return axios.get<MultiClassStatus<T>>
      (API_URL + 'multiple/' + url )
  }

  static async getFileBoard<T>(url: string){
    return axios.get<FilesSubjectStatus>
      (API_URL + 'multiple/' + url)
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

  static async sendFiles(data:FileFormData, title_en:string){
    console.log("sending files.aaaaaaaaaaaaaaaaaaaaaaa")
      let uploadData = new FormData()
      for(let i=0; i < data.files.length; i++){
        uploadData.append('upload', data.files[i])
        uploadData.append('class_year', data.class_year)
        uploadData.append('comment', data.comment)
        uploadData.append('code_radio', data.code_radio)
        uploadData.append('no_doc', data.no_doc)
        uploadData.append('test_kind', data.test_kind)
        uploadData.append('subject_title_en', title_en)
      }
      console.log(uploadData)
      const config = {headers:{'Content-Type': 'multipart/form-data'}}

    return axios.post<{status:number, msg:string}>
      ( '/api/user/upload/file', uploadData, )
  }
}

export { UserService }
