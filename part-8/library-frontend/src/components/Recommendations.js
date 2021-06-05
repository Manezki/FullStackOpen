import React, { useEffect, useState } from "react"

import { useQuery, useLazyQuery } from "@apollo/client"

import { ALL_BOOKS, ME } from "../queries"

const Recommendations = (props) => {

  const [ allBooks, setAllBooks ] = useState([])

  const [ getAllBooks, { data: allBooksData } ] = useLazyQuery(ALL_BOOKS)
  const { loading: currentUserLoading, data: currentUserData } = useQuery(ME)

  useEffect(() => {
    if (currentUserData) {
      getAllBooks({
        variables: { genre: currentUserData.me.favoriteGenre },
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
    }
  }, [getAllBooks, currentUserData])

  useEffect(() => {
    if (allBooksData) {
      setAllBooks(allBooksData.allBooks)
    }
  }, [setAllBooks, allBooksData])

  if (!props.show) {
    return null
  }

  const currentUser = (!currentUserLoading && currentUserData)
   ? currentUserData.me
   : null

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre: {(currentUser) ? currentUser.favoriteGenre : ""}</p>

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
          {((currentUser && allBooks) ? allBooks.filter(book => book.genres.includes(currentUser.favoriteGenre)) : []).map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations