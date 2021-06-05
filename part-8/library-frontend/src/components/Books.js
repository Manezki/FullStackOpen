import React, { useEffect, useState } from "react"

import { useQuery, useLazyQuery } from "@apollo/client"

import { ALL_BOOKS } from "../queries"

const Books = (props) => {

  const [ genreFilter, setGenreFilter ] = useState(null)
  const [ displayBooks, setDisplayBooks ] = useState([])

  const { loading, data } = useQuery(ALL_BOOKS)
  const [ getAllBooks, { data: genredBooksData}] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
      getAllBooks({
        variables: { genre: genreFilter },
        update: (store, response) => {
        const stored = store.readQuery({ query: ALL_BOOKS })
        const fetched = response.data.allBooks
        store.writeQuery({
          query: ALL_BOOKS,
          data: {
            ...stored.map((book) => {
              const maybeRet = fetched.find((updatedBook) => updatedBook.id === book.id)
              return (maybeRet) ? maybeRet : book
            })
          }
        })
      }
    })
  }, [genreFilter, getAllBooks])

  useEffect(() => {
    if (genredBooksData) {
      setDisplayBooks(genredBooksData.allBooks)
    }
  }, [setDisplayBooks, genredBooksData])

  if (!props.show) {
    return null
  }

  const allBooks = (!loading && data)
    ? data.allBooks
    : []

  const genres = new Set()

  allBooks.forEach(book => {
    book.genres.forEach(genre => genres.add(genre))
  })


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {displayBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {Array.from(genres).map(genre =>
          <button key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>
        )}
        <button onClick={() => setGenreFilter(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books