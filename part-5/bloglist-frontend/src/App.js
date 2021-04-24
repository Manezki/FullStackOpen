import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"


import Blog from "./components/Blog"
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Users from "./components/Users"
import User from "./components/User"
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
  }, [dispatch])

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
    <Router>
      <div className="navBar">
        <Link className="link" to="/">Blogs</Link>
        <Link className="link" to="/users">Users</Link>
      </div>
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

        <Switch>
          <Route path="/users/:id">
            <User />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Togglable buttonLabel={"Add a new blog"} cancelLabel={"Cancel"} ref={blogFormRef}>
              <Blogsubmission submissionFormVisibilityRef={blogFormRef} />
            </Togglable>
            {[...blogs].sort((a, b) => -(a.likes - b.likes)).map(blog =>
              <Blog key={blog.id} blog={blog} loggedInUser={loggedInUser} />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App