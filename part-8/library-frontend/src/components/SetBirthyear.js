import React, { useEffect, useState } from "react"

import { useLazyQuery, useMutation } from "@apollo/client"

import { SET_BIRTHYEAR, ALL_AUTHORS } from "../queries"

const SetBirthYear = () => {
  const [author, setAuthor] = useState("")
  const [birthyear, setBirthyear] = useState("")

  const [ mut_setBirthyear ] = useMutation(SET_BIRTHYEAR)
  const [ getAuthors, result ] = useLazyQuery(ALL_AUTHORS)

  const fetchAuthors = () => {
    if (!result.loading && result.data) {
      return
    }
    getAuthors()
  }

  useEffect(() => {
    if (result.data) {
      setAuthor(result.data.allAuthors[0].name)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    mut_setBirthyear({
      variables: { name: author, setBornTo: Number(birthyear) },
      refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    setAuthor("")
    setBirthyear("")
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          Author
          <select
            name="author"
            value={author}
            required={true}
            onChange={({ target }) => setAuthor(target.value)}
            onMouseOver={() => fetchAuthors()}
          >
            {(!result.loading && result.data)
              ? result.data.allAuthors.map((author) => {
                return <option value={author.name} key={author.id}>{author.name}</option>
              })
              : <option>--Select an author--</option>
            }
          </select>
          {/* <input
            value={author}
            required={true}
            onChange={({ target }) => setAuthor(target.value)}
          /> */}
        </div>
        <div>
          Birthyear
          <input
            type='number'
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type='submit'>Set birthyear</button>
      </form>
    </div>
  )
}

export default SetBirthYear