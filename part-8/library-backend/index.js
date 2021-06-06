require("dotenv").config()

const { ApolloServer } = require("apollo-server")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const resolvers = require("./services/resolvers")
const typeDefs = require("./services/typeDefs")
const User = require("./models/user")
const bookLoader = require("./services/loaders")

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
).then(() => {
  console.log("Connected to MongoDB")
}).catch((error) => {
  console.error(`MongoDB connection failed. ${error.message}`)
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.TOKEN_SECRET,
      )

      const currentUser = await User.findById(decodedToken.id)

      return { currentUser, loaders: { bookLoader } }
    }
    return {}
  },
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
