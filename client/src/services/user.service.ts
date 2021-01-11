import axios from 'axios'

import { User } from '../entity/user.entity'
import { Subject } from '../entity/study.entity'
import { 
  OneClassStatus, MultiClassStatus, 
  StatusMsg, Form
} from '../helpers/types.helper'
import { FilesSubjectStatus } from '../helpers/types.helper'
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
  static async getProfileBoard(setState:any){
    return axios.get<OneClassStatus<User>>(API_URL+'profile' )
      .then( res => {
        console.log(res)
        setState({
          content: res.data.content, 
          status: res.data.status,
          msg: res.data.msg
        })
      })
  }

  static async editProfile(data:any){
    return axios.post<StatusMsg>(API_URL +'profile/edit', data)
  }

  static async ChangePassword(data:any){
    return axios.post<StatusMsg>(API_URL +'profile/password', data)
  }

  /**
   * User version of getMultipleObjects. 
   * Expected return is filtered by userID.
   * @param url /api/user/multiple/${url} is inputted here.
   */
  static async getMultipleObjects<T>(url: string, setState:any){
    return axios.get<MultiClassStatus<T>>
      (API_URL + 'multiple/' + url )
      .then( res => {
        setState((prev:any) => ({
          ...prev,
          contents: res.data.contents, 
          status: res.data.status,
          msg: res.data.msg
        }))
        return res
      })
  }


  /**
   * User version of getOneObject. 
   * Expected return is filtered by userID.
   * @param url /api/user/one/${url} is inputted here.
   */
  static async getOneObject<T>(url:string, setState:any){
    return axios.get<OneClassStatus<T>> (API_URL + 'one/' + url)
    .then(res =>{
      setState((prev:any) => ({
        ...prev,
        content: res.data.content,
        status: res.data.status,
        msg: res.data.msg
      }))
    })
    .catch(err => console.log(err))
  }

  static async getFileBoard(url: string){
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

  static async sendFiles(
    data:Form['File'], subject:Subject, 
    page_kind:string, files: File[]
  ){
    let uploadData = new FormData()
    for(let i=0; i < files.length; i++){
      uploadData.append('upload', files[i])
      // userID is taken from cookie.
      uploadData.append('subject_id', String(subject.id) )
      uploadData.append('class_year', data.class_year)
      uploadData.append('comment', data.comment)
      uploadData.append('code_radio', data.code_radio)
      uploadData.append('no_doc', data.no_doc)
      uploadData.append('test_kind', data.test_kind)
      uploadData.append('subject_title_en', subject.title_en)
      uploadData.append('page_kind', page_kind)
    }
    console.log(uploadData)
    const config = {headers:{'Content-Type': 'multipart/form-data'}}

    return axios.post<StatusMsg>
      ( '/api/user/upload/file', uploadData, config )
  }

  /**
   * File deletion can do only userID matched person or admin. 
   */
  static async deleteFile(id: number){
    return axios.get<StatusMsg>(`/api/user/delete/file/${id}`)
  }
}

export { UserService }
