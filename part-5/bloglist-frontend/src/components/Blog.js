import React from "react"
import Togglable from "./reusable/Togglable"
import { useDispatch } from "react-redux"
import { likeBlog, deleteBlog } from "../reducers/blogReducer"

const Blog = ({ blog, loggedInUser }) => {
  const dispatch = useDispatch()

  const handleBlogDelete = async () => {
    if (!window.confirm(`Delete blog: ${blog.title}?`)) {
      return
    }

    dispatch(deleteBlog(blog))
  }

  return (
    <div className="blog">
      <div>
        {blog.title}; by {blog.author}
        <Togglable buttonLabel="View" cancelLabel="Hide">
          <div>
            Url: {blog.url}
          </div>
          <div>
            Author: {blog.author}
          </div>
          <div>
            Likes: {blog.likes}
            <button className="likeButton" onClick={ () => dispatch(likeBlog(blog)) }>Like</button>
          </div>
          { (loggedInUser.id === blog.user.id) && <button id="deleteButton" onClick={ () => handleBlogDelete()}>Delete</button> }
        </Togglable>
      </div>
    </div>
  )
}

export default Blog
