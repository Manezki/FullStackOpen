import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async ({ title, author, url }) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, { title, author, url}, config)
  return response.data
}

const update = async ({ author, title, url, likes, id, user }) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}`, { author, title, url, likes, user: user.id }, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, setToken, update, remove }
