import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./types";
import { Dispatch } from 'redux'
import AuthService from "../services/auth.service";

type String = string | null

/* React-redux uses a curried function.
   See "What do multiple arrow functions mean in javascript?"
   https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript

 */
export const register = ( email: String,
                        password: String) => (dispatch: Dispatch) => {
  return AuthService.register(email, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      })

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      })

      return Promise.resolve()
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      dispatch({
        type: REGISTER_FAIL,
      })

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      })

      return Promise.reject();
    }
  )
}

/* login function. This calles AuthService login
 */
export const login = (username: String, password: String) =>
  (dispatch: Dispatch) =>
{
  return AuthService.login(username, password)
  .then(

      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        })

        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.log('auth.ts: login failure flag. ')
        dispatch({
          type: LOGIN_FAIL,
        })

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        })

        return Promise.reject();
      }
  )
}

export const logout = () => (dispatch: Dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  })
}
