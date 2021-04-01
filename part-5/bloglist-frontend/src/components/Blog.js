import React from "react"
import Togglable from "./reusable/Togglable"
import blogService from "../services/blogs"

const Blog = ({ blog, blogs, setBlogs, loggedInUser, addNotification }) => {

  const handleLike = async () => {
    const newBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })

    setBlogs(blogs.map( (blog) => blog.id === newBlog.id ? newBlog : blog ))
  }

  const handleDelete = async () => {
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


  return (
    <div className="blog">
      <div>
        {blog.title}
        <Togglable buttonLabel="View" cancelLabel="Hide">
          <div>
            Url: {blog.url}
          </div>
          <div>
            Author: {blog.author}
          </div>
          <div>
            Likes: {blog.likes}
            <button onClick={handleLike}>Like</button>
          </div>
          { (loggedInUser.id === blog.user.id) && <button id="deleteButton" onClick={handleDelete}>Delete</button> }
        </Togglable>
      </div>
    </div>
  )
}

export default Blog