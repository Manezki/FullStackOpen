import axios from 'axios';

const baseUrl = "/api/persons"

const getAll = () => {
  const request = axios.get(baseUrl)
  return request
    .then( (response) => response.data)
}

const create = (contact) => {
  const request = axios.post(baseUrl, contact)
  return request
    .then( (response) => response.data)
}

const remove = (id) => {
  const deleteURL = `${baseUrl}/${id}`
  const request = axios.delete(deleteURL)
  return request
    .then( (response) => {
      return response.data
    })
}

const update = (id, contact) => {
  const updateURL = `${baseUrl}/${id}`
  const request = axios.put(updateURL, contact)
  return request
    .then( (response) => {
      return response.data
    })
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export { getAll, create, remove, update }
