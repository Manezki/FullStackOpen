import React, { useState } from "react"

const Blogsubmission = ({ handleBlogSubmission }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={ (event) => {
        event.preventDefault()
        handleBlogSubmission({
          title,
          author,
          url
        })
      }}>
        <div>
          title
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url
          <input
            type="url"
            name="url"
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default Blogsubmission