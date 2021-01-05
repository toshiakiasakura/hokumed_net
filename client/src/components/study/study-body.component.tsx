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
import { 
  sortValue, groupby, groupbyDeep, sortArray, sortNoDoc 
} from '../../helpers/sort.helper'

function FileControl(props:{children:any}){
  return(
    <div className="file-control">
      {props.children}
    </div>
  )
}

function FileDownloadPart(props:{file: Doc_File, subject:Subject}){
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

/**
 * @param files_year files grouped by year.
 * @param index_year index of grouping by year.
 * @param files_no files grouped by no_doc. Only use exam, quiz, summary.
 * @param index_no index of grouping by no_doc.
 */
function FileRow(
  props:{
    file: Doc_File,
    files_year: Doc_File[], index_year:number, 
    show1:boolean, show2:boolean, subject: Subject,
    files_no?: Doc_File[], index_no?: number,
    files_type?: Doc_File[], index_type?:number,
  }
){
  let file = props.file
  let index_year = props.index_year
  let index_no = props.index_no 
  let index_type = props.index_type
  let files_no = props.files_no
  let files_type = props.files_type

  let NoDocRowSpan = files_no ? files_no.length : 1 
  let show1_2 = index_no ? index_no === 0 : true
  let KindRowSpan = files_type ? files_type.length : 1
  let show2_2 = index_type ? index_type === 0 : true
  return(
    <tr>
      {index_year === 0 && 
        <td className="text-center" rowSpan={props.files_year.length} > 
          {props.files_year[0].class_year}期 
        </td>
      }
      {props.show1 &&  show1_2 &&
         <td className="text-center" rowSpan={NoDocRowSpan}> 
            {file.file_code.no_doc} 
          </td>
        }
      {props.show2 &&  show2_2 && 
        <td className="text-center" rowSpan={KindRowSpan}> 
          {file.file_code.type} 
        </td>} 
      <FileDownloadPart file={file} subject={props.subject} />
    </tr>
  )

}

type SortFileFunc = (
  files: Doc_File[], subject:Subject,
  show1: boolean, show2: boolean, kind:string
) => any[]

/**
 * Algorithm of this function is just grouping by 
 * term, no_doc and kind step by step. 
 * Pass the index  
 */
const SortFiles: SortFileFunc = function(
  files , subject, show1, show2, kind
){
  let group_year= groupby(files, 'class_year') 
  let content = [<a></a>] // a is for type purpose.

  let year_keys = sortArray(Object.keys(group_year), 'number', false)
  year_keys.forEach((year_key) => {
    let files_year: Doc_File[] = group_year[year_key]
    if(kind === 'personal'){
      files_year.forEach((file, index_year) => {
        content.push(
          <FileRow 
            file={file} 
            show1={show1} show2={show2} subject={subject}
            files_year ={files_year} index_year={index_year}
          />
        )
      })
      return content
    }
    let group_no = groupbyDeep(files_year, 'file_code', 'no_doc')
    let no_keys = sortNoDoc(Object.keys(group_no), true)
    no_keys.forEach( (no_key, index_year) => {

      let files_no: Doc_File[] = group_no[no_key]
      if(kind === 'summary'){
        files_no.forEach( (file, index_no) =>{
          content.push(
            <FileRow 
              file={file}
              show1={show1} show2={show2} subject={subject}
              files_year={files_year} index_year={index_year + index_no}
              files_no={files_no} index_no={index_no}
            />
          )
        })
        return content
      }

      let group_type = groupbyDeep(files_no, 'file_code', 'type')
      let type_keys = sortNoDoc(Object.keys(group_type), true)
      type_keys.forEach( (type_key, index_no ) => {
        let files_type: Doc_File[] = group_type[type_key]
        files_type.forEach((file, index_type) => {
          content.push(
            <FileRow 
              file={file}
              show1={show1} show2={show2} subject={subject}
              files_year={files_year} index_year={index_year + index_no + index_type}
              files_no={files_no} index_no={index_no + index_type}
              files_type={files_type} index_type={index_type}
            />
          )

        })

      })
    }) 
  })

  return content
}


export function StudySubjectBody(
  props:{
    files: Doc_File[],  
    subject:Subject, 
    title_en:string,
    kind:string

  }
){
  const history = useHistory()
  let files = props.files
  let kind = props.kind
  let title_en = props.title_en
  const show1 = kind !== 'personal'
  const show2 = kind !== 'personal' && kind !== 'summary'
  return(
    <React.Fragment>
      <p>
        <button 
          className="btn btn--sm btn--primary"
          onClick={() => history.push(`/study/${title_en}/${kind}/new`)}
        > 
          新規アップロード
        </button>

      </p>

      {files.length 
        ?
          <table className="table table--condensed table--bordered">
            <tr>
              <th> 期 </th>
              {show1 && <th> 回 </th>}
              {show2 && <th> 種別 </th> }
              <th> ファイル </th>
            </tr>
            { SortFiles(files, props.subject, show1, show2, kind) }
          </table>
        : "資料がまだ投稿されていません．"
      }
    </React.Fragment>
  )
}