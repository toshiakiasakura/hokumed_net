/**
 * Components of this moudle are used for email verification.
 * From internal site the can not reach here.
 */
import { useHistory } from 'react-router-dom'

const VerifySuccess = () => {
  const history = useHistory()
  window.setTimeout(() => history.replace('/'), 5000)
  return(
    <div className="topfix">
      <h1> 認証しました． </h1>
      <div>
        管理人が承認するまでお待ちください． <br />
      承認がされましたらメールが届きます． <br />
      5秒後にログイン画面に遷移します．
      </div>
    </div>
  )
}

const VerifyFailure = () => {
  const history = useHistory()
  window.setTimeout(() => history.replace('/'), 5000)
  return(
    <div className="topfix">
      <h1> 認証に失敗しました． </h1>
      <div> 再登録してください． <br />
            5秒後にログイン画面に遷移します．
      </div>
    </div>
  )
}

export { VerifySuccess, VerifyFailure }
