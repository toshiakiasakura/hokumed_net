import axios from "axios";

const API_URL = '/api/user/'

// This type is matched with SignUpForm in signup.component.tsx
export type SignUpData = {
  email: string
  password: string
  family_name: string
  given_name: string
  handle_name: string
  birth_year: string
  birth_month: string
  birth_day: string
  email_mobile: string
  class_year: number
  reenteredPassword: string
}
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

        return response.data;
      })
      .catch((err) => {
          // later delete log
          console.log(API_URL+'login')
          console.log('axios post method failure in auth.service.ts')
          console.log(err)
      })
  }

  static logout() {
    localStorage.removeItem("user");
  }

  static signup(data: SignUpData) {
    return axios.post(API_URL + "signup", data);
  }
}

export {AuthService}
