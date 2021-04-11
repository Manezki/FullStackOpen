import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = ({ createAnecdote }) => {

  const submitAnecdote = async (event) => {
    event.preventDefault()
    createAnecdote(event.target.anecdote.value)
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

const mapDispatchToProps = {
  createAnecdote
}

const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)

export default ConnectedAnecdoteForm
