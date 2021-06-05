require("dotenv").config()
const { UserInputError } = require("apollo-server")
const jwt = require("jsonwebtoken")
const Book = require("../models/book")
const Author = require("../models/author")
const User = require("../models/user")

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      try {
        const filteredByGenre = (args.genre)
          ? Book.find({ genres: { $in: [args.genre] } }).populate("author")
          : Book.find({}).populate("author")

        return filteredByGenre
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (root) => {
      const authorBooks = await Book.find({ author: root.id })
      return authorBooks.length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new UserInputError("Login required to add a new book. See login")
      }

      if (!args.author) {
        throw new UserInputError("Author name is required", {
          invalidArgs: args,
        })
      }

      try {
        const author = await Author.findOne({ name: { $regex: args.author, $options: "i" } })

        const newAuthor = author || await new Author({ name: args.author }).save()

        let newBook = await new Book({
          title: args.title,
          author: newAuthor.id,
          published: Number(args.published),
          genres: args.genres,
        }).save()

        newBook = await newBook.populate("author").execPopulate()

        return newBook
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: (root, args, context) => {
      if (!context.currentUser) {
        throw new UserInputError("Login required to add a new book. See login")
      }

      if (!args.name || !args.setBornTo) {
        throw new UserInputError("Author name and setBornTo parameters required", {
          invalidArgs: args,
        })
      }

      return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
    },

    createUser: (root, args) => {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        })
        return user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "password") {
        throw new UserInputError("Wrong username or password")
      }

      const userForToken = {
        username: user.username,
        id: user._id, // eslint-disable-line
      }

      const token = await jwt.sign(userForToken, process.env.TOKEN_SECRET)

      return { value: token }
    },
  },
}

module.exports = resolvers
