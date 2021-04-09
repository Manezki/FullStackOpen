import axios from "axios"

const baseUrl = "http://localhost:3001/anecdotes"

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addAnecdote = async (anecdoteContent) => {
  const response = await axios.post(baseUrl, { content: anecdoteContent, likes: 0 })
  return response.data
}

const voteAnecdote = async (id) => {
  const preVote = await axios.get(`${baseUrl}/${id}`)
  const response = await axios.put(`${baseUrl}/${id}`, {...preVote.data, votes: preVote.data.votes + 1})
  return response.data
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAll,
  addAnecdote,
  voteAnecdote
}
