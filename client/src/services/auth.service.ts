import axios from "axios";

const API_URL = '/api/user/'

type String = string | null

class AuthService {
  static login(email: String, password: String) {
    return axios
      .post(API_URL + "login", { email, password })
      .then((response) => {
        console.log("autho.service.ts: post method succeded!!")
        console.log(response)
        if (response.data.accessToken) {
          console.log("setItem")
          localStorage.setItem("user", JSON.stringify(response.data))
        }

        return response.data
      })
      .catch((err) => {
          console.log(API_URL+'login')
          console.log('axios post method failure in auth.service.ts')
          console.log(err)
      })
  }

  static logout() {
    localStorage.removeItem("user")
  }

  static signup(data: any) {
    return axios.post(API_URL + "signup", data)
    .then((response) => {
      return(response.data)
    })
    .catch((err) => {
      console.log('axios signup failure')
      console.log(err)
    })
  }
}

export {AuthService}
