import Cookies from 'universal-cookie'

export function authHeader() {
  const cookie  = new Cookies()
  const accessToken = cookie.get('accessToken')
  const userID = cookie.get('userID')

  if (accessToken && userID ) {
    // for Node.js Express back-end
    return { 'x-access-token': accessToken, 'x-user-id': userID };
  } else {
    return {};
  }
}
