import anecdoteService from "../services/anecdotes"
import { notify } from "./notificationReducer"

const reducer = (state = [], action) => {
  switch (action.type) {
    case "VOTE":

      try {
        return state.map((anecdote) => anecdote.id === action.anecdote.id ? action.anecdote : anecdote)
      } catch (error) {
        return state
      }
    
    case "CREATE":
      return [...state, action.anecdote]
    case "INIT-ANECDOTES":
      return action.anecdotes
    default:
      return state
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.voteAnecdote(id)
    dispatch({
      type: "VOTE",
      anecdote: newAnecdote
    })
    dispatch(notify(`You voted for: ${newAnecdote.content}`, 5))
  }
}

export const createAnecdote = ( anecdote ) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.addAnecdote(anecdote)
    dispatch({
      type: "CREATE",
      anecdote: newAnecdote
    })
    dispatch(notify(`You added an anecdote: ${newAnecdote.content}`, 5))
  }
}

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: "INIT-ANECDOTES",
      anecdotes
    })
  }
}

export default reducer