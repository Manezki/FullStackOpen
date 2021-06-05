import React, { useEffect, useState } from "react"

import { useMutation } from "@apollo/client"

import { LOGIN } from "../queries"

const SetBirthYear = (props) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [ login, result ] = useMutation(LOGIN)

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      localStorage.setItem("token", token)
      props.setToken(token)
    }
  }, [result.data, props])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    login({
      variables: { username, password },
    })

    setUsername("")
    setPassword("")

    props.setPage("authors")
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          Username
          <input
            name="username"
            value={username}
            required={true}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default SetBirthYear