const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
})

blogSchema.index({ title: "text", author: "text" })

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = document._id.toString()
    delete returnedObject._id // eslint-disable-line no-param-reassign, no-underscore-dangle
    delete returnedObject.__v // eslint-disable-line no-param-reassign, no-underscore-dangle
  },
})

module.exports = mongoose.model("Blog", blogSchema)
