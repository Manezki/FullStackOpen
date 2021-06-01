import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { createBlog } from "../reducers/blogReducer"

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const Blogsubmission = ({ submissionFormVisibilityRef }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const dispatch = useDispatch()

  const handleBlogSubmission = async (event) => {
    event.preventDefault()
    dispatch(createBlog({ title, author, url }))
    submissionFormVisibilityRef.current.toggleVisibility()
  }

  return (
    <div>
      <h2>Create new</h2>
      <Form onSubmit={handleBlogSubmission}>
        <Form.Group>
          <Form.Label>
            Title
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            id="newblog-title"
            value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Author
          </Form.Label>
          <Form.Control
            type="text"
            name="author"
            id="newblog-author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Url
          </Form.Label>
          <Form.Control
            type="url"
            name="url"
            id="newblog-url"
            value={url}
            onChange={({ target }) => setUrl(target.value)} />
        </Form.Group>
        <Button type="submit" id="newblog-submit" variant="primary">submit</Button>
      </Form>
    </div>
  )
}

export default Blogsubmission