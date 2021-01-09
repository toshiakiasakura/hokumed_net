import React, { useEffect, useState } from 'react'

import { Class_Year } from '../entity/study.entity'
import { MultiClassStatus } from '../helpers/types.helper'
import { AuthService } from '../services/auth.service'
import { FetchValidation, Loading } from './utils.component'
import { sortValue } from '../helpers/sort.helper'
/**
 * One row desgine of a form is decorated with this function. 
 * @param props.title Title of the form.
 */
export function FormGroupContainer(props:{title:string, children:any}){
  return(
    <div className="form__group">
      <div className="col--sm-4">
        <label className="form__label">
           {props.title}
        </label>
      </div>
      <div className="col--sm-8">
        {props.children}
      </div>
    </div>
  )
}


/**
 * Construct one item of simple input form using react-hook-form.
 * @param props.register just pass react-hook-form method.
 * @param props.errors just pass react-hook-form method.
 * @param props.reg_json this json contents are passed to register.
 */
export function FormRow(
  props:
    {
      // default value for optional arguments. condition will be good choice.
      type?: string,
      disabled?: boolean,  
      title: string,
      name: string,
      id: string,
      placeholder: string,
      register: any,
      errors: any,
      reg_json: any
    }
){
  return(
    <div className="form__group">
      <div className="col--sm-4">
        <label className="form__label" htmlFor={props.id}>
          {props.title}
        </label>
      </div>
      <div className="col--sm-8 tooltip tooltip--secondary">
        <input
          className={`form__control`}
          type={props.type || "text"}
          name={props.name}
          id={props.id}
          placeholder={props.placeholder}
          ref={props.register(props.reg_json)}
          disabled ={props.disabled}
        />
        {props.errors[props.name] && props.errors[props.name].message}
      </div>
    </div>
  )
}

/**
 * Save button. Use with react-hook form. 
 * Pushed behavior is set in form tag. 
 */
export function SaveButton(props:{formState:any}){
    return(
        <button 
        type="submit"
        className="btn btn--primary"
        disabled={!props.formState.isValid}
        >
        保存
        </button>
    )
}

/**
 * Given class_year arrays, create class year options.
 */
export const createClassYearOptions = (contents:Class_Year[]) => {
  let options= [
    <option id={'learnYearDefault'} value='default'>
      期を選択
    </option>
  ]
  let sorts = sortValue(contents, 'year', true)
  for( let i = 0; i < sorts.length; i++){
    let year = sorts[i].year
    options.push(
      <option id={"learnYear" + year} value={year}>
        {year}期
      </option>
    )
  }
  return options
}
/**
 * Class year block of input form.
 */
export const ClassYearBlock = (props:{
  register:any, name:string, disabled?:boolean
}) => {
  const [state, setState] = useState<
        ClassYearsState
      >( {contents:[], status:200, msg:''})

  useEffect(()=>{
    AuthService.ClassYearBoard<Class_Year>(setState)
  }, [setState])

  let contents = state.contents
  return(
    <FetchValidation status={state.status}>
      {contents=== undefined || contents.length === 0
      ? <Loading />
      : 
        <div className="form__group">
          <div className="col--sm-4">
            <label className="form__label">
              期を選択
            </label>
          </div>
          <div className="col--sm-8">
            <select
              className="form__control"
              name={props.name}
              ref={props.register({
                validate: (v:string) =>{
                  return( !isNaN(parseInt(v)) || "入力必須項目です")
                }
              })}
              disabled={props.disabled}
            >
              {createClassYearOptions(contents)}
            </select>
          </div>
        </div>
      }
    </FetchValidation>
    )
}

type ClassYearsState = MultiClassStatus<Class_Year>
export function LearnYearBlock(
    props:{errors:any, register:any, name:string}
  ){
  let content = [
    <option id={'sginupYearDefault'} value='default'>
      学習年を選択
    </option>
  ]
  for( let i = 1; i <=6; i++){
    content.push(
      <option id={"signupYear" + i} value={i}>
        {i}年
      </option>
    )
  }
  return(
    <FormGroupContainer title="学習年">
        <select
          className="form__control"
          name={props.name}
          ref={props.register({
            validate: (v:string) => {
              return( !isNaN(parseInt(v))　|| "入力必須項目です" )
            }
          })}
        >
          {content}
        </select>
    </FormGroupContainer>
  )
} 

export function TermBlock(
    props:{errors:any, register:any, name:string}
  ){
  return(
    <FormGroupContainer title="学習期">
        <select
          className="form__control"
          name={props.name}
          placeholder="学習年を選択"
          ref={props.register({
            validate: (v:string) => {
              return( ["pre","post"].includes(v)　|| "入力必須項目です" )
            }
          })}
        >
          <option id={'learnTermDefault'} value='default'>
            学習期を選択
          </option>
          <option id={'learnTermPre'} value='pre'>
            前期
          </option>
          <option id={'learnTermPost'} value='post'>
            後期
          </option>
        </select>
    </FormGroupContainer>
  )
} 


/**
 * Implement for birthday input form.
 * Precisely to say, there are not valid input patten.
 * Date validation is done when button is pushed in SingUpFrom.
 */

function DateContainer(
    props:{name:string, content:any, register:any}
){
  return(
    <div className="col--xs-4">
      <select
        className="form__control"
        name={props.name}
        ref={props.register}
      >
        {props.content}
      </select>
    </div>
  )
}

export const DateBlock = (props:{register:any}) => {
  let years = [<option id="birth_year_default" value="default"> 年を選択 </option>]
  let months = [<option id="birth_month_default" value="default"> 月を選択 </option>]
  let days = [<option id="birth_date_default" value="default"> 日を選択 </option>]

  var i
  for(i = 1980; i<= 2020 ; i++){
    years.push( <option id={"birth_year" +i } value={i}> {i}年 </option>)
  }
  for(i = 1; i <= 12; i++){
    months.push( <option id={"birth_month" +i } value={i}> {i}月 </option>)
  }
  for(i = 1; i <= 31; i++){
    days.push( <option id={"birth_month" +i } value={i}> {i}日 </option>)
  }
  return(
    <div className="form__group">
      <div className="col--sm-4">
        <label className="form__label">
          生年月日
        </label>
      </div>
        <div className="col--sm-8 col--no-gutter">
          <DateContainer name="birth_year" 
            content={years} register={props.register}
            />
          <DateContainer name="birth_month" 
            content={months} register={props.register}
          />
          <DateContainer name="birth_day" 
            content={days} register={props.register}
          />
        </div>
    </div>

  )
}

export function ProfileSubmitButton(props:{
  formState: any, title:string
}){
  return(
    <div className="panel_foot">
      <div className="form__group">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={!props.formState.isValid}
        > 
          {props.title}
        </button>
      </div>
    </div>
  )

}