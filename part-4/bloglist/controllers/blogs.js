const jwt = require("jsonwebtoken")
const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comment")
const config = require("../utils/config")

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate(
      [{ path: "user", select: "username name" }, { path: "comments", select: "text" }],
    )
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
  // Potential BUG: Blog reference might linger in users blogs after blog is deleted.
  // BUG: Deleting a blog does leave orphanated comments.
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
      ).populate("user", { username: 1, name: 1 })
      response.json(result)
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post("/:id/comments", async (request, response, next) => {
  try {
    const { id } = request.params

    const blog = await Blog.findById(id)

    const comment = new Comment({
      text: request.body.text,
    })

    const createdComment = await comment.save()

    blog.comments = blog.comments.concat([createdComment._id]) // eslint-disable-line

    await blog.save()
    response.status(201).json(createdComment)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/:id/comments", async (request, response, next) => {
  try {
    const { id } = request.params

    const blog = await Blog.findById(id)

    const comment = new Comment({
      text: request.body.text,
    })

    const createdComment = await comment.save()

    blog.comments = blog.comments.concat([createdComment._id]) // eslint-disable-line

    await blog.save()
    response.status(201).json(createdComment)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
