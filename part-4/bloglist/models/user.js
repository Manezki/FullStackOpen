const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 40,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  }],
})

userSchema.index({ name: "text", username: "text" })
userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = document._id.toString()
    delete returnedObject._id // eslint-disable-line no-param-reassign, no-underscore-dangle
    delete returnedObject.__v // eslint-disable-line no-param-reassign, no-underscore-dangle
    delete returnedObject.passwordHash // eslint-disable-line no-param-reassign
  },
})

module.exports = mongoose.model("User", userSchema)
