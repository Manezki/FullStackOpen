const reducer = (state = [], action) => {
  switch (action.type) {
    case "VOTE":

      try {
        const anecdoteToUpdate = state.find((anecdote) => anecdote.id === action.id)
        const updatedAnectode = {
          ...anecdoteToUpdate,
          votes: anecdoteToUpdate.votes + 1
        }
        return state.map((anecdote) => anecdote.id === action.id ? updatedAnectode : anecdote)
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
  return {
    type: "VOTE",
    id: id
  }
}

export const createAnecdote = ( anecdote ) => {
  return {
    type: "CREATE",
    anecdote
  }
}

export const initAnecdotes = (anecdotes) => {
  return {
    type: "INIT-ANECDOTES",
    anecdotes
  }
}

export default reducer