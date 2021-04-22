import axios from "axios"

const baseUrl = "/api/users"

const getAll = async () => {
  const usersResponse = await axios.get(baseUrl)
  return usersResponse.data
}

export default { getAll }
