
import React, { useEffect, useState } from "react"
import { useApolloClient, useSubscription } from "@apollo/client"

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/Login"
import Recommendations from "./components/Recommendations"
import { ALL_BOOKS, BOOK_ADDED } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const apolloClient = useApolloClient()

  useEffect(() => {
    setToken(window.localStorage.getItem("token"))
  }, [setToken])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert("New book added on the server")

      const newBook = subscriptionData.data.bookAdded
      const dataInStore = apolloClient.readQuery({ query: ALL_BOOKS })

      apolloClient.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: dataInStore.allBooks.concat(newBook),
        },
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem("token")
    apolloClient.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {(token && <button onClick={() => setPage("add")}>add book</button>)}
        {(token && <button onClick={() => setPage("recommendations")}>recommendations</button>)}
        {(token)
          ? <button onClick={() => logout()}>logout</button>
          : <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <Authors
        show={page === "authors"}
      />

      <Books
        show={page === "books"}
      />

      <NewBook
        show={page === "add"}
      />

      <Login
        show={page === "login"} setPage={setPage} setToken={setToken}
      />

      <Recommendations
        show={page === "recommendations"}
      />

    </div>
  )
}

export default App