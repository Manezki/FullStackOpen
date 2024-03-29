const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const logger = require("./utils/logger")
const config = require("./utils/config")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const middleware = require("./utils/middleware")

const app = express()

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch(() => {
    logger.error("Failed to connect to MongoDB")
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

if (config.NODE_ENV === "test") {
  const resetRouter = require("./controllers/reset") // eslint-disable-line
  app.use("/api/testing", resetRouter)
}

app.use(middleware.errorHandler)

module.exports = app
