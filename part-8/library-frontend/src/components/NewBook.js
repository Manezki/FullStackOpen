import React, { useState } from "react"

import { useMutation } from "@apollo/client"

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries"

const NewBook = (props) => {
  const [title, setTitle] = useState("")
  const [author, setAuhtor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK)

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({
      variables: { title, author, published: Number(published), genres },
      // Could be carried out with manual update
      refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]
    })

    setTitle("")
    setPublished("")
    setAuhtor("")
    setGenres([])
    setGenre("")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(" ")}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook