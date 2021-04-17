import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import Blog from "./components/Blog"
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/reusable/Togglable"

import blogService from "./services/blogs"

import { addNotification } from "./reducers/notificationReducer"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const notification = useSelector(({ notification }) => notification)

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

  const handleBlogSubmission = async ({ title, author, url }) => {
    try {
      const response = await blogService.create(
        {
          title,
          author,
          url,
        })

      setBlogs(blogs.concat([response]))

      dispatch(addNotification(
        `A new blog ${response.title} by ${response.author} added`,
        "success",
      ))

      blogFormRef.current.setVisibility()

    } catch (error) {
      dispatch(addNotification(
        error.message,
        "error"
      ))
    }
  }

  const handleBlogLike = async ({ blog }) => {
    const newBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })

    setBlogs(blogs.map( (blog) => blog.id === newBlog.id ? newBlog : blog ))
  }

  const handleBlogDelete = async ({ blog }) => {
    if (!window.confirm(`Delete blog: ${blog.title}?`)) {
      return
    }

    try{
      await blogService.remove(blog.id)

      setBlogs(blogs.filter( (storedBlog) => storedBlog.id !== blog.id ))

      dispatch(addNotification(
        `Succesfully deleted ${blog.title}`,
        "success"
      ))
    } catch (error) {
      dispatch(addNotification(
        `Could not delete ${blog.title}, reason: ${error.message}`,
        "error"
      ))
    }
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
        <Blogsubmission handleBlogSubmission={handleBlogSubmission} />
      </Togglable>
      <br />
      <br />

      {[...blogs].sort((a, b) => -(a.likes - b.likes)).map(blog =>
        <Blog key={blog.id} blog={blog} loggedInUser={user} handleBlogLike={handleBlogLike} handleBlogDelete={handleBlogDelete} />
      )}
    </div>
  )
}

export default App