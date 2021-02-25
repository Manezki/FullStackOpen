const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.index({ title: "text", author: "text" })

module.exports = mongoose.model("Blog", blogSchema)
