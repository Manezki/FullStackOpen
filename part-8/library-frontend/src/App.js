
import React, { useEffect, useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/Login"
import Recommendations from "./components/Recommendations"
import { useApolloClient } from "@apollo/client"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setToken(window.localStorage.getItem("token"))
  }, [setToken])

  const logout = () => {
    setToken(null)
    localStorage.removeItem("token")
    client.resetStore()
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