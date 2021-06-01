import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"

import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

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
      <div className="container">
        <h2>blogs</h2>
        {(Object.keys(notification).length !== 0)
          ? <Notification type={notification.type} message={notification.message} />
          : null}
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="container">
      <Router>
        <Navbar className="navBar" bg="light">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link className="link" to="/">Blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link className="link" to="/users">Users</Link>
              </Nav.Link>
            </Nav>
            <div>
              &lsquo;{loggedInUser.name}&lsquo; logged in
              <Button onClick={logout} style={{ marginLeft: 4 }} variant="outline-dark">Logout</Button>
            </div>
          </Navbar.Collapse>
        </Navbar>
        <div>
          <h2>blogs</h2>
          {(Object.keys(notification).length !== 0)
            ? <Notification type={notification.type} message={notification.message} />
            : null}
          <br />

          <Switch>
            <Route path="/users/:id">
              <User />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/blogs/:id">
              <Blog />
            </Route>
            <Route path="/">
              <Togglable buttonLabel={"Add a new blog"} cancelLabel={"Cancel"} ref={blogFormRef}>
                <Blogsubmission submissionFormVisibilityRef={blogFormRef} />
              </Togglable>
              {[...blogs].sort((a, b) => -(a.likes - b.likes)).map(blog => {
                return (
                  <div className="blog" key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </div>
                )
              })}
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
