import axios from "axios";

const API_URL = '/api/user/'

type String = string | null
class AuthService {
  login(email: String, password: String) {
    return axios
      .post(API_URL + "login", { email, password })
      .then((response) => {
        console.log("autho.service.ts: post method succeded!!")
        console.log(response)
        if (response.data.accessToken) {
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

  logout() {
    localStorage.removeItem("email");
  }

  register(email: String, password: String) {
    return axios.post(API_URL + "signup", {
      email,
      password,
    });
  }
}

export default new AuthService();
