import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from "../reducers/anecdoteReducer"
import anecdoteService from "../services/anecdotes"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = await anecdoteService.addAnecdote(event.target.anecdote.value)
    dispatch(createAnecdote(anecdote))
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
