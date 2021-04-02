import React from "react"
import Togglable from "./reusable/Togglable"

const Blog = ({ blog, handleBlogLike, handleBlogDelete, loggedInUser }) => {
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
            <button className="likeButton" onClick={ () => handleBlogLike({ blog })}>Like</button>
          </div>
          { (loggedInUser.id === blog.user.id) && <button id="deleteButton" onClick={ () => handleBlogDelete({ blog })}>Delete</button> }
        </Togglable>
      </div>
    </div>
  )
}

export default Blog