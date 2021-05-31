import axios from "axios"
const baseUrl = "/api/blogs"

const create = async ({ id, text }) => {

  const response = await axios.post(`${baseUrl}/${id}/comments`, { text })
  return response.data
}

export default { create }
