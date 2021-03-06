const logger = require("./logger")

const errorHandler = (error, request, response, next) => {
  // THIS CAUSES INTERNAL SERVER ERROR
  logger.error(error.message)

  if (error.name === "CastError") {
    response.status(400).send({ error: "Invalid id" })
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message })
  }

  next(error)
}

module.exports = errorHandler
