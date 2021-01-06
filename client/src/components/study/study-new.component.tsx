import React, { useEffect, useState } from 'react'
import { Route, Switch, Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { AdminService } from '../../services/admin.service'
import {
   TableRow, FetchValidation, BackButton, 
   Loading, TransitionButton
} from '../../helpers/utils.component'
import { MatchIDType, OneClassStatus, MultiClassStatus } from '../../helpers/types.helper'
import { FormRow, createClassYearOptions } from '../../helpers/form.component'
import { Subject, Doc_File, Class_Year } from '../../entity/study.entity'
import { sortValue } from '../../helpers/sort.helper'
import { UserService } from '../../services/user.service'
import { CodeBlock, FileForm } from './study-form.component' 
import { FileFormData } from '../../helpers/types.helper'

/**
 * Whole form component is defined here.  
 */
function StudyFormBody(
  props:{years:Class_Year[], kind:string, subject:Subject}
){
  // State is prepared for FileForm. 
  // When choicing name should be uploaded.
  const [state, setState] = useState<File[]>([])

  let years = sortValue(props.years, 'year', false) as Class_Year[]
  const { register, handleSubmit, errors, 
        formState, control, watch 
      } = useForm<FileFormData>({
        mode:'onBlur', 
        defaultValues:{
          class_year: `${years[0].year}`, 
          code_radio: '問題',
          test_kind:'本試'}
      })
  
  // Create button title part.
  let files = watch('files')
  let class_year = watch('class_year')
  let test_kind = watch('test_kind')
  let btn_title = `「${class_year}期の${props.subject.title_ja}の${test_kind}の問題をアップロード」`
  
  /**
   * Send files to backend.  
   */
  const history = useHistory()
  const sendFiles = (data: FileFormData) => {
    console.log("##### send files", data)
    if(!data.files.length){
      alert('ファイルが選択されていません．')
    } else {
      UserService.sendFiles(data, props.subject.title_en)
      .then( res => {
        console.log('file sent')
        alert(res.data.msg)
        history.push(`/study/${props.subject.title_en}/${props.kind}`)
      })
      .catch(err => {console.log(err)})
    } 
  }

  return(
    <form
      name="uploadFile"
      onSubmit={handleSubmit(sendFiles)}
    >

      <div className="form__group">
        <label className="form__label">
          期　&nbsp;  <span className="text-accent">*必須 </span>
        </label>
        <div>
          <select
            className="form__control"
            name="class_year"
            ref={register({
              validate: (v:string) =>{
                return( !isNaN(parseInt(v)) || "入力必須項目です")
              }
            })}
          >
            {createClassYearOptions(props.years)}
          </select>
        </div>
      </div>
      <div className="form__group">
        <label className="form__label">
          説明　&nbsp;  <span className="text-secondary">*任意 </span>
        </label>
        <div>
          <input
            className="form__control"
            type="text"
            name="comment"
            id="docUploadComments"
            placeholder="資料に関する説明などあれば入力してください．"
            ref={register}
          >
          </input>
        </div>
        <CodeBlock kind={props.kind} register={register} />
        <FileForm register={register} files={files} setState={setState}/>
      </div>
      <div className="panel__foot row">
        <button 
          className="btn btn--block btn--primary"
          type="submit"
          disabled={!formState.isValid}
        >
          {btn_title}
        </button>
      </div>
    </form>
  )
}

function StudyNew(
  props:{
    files: Doc_File[], subject:Subject, 
    kind:string, years: Class_Year[], title_en:string
  }
){
  const subject = props.subject
  const kind = props.kind

  const createTitle = () => {
    let rep_dic :{[index:string]:string} = {
      exam:'過去問', quiz:'小テスト',
      summary:'講義資料', personal:'個人作成資料'
    }
    let kind_ja = rep_dic[kind]
    return(
      <h4 className="panel__head__title">
        <span className="text-secondary">{subject.title_ja}</span>
        の
        <span className="text-secondary">{kind_ja}</span>
        をアップロード
      </h4>
    )
  }

  const history = useHistory()
  return(
    <div>
        <a 
          onClick={() => history.push(`/study/${props.title_en}/${kind}`)}
          href="javascript:;"
        >
          一覧に戻る
        </a>
        <div className="panel">
          <div className="panel__head">
            { createTitle() }
          </div>
          <div className="panel__body">
            <StudyFormBody years={props.years} kind={kind} subject={subject} />
          </div>
        </div>
    </div>
  )
}
export { StudyNew }
