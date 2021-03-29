import React, { useState } from 'react'
import blogService from "./../services/blogs"


const Blogsubmission = ({ blogs, setBlogs, addNotification, blogFormRef }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  
  const handleSubmit = async ( event ) => {
    event.preventDefault()

    const {title, author, url} = event.target
    
    try {
      const response = await blogService.create(
        {
          title: title.value,
          author: author.value,
          url: url.value,
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

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
          type="text"
          name="title"
          value={title}
          onChange={({target}) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input
          type="text"
          name="author"
          value={author}
          onChange={({target}) => setAuthor(target.value)} />
        </div>
        <div>
          url
          <input
          type="url"
          name="url"
          value={url}
          onChange={({target}) => setUrl(target.value)} />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default Blogsubmission