const resetRouter = require("express").Router()
const User = require("../models/user")
const Blog = require("../models/blog")

resetRouter.post("/reset", async (request, response) => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  response.status(204).send()
})

module.exports = resetRouter
