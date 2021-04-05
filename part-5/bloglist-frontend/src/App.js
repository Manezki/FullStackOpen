import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/reusable/Togglable"
import blogService from "./services/blogs"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notifications, setNotifications] = useState([])
  const [nNotifications, setNNotifications] = useState(0)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const addNotification = (notification) => {
    setNotifications(notifications.concat([{ id: nNotifications, ...notification }]))
    setNNotifications(nNotifications + 1)
    setTimeout(() => {
      setNotifications([])
    }, 5000)
  }

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

      addNotification({
        type: "success",
        message: `A new blog ${response.title} by ${response.author} added`,
      })

      blogFormRef.current.setVisibility()

    } catch (error) {
      addNotification({
        type: "error",
        message: error.message,
      })
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

      addNotification({
        type: "success",
        message: `Succesfully deleted ${blog.title}`
      })
    } catch (error) {
      addNotification({
        type: "error",
        message: `Could not delete ${blog.title}, reason: ${error.message}`
      })
    }
  }

  if (user === null) {
    return (
      <>
        <h2>blogs</h2>
        {notifications.map((notif) => <Notification key={notif.id} type={notif.type} message={notif.message} />)}
        <LoginForm setUser={setUser} addNotification={addNotification} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notifications.map((notif) => <Notification key={notif.id} type={notif.type} message={notif.message} />)}
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