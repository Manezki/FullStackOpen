import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Blog from "./components/Blog"
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/reusable/Togglable"

import { initBlogs } from "./reducers/blogReducer"
import { restoreLogin, logoutUser } from "./reducers/loginReducer"

const App = () => {

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const { notification, blogs, loggedInUser } = useSelector(( state ) => state)

  useEffect(() => {
    dispatch(initBlogs())
    dispatch(restoreLogin())
  }, [dispatch, initBlogs, restoreLogin])

  const logout = () => {
    dispatch(logoutUser())
  }

  if (Object.keys(loggedInUser).length === 0) {
    return (
      <>
        <h2>blogs</h2>
        {(Object.keys(notification).length !== 0)
          ? <Notification type={notification.type} message={notification.message} />
          : null}
        <LoginForm />
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
        &lsquo;{loggedInUser.name}&lsquo; logged in
        <button onClick={logout}>Logout</button>
      </div>
      <br />

      <Togglable buttonLabel={"Add a new blog"} cancelLabel={"Cancel"} ref={blogFormRef}>
        <Blogsubmission submissionFormVisibilityRef={blogFormRef} />
      </Togglable>
      <br />
      <br />

      {[...blogs].sort((a, b) => -(a.likes - b.likes)).map(blog =>
        <Blog key={blog.id} blog={blog} loggedInUser={loggedInUser} />
      )}
    </div>
  )
}

export default App