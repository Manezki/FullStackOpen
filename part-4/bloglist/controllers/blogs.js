const jwt = require("jsonwebtoken")
const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const config = require("../utils/config")

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post("/", async (request, response, next) => {
  try {
    const token = request.body.token ? request.body.token : ""
    const decodedToken = jwt.verify(token, config.TOKEN_SECRET)

    if (!request.body.token || !decodedToken.id) {
      response.status(401).json({
        error: "Token missing or invalid",
      })
    } else {
      const user = await User.findById(decodedToken.id)

      const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id, // eslint-disable-line
      })

      const result = await blog.save()

      user.blogs = user.blogs.concat([result._id]) // eslint-disable-line

      await user.save()
      response.status(201).json(result)
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete("/:id", async (request, response, next) => {
  const { id } = request.params
  const token = request.body.token ? request.body.token : ""

  try {
    const decodedToken = jwt.verify(token, config.TOKEN_SECRET)

    if (!request.body.token || !decodedToken.id) {
      response.status(401).json({
        error: "Token missing or invalid",
      })
    } else {
      const blogToDelete = await Blog.findById(id)

      if (!blogToDelete) {
        response.status(204).send()
      } else if (blogToDelete.user.toString() === decodedToken.id) {
        await Blog.findByIdAndRemove(id)
        response.status(204).send()
      } else {
        response.status(401).json({
          error: "Only the creator of the blog may delete it",
        })
      }
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const token = request.body.token ? request.body.token : ""
    const decodedToken = jwt.verify(token, config.TOKEN_SECRET)

    if (!request.body.token || !decodedToken.id) {
      response.status(401).json({
        error: "Token missing or invalid",
      })
    } else {
      const { id } = request.params

      if (!request.body.title || !request.body.url) {
        response.status(400).json({ error: "Title and URL required" })
      }

      const result = await Blog.findByIdAndUpdate(
        id, request.body, { new: true, runValidators: true },
      )
      response.json(result)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
