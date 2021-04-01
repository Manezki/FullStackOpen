const mongoose = require("mongoose")
const supertest = require("supertest")
const bcrypt = require("bcrypt")
const app = require("../app")
const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helper")

const api = supertest(app)

describe("/api/blogs", () => {
  describe("GET methods", () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      const initialUser = {
        name: "manezki",
        username: "manezki",
        passwordHash: await bcrypt.hash(String(12345), 8),
      }

      const userResponse = await new User(initialUser).save()

      const initialBlogs = helper.initialBlogs.map((blog) => {
        blog.user = userResponse._id // eslint-disable-line
        return new Blog(blog)
      })

      const blogPromises = initialBlogs.map((blog) => blog.save())
      await Promise.all(blogPromises)
    })

    test("returns correct amount of blogs", async () => {
      const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test("returns a blog with a known title", async () => {
      let response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      response = response.body.map((blog) => blog.title)

      expect(response).toContain("Type wars")
    })

    test("blogs have an id", async () => {
      const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body[0].id).toBeDefined()
    })

    test("blogs do not have an _id nor __v", async () => {
      const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(Object.keys(response.body[0])).not.toContain("_id")
      expect(Object.keys(response.body[0])).not.toContain("__v")
    })
  })

  describe("POST methods", () => {
    let loggedInUser
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      const initialUser = {
        name: "manezki",
        username: "manezki",
        passwordHash: await bcrypt.hash(String(12345), 8),
      }

      await new User(initialUser).save()

      const response = await api
        .post("/api/login")
        .send({
          username: "manezki",
          password: 12345,
        })

      loggedInUser = response.body
    })

    test("accepts a valid blog", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      const dbContent = await helper.blogsInDb()

      expect(dbContent).toHaveLength(1)
    })

    test("correctly saves the title, author, url, and likes", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      let dbContent = await helper.blogsInDb()
      // Drop user and id from the returned content
      dbContent = dbContent.map(({ id, user, ...blog }) => blog)

      expect(dbContent).toContainEqual(newBlog)
    })

    test("new blogs default to 0 likes", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      let dbContent = await helper.blogsInDb()
      dbContent = dbContent.map(({ id, user, ...blog }) => blog)

      newBlog.likes = 0

      expect(dbContent).toContainEqual(newBlog)
    })

    test("new blogs have a creating user set", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      const dbContent = await helper.blogsInDb()

      expect(dbContent[0].user).toBeDefined()
      expect(response.body.user).toBeDefined()
    })

    test("created blogs have the logged-in user as the creator user", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      const creator = await User.findOne({ id: response.id })
      expect(creator.username).toBe(loggedInUser.username)
    })

    test("new blogs are appended to the user's blogs", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      const usersAtStart = await helper.usersInDb()

      const blogResponse = await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      const creator = await User.findById(blogResponse.body.user)

      expect(creator.blogs).toHaveLength(usersAtStart.find((user) => user.id === creator.id)
        .blogs.length + 1)
    })

    test("accepts blogs if user token is provided", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))
    })

    test("rejects blogs if user token is NOT provided", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", new RegExp("application/json"))
    })

    test("title and url are required for new blogs", async () => {
      const newBlog = {
        author: "Manezki",
        likes: 0,
      }

      await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe("DELETE method", () => {
    let loggedInUser
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      const initialUser = {
        name: "manezki",
        username: "manezki",
        passwordHash: await bcrypt.hash(String(12345), 8),
      }

      const userResponse = await new User(initialUser).save()

      const response = await api
        .post("/api/login")
        .send({
          username: "manezki",
          password: 12345,
        })

      loggedInUser = response.body

      const initialBlogs = helper.initialBlogs.map((blog) => {
        blog.user = userResponse._id // eslint-disable-line
        return new Blog(blog)
      })

      const blogPromises = initialBlogs.map((blog) => blog.save())
      await Promise.all(blogPromises)
    })

    test("deletes a valid id", async () => {
      const preDeleteDbContent = await helper.blogsInDb()

      await api
        .del(`/api/blogs/${preDeleteDbContent[0].id}`)
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .expect(204)

      const postDeleteDbContent = await helper.blogsInDb()

      expect(postDeleteDbContent).toHaveLength(preDeleteDbContent.length - 1)
    })

    test("returns a 204 for missing id", async () => {
      await api
        .del("/api/blogs/603d48a76291e97b35973e01")
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .expect(204)
    })

    test("rejects DELETE request from users that are not the creator of the blog", async () => {
      const secondaryUser = {
        name: "eva",
        username: "eva",
        passwordHash: await bcrypt.hash(String(67890), 8),
      }

      await new User(secondaryUser).save()

      const response = await api
        .post("/api/login")
        .send({
          username: "eva",
          password: 67890,
        })

      const secondaryLoggedIn = response.body

      const dbBlogs = await helper.blogsInDb()

      await api
        .del(`/api/blogs/${dbBlogs[0].id}`)
        .set("Authorization", `bearer ${secondaryLoggedIn.token}`)
        .expect(401)

      const afterDelete = await helper.blogsInDb()

      expect(afterDelete).toHaveLength(dbBlogs.length)
    })

    test("accepts DELETEs from the blog creator", async () => {
      const contentOnStart = await helper.blogsInDb()

      await api
        .del(`/api/blogs/${contentOnStart[0].id}`)
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .expect(204)

      const contentAtEnd = await helper.blogsInDb()

      expect(contentAtEnd).toHaveLength(contentOnStart.length - 1)
    })

    test("returns unauthorized if no token is provided", async () => {
      const contentOnStart = await helper.blogsInDb()

      await api
        .del(`/api/blogs/${contentOnStart[0].id}`)
        .expect(401)

      const contentAtEnd = await helper.blogsInDb()

      expect(contentAtEnd).toHaveLength(contentOnStart.length)
    })
  })

  describe("PUT method", () => {
    let loggedInUser
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      const initialUser = {
        name: "manezki",
        username: "manezki",
        passwordHash: await bcrypt.hash(String(12345), 8),
      }

      const userResponse = await new User(initialUser).save()

      const initialBlogs = helper.initialBlogs.map((blog) => {
        blog.user = userResponse._id // eslint-disable-line
        return new Blog(blog)
      })

      const blogPromises = initialBlogs.map((blog) => blog.save())
      await Promise.all(blogPromises)

      const response = await api
        .post("/api/login")
        .send({
          username: "manezki",
          password: 12345,
        })

      loggedInUser = response.body
    })

    test("correctly updates likes on a blog", async () => {
      const content = await helper.blogsInDb()

      const contentCopy = { ...content[0] }
      contentCopy.likes += 1

      const response = await api
        .put(`/api/blogs/${contentCopy.id}`)
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(contentCopy)
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body.likes).toBe(content[0].likes + 1)
    })

    test("refuses updates without log-in token", async () => {
      const content = await helper.blogsInDb()

      const contentCopy = { ...content[0] }
      contentCopy.likes += 1

      await api
        .put(`/api/blogs/${contentCopy.id}`)
        .send(contentCopy)
        .expect(401)
        .expect("Content-Type", new RegExp("application/json"))

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd[0].likes).toBe(content[0].likes)
    })

    test("refuses updates without title or url", async () => {
      const content = await helper.blogsInDb()

      const mutilatedContent = content.map(({ title, url, ...elem }) => elem)[0]

      await api
        .put(`/api/blogs/${mutilatedContent.id}`)
        .set("Authorization", `bearer ${loggedInUser.token}`)
        .send(mutilatedContent)
        .expect(400)
        .expect("Content-Type", new RegExp("application/json"))
    })
  })
})

describe("/api/users", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const users = [
      new User({
        name: "manezki",
        username: "manezki",
        passwordHash: await bcrypt.hash("12345", 8),
      }),
      new User({
        name: "eva",
        username: "eva",
        passwordHash: await bcrypt.hash("67890", 8),
      }),
    ]

    await Promise.all(users.map((user) => user.save()))
  })

  describe("post method", () => {
    test("accepts an unique username", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: "manezki",
        username: "man3zki",
        password: 12345,
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      expect(JSON.stringify(usersAtEnd)).toContain("eva")
    })

    test("refutes a duplicate username", async () => {
      const newUser = {
        name: "APSD",
        username: "manezki",
        password: 23456,
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
    })

    test("refutes usernames shorter than 3 characters", async () => {
      const newUser = {
        name: "manezki",
        username: "A",
        password: 12345,
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
    })

    test("accepts usernames at least 3 characters long", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: "manezki",
        username: "JFL",
        password: 12345,
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      expect(usersAtEnd.map((user) => user.username)).toContain("JFL")
    })

    test("refutes passwords shorter than 3 characters", async () => {
      const newUser = {
        name: "newUser",
        username: "newUser",
        password: 12,
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
    })

    test("refutes users without password", async () => {
      const newUser = {
        name: "newUser",
        username: "newUser",
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
    })

    test("accepts passwords at least 3 characters long", async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: "newUser",
        username: "DHS",
        password: 123,
      }

      await api
        .post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      expect(usersAtEnd.map((user) => user.username)).toContain("DHS")
    })
  })

  describe("get method", () => {
    test("should correctly return saved users", async () => {
      const response = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body).toHaveLength(2)
      expect(response.body.map((user) => user.username)).toContain("manezki")
    })

    test("returned items contain listing of users notes", async () => {
      const response = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body[0].blogs).toBeDefined()
    })
  })
})

describe("/api/login", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const users = [
      new User({
        name: "manezki",
        username: "manezki",
        passwordHash: await bcrypt.hash("12345", 8),
      }),
      new User({
        name: "eva",
        username: "eva",
        passwordHash: await bcrypt.hash("67890", 8),
      }),
    ]

    await Promise.all(users.map((user) => user.save()))
  })

  describe("post method", () => {
    test("accepts correct username password combination", async () => {
      const response = await api
        .post("/api/login")
        .send({
          username: "manezki",
          password: 12345,
        })
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body.token).toBeDefined()
      expect(response.body.username).toBe("manezki")
      expect(response.body.name).toBe("manezki")
      expect(response.body.id).toBeDefined()
    })

    test("rejects incorrect password for existing username", async () => {
      const response = await api
        .post("/api/login")
        .send({
          username: "manezki",
          password: 13579,
        })
        .expect(401)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body.token).not.toBeDefined()
    })

    test("rejects password of wrong user", async () => {
      const response = await api
        .post("/api/login")
        .send({
          username: "manezki",
          password: 67890,
        })
        .expect(401)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body.token).not.toBeDefined()
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
