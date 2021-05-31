const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
})

commentSchema.index({ text: "text" })

commentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = document._id.toString()
    delete returnedObject._id // eslint-disable-line no-param-reassign, no-underscore-dangle
    delete returnedObject.__v // eslint-disable-line no-param-reassign, no-underscore-dangle
  },
})

module.exports = mongoose.model("Comment", commentSchema)
