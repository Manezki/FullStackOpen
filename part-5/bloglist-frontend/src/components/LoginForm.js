import React, { useState } from "react"
import { useDispatch } from "react-redux"
import login from "./../services/login"
import { addNotification } from "../reducers/notificationReducer"
import { loginUser } from "../reducers/loginReducer"

const LoginForm = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    login.login({
      username, password
    })
      .then((user) => {
        dispatch(loginUser(user))
      })
      .catch((reason) => {
        dispatch(addNotification(
          reason.response.data.error,
          "error"
        ))
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