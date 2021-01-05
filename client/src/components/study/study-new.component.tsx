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
import fileDownload from 'js-file-download'
import { UserService } from '../../services/user.service'


type FileNewData = {
  class_year: number,
  comment: string,
  code_radio: number,
  files:File[],
  no_doc: string,
  test_kind: string
}
/**
 * Code Block. 
 */
function CodeBlock(
  props:{kind:string, register:any}
){
  let kind = props.kind

  const createTypeRadiobox = () => {
    return(
      <div className="form__group">
        <div className="pull-left">
          <input
            className="form__control"
            type="radio"
            id="docUploadCodeQuestion"
            name="code_radio"
            value={0}
            ref={props.register({required:true})}
          />
          <label 
            className="form__label"
            htmlFor="docUploadCodeQuestion"
          >
            問題
          </label>
        </div>
        <div className="pull-left">
          <input
            className="form__control"
            type="radio"
            id="docUploadCodeAnswer"
            name="code_radio"
            value={1}
            ref={props.register({required:true})}
          />
          <label 
            className="form__label"
            htmlFor="docUploadCodeAnswer"
          >
            解答
          </label>
        </div>
      </div>
    )
  }
  const createNoDocOption = () => {
    let options = []
    if(kind === 'exam'){
      options.push(
        <React.Fragment>
          <option id="docNoMiddle" value="中間">中間</option>
          <option id="docNoLast" value="期末">期末</option>
        </React.Fragment>
      )
    }
    for(let i = 1; i<=50; i++){
      options.push(
      <option id={`docNo${i}`} value={`第${i}回`}>第{i}回</option>
      )
    }
    return(
      <div className="form__group">
        <select
          className="form__control"
          name="no_doc"
          ref={props.register}
        >
          {options}
        </select>
      </div>
    )
  }
  const createRetestOption = () =>{
    return(
      <div className="form__group">
        <label className="form__label">
          本試 or 追試
        </label>
        <select
          name="test_kind"
          className="form__control"
          ref={props.register}
        >
          <option id="test" value="本試">本試</option>
          <option id="retest" value="追試">追試</option>
        </select>
      </div>
    )
  }
  return(
    <div className="form__group">
      { kind !== "personal" &&
        <React.Fragment>
        <label className="form__label">種別</label>
        <div className="panel">
          <div className="panel__body">
            {kind !== "summary" && createTypeRadiobox()}
            {createNoDocOption()}
            {kind !== "summary" && createRetestOption()}
          </div>
        </div>
        </React.Fragment>
      }
    </div>
  )
}

/**
 * File upload form part.  
 */
function FileForm(
  props:{register:any, files:File[], setState:any}
){
  let files = props.files
  const handleFile = () => {
    props.setState(files)
  }
  const createFileExp = () => {
    let contents= [<span></span>]
    if(files && files.length){
      for(let i = 0; i < files.length; i++){
        let f = files[i]
        contents.push(
          <li>
            {`${f.name} (${f.size} bytes)`}
          </li>
        )
      }
    }
    return( <ul>{contents} </ul>)
  }
  console.log(files)
  return(
    <div className="form__group">
      <label className="form__label">
        ファイル &nbsp; <span className="text-accent">*必須</span>
      </label>
      <div className="panel">
        <div className="panel__body">
            { createFileExp() }
           <div className="droparea">
            <label
              htmlFor="fileUpload"
              className="droparea clickable drop-box"
            >
              ファイルアップロード
            </label>
            <input
              ref={props.register}
              className="hidden droparea clickable drop-box"
              type="file" id="fileUpload" name="files"
              multiple drop-box
              onChange={() => handleFile()}
            />
           </div>
        </div>

      </div>
    </div>
  )

}

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
      } = useForm<FileNewData>({
        mode:'onBlur', 
        defaultValues:{
          class_year:years[0].year, 
          code_radio: 1,
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
  const sendFiles = (data: FileNewData) => {
    console.log("##### send files", data)
    if(!data.files.length){
      alert('ファイルが選択されていません．')
    } else {
      UserService.sendFiles(data)
      .then( _ => {
        console.log('file sent')
        history.push(`/study/${props.subject.title_en}/${props.kind}`)
      })

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
