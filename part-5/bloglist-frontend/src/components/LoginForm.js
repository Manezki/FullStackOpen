import React, { useState } from 'react'
import Login from "./../services/login"
import blogService from "./../services/blogs"


const LoginForm = ({ setUser }) => {
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await Login.login({
        username, password
      })
      
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input 
        type="text"
        value={username}
        name="Username"
        required="required"
        onChange={({target}) => setUsername(target.value)}/>
      </div>
      <div>
        password
        <input
        type="password"
        value={password}
        name="Password"
        required="required"
        onChange={({target}) => setPassword(target.value)}/>
      </div>
      <button type="submit">login</button>
    </form>
  )  
}

export default LoginForm