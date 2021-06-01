import React, { useState } from "react"
import { useDispatch } from "react-redux"
import login from "./../services/login"
import { addNotification } from "../reducers/notificationReducer"
import { loginUser } from "../reducers/loginReducer"

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

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
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>
          Username
        </Form.Label>
        <Form.Control
          id="username"
          type="text"
          value={username}
          name="Username"
          required="required"
          onChange={({ target }) => setUsername(target.value)}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>
          Password
        </Form.Label>
        <Form.Control
          id="password"
          type="password"
          value={password}
          name="Password"
          required="required"
          onChange={({ target }) => setPassword(target.value)}/>
      </Form.Group>
      <Button type="submit" id="login-button" variant="primary">Login</Button>
    </Form>
  )
}

export default LoginForm
