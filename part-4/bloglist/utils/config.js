require("dotenv").config()

const PORT = process.env.PORT || 3003
let { MONGODB_URI } = process.env
const { NODE_ENV, TOKEN_SECRET } = process.env

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV,
  TOKEN_SECRET,
}
