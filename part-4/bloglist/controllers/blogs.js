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
    likes: request.body.likes || 0,
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

module.exports = blogsRouter
