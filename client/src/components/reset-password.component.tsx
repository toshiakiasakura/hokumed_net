import React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, Link, Redirect } from 'react-router-dom'
import { AuthService } from '../services/auth.service'
import Cookies from 'universal-cookie'


type FormData ={
  email: string
  password: string
}


/**
 * This is hook function for form.
 */
const ResetForm = () => {
  const { register, handleSubmit, errors, formState, watch
        } = useForm<FormData>({mode:'onChange'})
  const history = useHistory()
  const handleLogin = (data: FormData) => {
    /*login procedures. This should be written in other places.
    */
    AuthService.resetPassword(data.email, data.password)
    .then( (res) => {
      if(res && res.status === 200){
        alert("確認メールを送信しました．\nまだパスワードは再設定されていません．")
        history.push("/")
      } else {
        alert("エラーが発生しました．再度，実行してください．")
      }
    })
  }
  const password = watch("password", "")
  return(
    <form name="form_2" onSubmit={handleSubmit(handleLogin)}>
      <div className="panel__body">
        <div className="form__group">
          <input
            className="form__control"
            type="email"
            name="email"
            id="loginInputEmail"
            placeholder="Enter your email address"
            ref={register({
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@(eis|elms).hokudai.ac.jp$/i,
                message: "@以下は(elms or eis).hokudai.ac.jpのみ有効です．"
              },
            })}
          />{errors.email && errors.email.message}
        </div>

        <div className="form__group">
          <input
            className="form__control"
            type="password"
            name="password"
            id="loginInputPassword"
            placeholder="新しいPassword"
            ref={register({required: true, minLength: 4})}
          />{errors.password && '新しいPasswordを入力してください'}
        </div>
        <div className="form__group">
          <input
            className="form__control"
            type="password"
            name="reenteredPassword"
            id="resetReenteredPassowrd"
            placeholder= "もう一度パスワードを入力"
            ref={register({
              required: true,
              validate: (value:string) =>{
                return(value=== password || "パスワードが一致しません．")
              }

            })}
          />{errors.password && 'Passwordを入力してください'}
        </div>
        <div className="form__group">
          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={!formState.isValid}
            id="loginButton"
          >
            確認メールの送信
          </button>
        </div>
      </div>
    </form>
  )
}

const ResetPassword = () => {
    const cookies = new Cookies()
    if (cookies.get('isLogIn') === 'true'){
      return <Redirect to='home' />
    }

    return(
    <div className="hero">
      <div className="hero__bg"/>
      <div className="hero__login">
        <h2> パスワードの再設定  </h2>
        <div　className="memo">
          パスワードの再設定を行います． <br />
          メールに記載されたリンクを押した時点で <br/> 
          再設定されます．<br />
          登録状態の確認にも使えます． <br />
        </div>
        <ResetForm />
      </div>
    </div>
  )
}

export { ResetPassword }
