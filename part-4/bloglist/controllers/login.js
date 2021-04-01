const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")
const config = require("../utils/config")

loginRouter.post("/", async (request, response) => {
  const user = await User.findOne({ username: request.body.username })

  const correctCombination = user === null
    ? false
    : await bcrypt.compare(String(request.body.password), user.passwordHash)

  if (!correctCombination) {
    response.status(401)
      .json({
        error: "Invalid username or password",
      })
  } else {
    const userForToken = {
      username: user.username,
      id: user._id, // eslint-disable-line
    }

    const token = await jwt.sign(userForToken, config.TOKEN_SECRET)

    response.status(200).send({
      token,
      username: user.username,
      name: user.name,
      id: user.id,
    })
  }
})

module.exports = loginRouter
