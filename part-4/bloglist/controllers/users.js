const usersRouter = require("express").Router()
const bcypt = require("bcrypt")
const User = require("../models/user")

usersRouter.post("/", async (request, response, next) => {
  const newUser = new User({
    name: request.body.name,
    username: request.body.username,
    passwordHash: await bcypt.hash(String(request.body.password), 8),
  })

  try {
    const savedUser = await newUser.save()
    response.json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({})
    response.send(users)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
