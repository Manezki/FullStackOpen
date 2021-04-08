import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = (event) => {
    event.preventDefault()
    dispatch(createAnecdote(event.target.anecdote.value))
  }

  return (
    <>
    <h2>create new</h2>
      <form onSubmit={submitAnecdote}>
        <div>
          <input
            name="anecdote"
            type="text"/>
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
