import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const user = window.localStorage.getItem("user")
    if (user) {
      const userObject = JSON.parse(user)
      setUser(userObject)
      blogService.setToken(userObject.token)
    }
  }, [])

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem("user")
  }

  if (user === null) {
    return (
      <>
        <h2>blogs</h2>
        <LoginForm setUser={setUser} />
      </>
    )
  }

  return (
    <div>
        <h2>blogs</h2>
        <div>
          '{user.name}' logged in
          <button onClick={logout}>logout</button>
        </div>

        <Blogsubmission user={user} blogs={blogs} setBlogs={setBlogs} />
        <br />
        
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )
}

export default App