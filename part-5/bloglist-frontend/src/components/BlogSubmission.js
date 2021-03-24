import React, { useState } from 'react'
import blogService from "./../services/blogs"


const Blogsubmission = ({ user, blogs, setBlogs }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  
  const handleSubmit = async ( event ) => {
    event.preventDefault()

    const {title, author, url} = event.target
    
    try {
      console.log(user);
      const response = await blogService.create(
        {
          title: title.value,
          author: author.value,
          url: url.value,
        })
      
      setBlogs(blogs.concat([response]))

    } catch (error) {
      console.log(error.message);
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