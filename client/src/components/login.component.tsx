import React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, Link, Redirect } from 'react-router-dom'
import { AuthService } from '../services/auth.service'
import Cookies from 'universal-cookie'
// This type for onClick
// type ChangeEvent = React.ChangeEvent<HTMLInputElement>


type FormData ={
  email: string
  password: string
}


/**
 * This is hook function for form.
 * In this function, input  validation is done.
 */
const LoginForm = () => {
  const { register, handleSubmit, errors, formState } = useForm<FormData>({mode:'onChange'})
  const history = useHistory()
  const handleLogin = (data: FormData) => {
    /*login procedures. This should be written in other places.
    */
    AuthService.login(data.email, data.password)
    .then( (res) => {
      console.log('login component process started.')
      console.log(res)
      if (res && res.status === 200){
        history.push("/home")
        window.location.reload()
        // This line is for reloading cookies for eveyr component
      } else if (res && res.status === 401) {
        // TO DO: Become more elegant one. .
        alert(res.msg)
        //history.push("/error")
      } else (
        history.push("/error")
      )
    })
  }
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
            placeholder="Password"
            ref={register({required: true, minLength: 4})}
          />{errors.password && 'Passwordを入力してください'}
        </div>
        <div className="form__group">
          <input
            type="checkbox"
            id="loginInputKeepLogin"
            className="form__control" // className should be edited.
            name="keepLogin"
          />
          <label htmlFor="loginInputKeepLogin"
            className="form__label" > ログイン状態を保存する </label>
        </div>
        <div className="form__group">
          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={!formState.isValid}
            id="loginButton"
          >
            ログイン
          </button>
        </div>
      </div>
    </form>
  )
}

/* Register button function.
To apply useHitory function, it should be function.
*/
const SignUpButton =  () =>{
  const history = useHistory()
  const handleClick= () =>{
    history.push('/signup')
  }
  return(
    <button
      className="btn btn--primary btn--block btn--ghost"
      onClick={() => handleClick()}
    >
      ユーザー登録する
    </button>
  )
}

const Login = () => {
    const cookies = new Cookies()
    if (cookies.get('isLogIn') === 'true'){
      return <Redirect to='home' />
    }

    return(
    <div className="hero">
      <div className="hero__bg"/>
      <div className="hero__login">
        <h2> ログイン画面 </h2>
        <LoginForm />
        <div className="test-muted text-small">
          {/* TO DO: Resend the confirmation mail.*/}
          <Link to="/error">認証メールの再送信(未実装)</Link>
        </div>
        <hr/>
        <div className="panel__foot">
          <SignUpButton />
        </div>
        <div　className="memo">　＊このサイトの利用にはCookieの設定を有効にしてください． </div>
      </div>
    </div>
  )
}

export {Login}
