const logger = require("./logger")

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "CastError") {
    response.status(400).send({ error: "Invalid id" })
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).send({ error: "Missing or invalid authorization token" })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")

  if (request.body.token) {
    // Token already set - malicious?
    request.body.token = null
  }

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.body.token = authorization.substring(7)
  }

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
}
