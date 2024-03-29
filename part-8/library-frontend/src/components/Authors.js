
import React from "react"
import { useQuery } from "@apollo/client"

import { ALL_AUTHORS } from "../queries"

import SetBirthYear from "./SetBirthyear"

const Authors = (props) => {

  const { loading, data } = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  const authors = (!loading && data)
    ? data.allAuthors
    : []

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                born
              </th>
              <th>
                books
              </th>
            </tr>
            {authors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <SetBirthYear />
      </div>
    </div>
  )
}

export default Authors
