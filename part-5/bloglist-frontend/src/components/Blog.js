import React from 'react'
import Togglable from "./reusable/Togglable"

const Blog = ({ blog, blogs, setBlogs }) => {

  console.log(blog);

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
            <button>Like</button>
          </div>
        </Togglable>
      </div>
    </div>
  )
}

export default Blog