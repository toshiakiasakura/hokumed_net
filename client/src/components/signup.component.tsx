import React from 'react'
import { useForm } from 'react-hook-form'
import { AuthService } from '../services/auth.service'
import moment from 'moment'

export const RequirePop = () => {
  // TO DO: convert it into pop up.
  return(
    <span> 入力必須項目です </span>
  )
}


const RowBlock = (
  props:
    {
      // default value for optional arguments. condition will be good choice.
      type?: string,
      title: string,
      name: string,
      id: string,
      placeholder: string,
      register: any,
      errors: any,
      reg_json: any
    }
) => (

  <div className="form__group">
    <div className="col--sm-4">
      <label className="form__label" htmlFor={props.id}>
        {props.title}
      </label>
    </div>
    <div className="col--sm-8 tooltip tooltip--secondary">
      <input
        className="form__control"
        type={props.type || "text"}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
        ref={props.register(props.reg_json)}
      />
      {props.errors[props.name] && props.errors[props.name].message}
    </div>
  </div>
)


const DateBlock = (props:{register:any}) => {
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
        <div className="col--sm-4">
        <select
          className="form__control"
          name="birth_year"
          ref={props.register}
        >
          {years}
        </select>
        <select
          className="form__control"
          name="birth_month"
          ref={props.register}
        >
          {months}
        </select>
        <select
          className="form__control"
          name="birth_day"
          ref={props.register}
        >
          {days}
        </select>
        </div>
    </div>

  )
}

const ClassYearBlock = (props:{register:any}) => {
  let content = []
  for( var i = 94; i < 110; i++){
    content.push( <option id={"signupYear"+i} value={i}> {i}期 </option> )
  }
  return(
    <div className="form__group">
      <div className="col--sm-4">
        <label className="form__label">
           期を選択
        </label>
      </div>
      <div className="col--sm-8">
        <select
          className="form__control"
          name="class_year_id"
          ref={props.register}
        >
          {content}
        </select>
      </div>
    </div>
  )
}

export type SignUpData = {
  email: string
  password: string
  family_name: string
  given_name: string
  handle_name: string
  birth_year: string
  birth_month: string
  birth_day: string
  birthday: Date
  email_mobile: string
  class_year_id: number
  reenteredPassword: string
}

export const SignUpForm = () => {
  const { register, handleSubmit, errors, formState, control, watch } =
                            useForm<SignUpData>({mode:'onBlur'})


  const handleSignUp = (data: SignUpData) =>{
    // date validation is done here. .
    console.log(data)
    const date_str = `${data.birth_year}-${data.birth_month}-${data.birth_day}`
    const date_bool = moment(date_str, 'YYYY-M-D',true).isValid()
    if (!date_bool){
      alert("日付を正しく選択してください．")
      return
    }
    data.birthday = new Date(date_str)
    console.log(data.birthday)
    AuthService.signup(data)
    .then((res) =>{
      alert(res.msg)
    })
  }

  const password = watch("password", "");
  const require_json = {required: "入力必須項目です．"}
  return(
    <form
      className="form row"
      role="form"
      name="signup"
      onSubmit={handleSubmit(handleSignUp)}
    >
        <div className="panel">
          <div className="panel__body">
            <RowBlock
              title="苗字"
              name="family_name"
              id="signupFamilyName"
              placeholder="苗字"
              errors={errors} register={register}
              reg_json={require_json}
            />
            <RowBlock
              title="名前"
              name="given_name"
              id="signupGivenName"
              placeholder="名前"
              errors={errors} register={register}
              reg_json={require_json}
            />
            <RowBlock
              title= "ニックネーム"
              name="handle_name"
              id="signupHandleName"
              placeholder="ニックネーム"
              errors={errors} register={register}
              reg_json={require_json}
            />
            {/*TO DO: dropdown and checkbox implementation. */}
            <DateBlock register={register}/>
            <RowBlock
              title="ELMSメール"
              type="email"
              name="email"
              id="signupEmail"
              placeholder="example@eis.hokudai.ac.jp"
              errors={errors} register={register}
              reg_json={{
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@(eis|elms).hokudai.ac.jp$/i,
                  message: "@以下は(elms or eis).hokudai.ac.jpのみ有効です．"
                }
              }}
            />
            <ClassYearBlock register={register}/>
            <RowBlock
              title="パスワード"
              type="password"
              name="password"
              id="signupPassword"
              placeholder="パスワード"
              errors={errors} register={register}
              reg_json={{required: true,
                         minLength: {
                           value: 4,
                           message: "パスワードは4文字以上で入力してください．"
                         }
              }}
            />
            <RowBlock
              title="パスワードの確認"
              type="password"
              name="reenteredPassword"
              id="signupReenteredPassword"
              placeholder="もう一度パスワードを入力"
              errors={errors} register={register}
              reg_json = {{
                  required: true,
                  validate: (value:string) => {
                    return(value === password || "パスワードが一致しません．")
                  }
              }}
            />
            {/*TO DO: match pattern implementation and regular expression
              Also do the error displaying.
              json should be passed by another way.
              */}
            <div className="panel_foot">
              <div className="form__group">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={!formState.isValid}
                > Sign UP </button>
              </div>
            </div>
          </div>
        </div>
    </form>
  )
}



export const SignUp = () => {
  return(
    <div className="topfix">
      <div className="container">
          <div className="col--sm-10 col--sm-offset-1">
            <h1> ユーザー登録 </h1>
            <p>
               氏名は本名を入力してください。 <br />
               認証確認メールはELMSメールアドレス宛に送信されます。 <br />
               メール認証後、ログイン可能となるのは管理者の承認後になりますのでご注意ください。<br />
               不具合等ございましたら
               {/*link new mail address. */}
              <a href="'hokui.net@gmail.com??'">hokui.net@gmail.com??? </a>
               までご連絡ください。
            </p>
            <SignUpForm />
          </div>
      </div>
    </div>
  )
}
