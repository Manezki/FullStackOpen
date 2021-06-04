require("dotenv").config()

const { ApolloServer, gql } = require("apollo-server")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const resolvers = require("./services/resolvers")
const User = require("./models/user")

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token  
  }
`

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

      return { currentUser }
    }
    return {}
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
