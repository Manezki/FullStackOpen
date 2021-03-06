const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

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
    const randomUser = await User.findOne({})

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: randomUser._id, // eslint-disable-line
    })

    const result = await blog.save()

    randomUser.blogs = randomUser.blogs.concat([result._id]) // eslint-disable-line

    await randomUser.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete("/:id", async (request, response, next) => {
  const { id } = request.params

  try {
    await Blog.findByIdAndRemove(id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put("/:id", async (request, response, next) => {
  const { id } = request.params

  if (!request.body.title || !request.body.url) {
    response.status(400).json({ error: "Title and URL required" })
  }

  try {
    const result = await Blog.findByIdAndUpdate(
      id, request.body, { new: true, runValidators: true },
    )
    response.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
