/**
 * This module is for study-new and study-edit file. 
 * Partial form compoent is saved here.
 */
import React from 'react'

/**
 * Code Block. 
 */
export function CodeBlock(
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
            value='問題'
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
            value='解答'
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
          中間または期末の際は，本試か追試を選択してください．
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

  /**
   * main return part. 
   */ 
  return(
    <div className="form__group">
      { kind !== "personal" &&
        <React.Fragment>
        <label className="form__label">種別</label>
        <div className="panel">
          <div className="panel__body">
            {kind !== "summary" && createTypeRadiobox()}
            {createNoDocOption()}
            {kind === "exam" && createRetestOption()}
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
export function FileForm(
  props:{register:any, files:File[], setState:any}
){
  let files = props.files
  const handleFile = (e:any) => {
    props.setState(e)
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
              onChange={ handleFile}
            />
           </div>
        </div>
      </div>
    </div>
  )

}