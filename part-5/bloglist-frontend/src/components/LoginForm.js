import React, { useState } from "react"
import Login from "./../services/login"
import blogService from "./../services/blogs"


const LoginForm = ({ setUser, addNotification }) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()

    Login.login({
      username, password
    })
      .then((user) => {
        setUser(user)
        blogService.setToken(user.token)
        window.localStorage.setItem("user", JSON.stringify(user))
      })
      .catch((reason) => {
        addNotification({
          type: "error",
          message: reason.response.data.error,
        })
      })
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          required="required"
          onChange={({ target }) => setUsername(target.value)}/>
      </div>
      <div>
        Password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          required="required"
          onChange={({ target }) => setPassword(target.value)}/>
      </div>
      <button type="submit" id="login-button">Login</button>
    </form>
  )
}

export default LoginForm