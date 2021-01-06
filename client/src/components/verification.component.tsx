/**
 * Components of this moudle are used for email verification.
 * From internal site the can not reach here.
 */
import { useHistory, Route, Switch } from 'react-router-dom'

const TIME_OUT = 5000
const EmailVerification = (props:{success: boolean }) => {
  const history = useHistory()
  window.setTimeout(() => history.replace('/'), TIME_OUT)
  if(props.success){
    return(
      <div>
        <h1> 認証しました． </h1>
        <div>
          管理人が承認するまでお待ちください． <br />
        承認がされましたらメールが届きます． <br />
        5秒後にログイン画面に遷移します．
        </div>
      </div>
    )
  } else {
    return(
      <div>
        <h1> 認証に失敗しました． </h1>
        <div> 再登録してください． <br />
              5秒後にログイン画面に遷移します．
        </div>
      </div>
  )}
}

/**
 * This verification function is for reset password.
 */
const ResetVerification = (props:{success:boolean}) => {
  const history = useHistory()
  window.setTimeout(() => history.replace('/'), TIME_OUT)
  if(props.success){
    return(
      <div>
        <h1> パスワードを変更しました． </h1>
        <div>
        5秒後にログイン画面に遷移します．
        </div>
      </div>
    )
  } else {
    return(
      <div>
        <h1> パスワードの変更に失敗しました．</h1>
        <div>
        再度，やり直してください． <br />
        5秒後にログイン画面に遷移します．
        </div>
      </div>
    )
  }
}


const VerificationPage = () => {
  return(
    <div className="topfix">
      <Switch>
        <Route
          path='/verify/email-success'
          component={() => <EmailVerification success={true}/> }
        />
        <Route
          path='/verify/email-failure'
          component={() => <EmailVerification success={false}/> }
        />
        <Route
          path='/verify/reset-success'
          component={() => <ResetVerification success={true}/> }
        />
        <Route
          path='/verify/reset-failure'
          component={() => <ResetVerification success={false}/> }
        />
      </Switch>
    </div>
  )

}
export { VerificationPage }
