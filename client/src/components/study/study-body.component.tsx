import React, { useEffect, useState } from 'react'
import { 
  Route, Switch, Link, Redirect, useHistory 
} from 'react-router-dom'
import Cookies from 'universal-cookie'
import { 
  TableRow, FetchValidation, BackButton, TransitionButton, Loading
} from '../../helpers/utils.component'
import { UserService } from '../../services/user.service'
import { Doc_File, Subject } from '../../entity/study.entity'
import fileDownload from 'js-file-download'

function FileControl(props:{children:any}){
  return(
    <div className="file-control">
      {props.children}
    </div>
  )
}

function FileRow(props:{file: Doc_File, subject:Subject}){
  let file = props.file
  let subject = props.subject
  let cookie = new Cookies()
  let userID = cookie.get('userID')

  return(
    <td>
      <div className="file-row">
        <div className="file-caption">
          {file.file_name}
        </div>
        <div className="file-left-controls">
          <div className="file-controls">
            <FileControl>
              <a 
                href="javascript:;"
                onClick={() => UserService.downloadFile(file, 'download')} 
                download
               >
                <i className="fa fa-floppy-o">
                </i>
                <span>ダウンロード</span>
              </a>
            </FileControl>
            <FileControl>
              <a 
                href="javascript:;" 
                onClick={() => UserService.downloadFile(file, 'preview')} 
                download
               >
                <i className="fa fa-ey">
                </i>
                <span className="hidden-xs"> プレビュー</span>
              </a>
            </FileControl>
            {userID === file.user_id &&
              <FileControl>
                <a>
                  <i className="fa fa-cog">
                  </i>
                  <span>編集</span>
                </a>
              </FileControl>
            }
          </div>
        </div>
        <div className="file-right-controls">
          <FileControl>
            <span className="text-gray">
              {file.download_count}回
            </span>
          </FileControl>
          <FileControl>
            <span className="text-gray">
              {file.user.handle_name}
            </span>
          </FileControl>

        </div>
      </div>
    </td>
  )
}

export function StudySubjectBody(
  props:{files: Doc_File[], kind:string, subject:Subject}
){
  let files = props.files
  let kind = props.kind
  const show1 = kind !== 'personal'
  const show2 = kind !== 'personal' && kind !== 'summary'

  const makeContents = (files: Doc_File[]) => {
    // TO DO : change the way in the end.
      return files.map(file => {
        return(
          <tr>
            <td className="text-center"> {file.class_year}期 </td>
            {show1 && 
              <td className="text-center"> 
                {file.file_code.no_doc} 
              </td>}
            {show2 && 
              <td className="text-center"> 
                {file.file_code.type} 
              </td>} 
            <FileRow file={file} subject={props.subject} />
          </tr>
        )
      }) 
    }
  return(
    <table className="table table--condensed table--bordered">
      <tr>
        <th> 期 </th>
        {show1 && <th> 回 </th>}
        {show2 && <th> 種別 </th> }
        <th> ファイル </th>
      </tr>
      { makeContents(files) }

    </table>
  )
}