import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Blogsubmission from "./components/BlogSubmission"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/reusable/Togglable"
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notifications, setNotifications] = useState([])
  const [nNotifications, setNNotifications] = useState(0)
  const [user, setUser] = useState(null)

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
    setNotifications(notifications.concat([{id: nNotifications, ...notification}]))
    setNNotifications(nNotifications + 1)
    setTimeout(() => {
      setNotifications([])
    }, 5000)
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem("user")
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
          '{user.name}' logged in
          <button onClick={logout}>logout</button>
        </div>
        <br />

        <Togglable buttonLabel={"Add a new blog"} cancelLabel={"Cancel"} ref={blogFormRef}>
          <Blogsubmission blogs={blogs} setBlogs={setBlogs} addNotification={addNotification} blogFormRef={blogFormRef} />
        </Togglable>
        <br />
        <br />
        
        {[...blogs].sort((a, b) => -(a.likes - b.likes)).map(blog =>
          <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} loggedInUser={user} addNotification={addNotification} />
        )}
    </div>
  )
}

export default App