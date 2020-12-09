import React, { Component } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import '../style/_temp.sass'
// import { connect } from "react-redux"
import { login } from "../actions/auth"

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type State = {
  email: string,
  password: string,
  loading : boolean
}

type FormData ={
  email: string
  password: string
}

/* This is hook function for form.
   In this function, input  validation is done.
 */
const LoginForm = (
  props:{
    state:State,
  }
) => {
  //const state = {email:"", password:""}
  const { register, handleSubmit, errors, formState } = useForm<FormData>({mode:'onChange'})
  const dispatch = useDispatch()
  const handleLogin = (data: FormData) => {
    /* This login calls auth in actions and subsequenstly call
       auth.service.ts. Then, axios.post method is called.
     */
    dispatch(login(data.email, data.password))

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
                message: "@以下は(elms or eis).hokuida.ac.jpのみ有効です．"
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
const RegisterButton =  () =>{
  const history = useHistory()
  const handleClick= () =>{
    history.push('/register')
  }
  return(
    <button
      className="btn btn--primary btn--block btn--ghost"
      onClick={handleClick}
    >
      ユーザー登録する
    </button>
  )
}

class Login extends Component {
  state : State

  constructor(props:{}){
    super(props)
    this.handleLogin = this.handleLogin.bind(this)

    this.state = {
      email:"",
      password:"",
      loading: false
    }
  }

  handleLogin(e: ChangeEvent) {
    e.preventDefault();

    this.setState({
      loading: true,
    });
    console.log(this.state)

  }

  render() {

    return(
    <div className="hero">
      <div className="hero__bg"/>
      <div className="hero__login">
        <h2> ログイン画面 </h2>
        <LoginForm state={this.state} />
        <div className="test-muted text-small">
          {/* TO DO: Resend the confirmation mail.*/}
          <a>認証メールの再送信(未実装)</a>
        </div>
        <hr/>
        <div className="panel__foot">
          <p className="v-spacer"/>
          <div>
            <RegisterButton />
          </div>
        </div>
      </div>
    </div>
  )}
}


// function mapStateToProps(state}) {
//   const { isLoggedIn } = state.auth
//   const { message } = state.message
//   return {
//     isLoggedIn,
//     message
//   };
// }

export {Login}
