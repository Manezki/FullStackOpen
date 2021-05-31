import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { likeBlog, deleteBlog, initBlogs } from "../reducers/blogReducer"
import { useParams, Link } from "react-router-dom"

const Blog = () => {
  const id = useParams().id

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBlogs())
  }, [dispatch])

  const loggedInUser = useSelector((state) => state.loggedInUser)
  const blog = useSelector((state) => {
    return state.blogs.find((blog) => blog.id === id)})

  const handleBlogDelete = async () => {
    if (!window.confirm(`Delete blog: ${blog.title}?`)) {
      return
    }

    dispatch(deleteBlog(blog))
  }

  if (!blog) {
    return null
  }

  return (
    <div className="blog">
      <div>
        <h2 style={{ margin: "12px 2px 1px 2px" }}>{blog.title}</h2>
        <h3 style={{ margin: "1px 2px 12px 2px", color: "#606060" }}>By: {blog.author}</h3>
        <div>
          Url: <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          Likes: {blog.likes}
          <button className="likeButton" onClick={ () => dispatch(likeBlog(blog)) }>Like</button>
        </div>
        <div>
          Added by:
          {(blog.user
            ? <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
            : " A deleted user"
          )}
        </div>
        <div className="comments">
          <h2>Comments</h2>
          <ul>
            {blog.comments.map((comment) => <li key={comment.id}>{ comment.text }</li>)}
          </ul>
        </div>
        { (blog.user) && (loggedInUser.id === blog.user.id) && <button id="deleteButton" onClick={ () => handleBlogDelete()}>Delete</button> }
      </div>
    </div>
  )
}

export default Blog
