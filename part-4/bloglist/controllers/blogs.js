const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  })

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (ValidationError) {
    response.status(400).json({ error: ValidationError.message })
  }
})

blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params

  try {
    await Blog.findByIdAndRemove(id)
    response.status(204).send()
  } catch (CastError) {
    response.status(204).send()
  }
})

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params

  if (request.body.title && request.body.url) {
    try {
      const result = await Blog.findByIdAndUpdate(
        id, request.body, { new: true, runValidators: true },
      )
      response.json(result)
    } catch (error) {
      if (error.name === "CastError") {
        response.status(400).json({ error: "invalid id" })
      } else if (error.name === "ValidationError") {
        response.status(400).json({ error: error.message })
      }
    }
  } else {
    response.status(400).json({ error: "Title and URL required" })
  }
})

module.exports = blogsRouter
