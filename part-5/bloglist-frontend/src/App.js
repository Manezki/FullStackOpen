import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Blog from "./components/Blog"
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/reusable/Togglable"

import blogService from "./services/blogs"

import { initBlogs } from "./reducers/blogReducer"

const App = () => {
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const notification = useSelector(({ notification }) => notification)
  const blogs = useSelector(({ blogs }) => blogs)

  useEffect(() => {
    dispatch(initBlogs())
  }, [dispatch, initBlogs])

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
        {(Object.keys(notification).length !== 0)
          ? <Notification type={notification.type} message={notification.message} />
          : null}
        <LoginForm setUser={setUser} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {(Object.keys(notification).length !== 0)
        ? <Notification type={notification.type} message={notification.message} />
        : null}
      <div>
        &lsquo;{user.name}&lsquo; logged in
        <button onClick={logout}>Logout</button>
      </div>
      <br />

      <Togglable buttonLabel={"Add a new blog"} cancelLabel={"Cancel"} ref={blogFormRef}>
        <Blogsubmission submissionFormVisibilityRef={blogFormRef} />
      </Togglable>
      <br />
      <br />

      {[...blogs].sort((a, b) => -(a.likes - b.likes)).map(blog =>
        <Blog key={blog.id} blog={blog} loggedInUser={user} />
      )}
    </div>
  )
}

export default App