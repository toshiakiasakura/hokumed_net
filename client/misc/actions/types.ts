export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";

export const SET_MESSAGE = "SET_MESSAGE";
export const CLEAR_MESSAGE = "CLEAR_MESSAGE";


// Do not know right statement or not.
export interface Message{
  user: string
  message: string
  timestamp: number
}

interface RegisterAction {
  type: typeof REGISTER_SUCCESS | typeof REGISTER_FAIL
  payload: Message
}

interface LoginAction{
  type: typeof LOGIN_SUCCESS | typeof LOGIN_FAIL | typeof LOGOUT
  payload: Message
  isLoggedIn: boolean
  user: null | string
}

interface MessageAction {
  type: typeof SET_MESSAGE | typeof CLEAR_MESSAGE
  payload: Message
}

export type ActionTypes =  RegisterAction | LoginAction | MessageAction
