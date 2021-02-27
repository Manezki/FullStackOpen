const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const helper = require("./test_helper")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const initialBlogs = helper.initialBlogs.map((blog) => new Blog(blog))
  const promises = initialBlogs.map((blog) => blog.save())
  await Promise.all(promises)
})

describe("/api/blogs", () => {
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

  describe("post methods", () => {
    test("accepts a valid blog", async () => {
      const newBlog = {
        title: "Improve your remote work results by being smart",
        author: "Manezki",
        url: "https://medium.com/@manezki/enjoy-life-to-the-fullest-remote-efficiently-78af5e48f865?sk=8ade2d067af850fafe2a94cf03c23fac",
        likes: 42,
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      const dbContent = await helper.blogsInDb()

      expect(dbContent).toHaveLength(helper.initialBlogs.length + 1)
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
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      let dbContent = await helper.blogsInDb()
      dbContent = dbContent.map(({ id, ...blog }) => blog)

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
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", new RegExp("application/json"))

      let dbContent = await helper.blogsInDb()
      dbContent = dbContent.map(({ id, ...blog }) => blog)

      newBlog.likes = 0

      expect(dbContent).toContainEqual(newBlog)
    })

    test("title and url are required for new blogs", async () => {
      const newBlog = {
        author: "Manezki",
        likes: 0,
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)
    })
  })

  describe("delete method", () => {
    test("deletes a valid id", async () => {
      const preDeleteDbContent = await helper.blogsInDb()

      await api
        .del(`/api/blogs/${preDeleteDbContent[0].id}`)
        .expect(204)

      const postDeleteDbContent = await helper.blogsInDb()

      expect(postDeleteDbContent).toHaveLength(preDeleteDbContent.length - 1)
    })

    test("returns a 204 for missing id", async () => {
      await api
        .del("/api/blogs/a123")
        .expect(204)
    })
  })

  describe("put method", () => {
    test("correctly updates likes on a blog", async () => {
      const content = await helper.blogsInDb()

      const contentCopy = { ...content[0] }
      contentCopy.likes += 1

      const response = await api
        .put(`/api/blogs/${contentCopy.id}`)
        .send(contentCopy)
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"))

      expect(response.body.likes).toBe(content[0].likes + 1)
    })

    test("refuses updates without title or url", async () => {
      const content = await helper.blogsInDb()

      const mutilatedContent = content.map(({ title, url, ...elem }) => elem)[0]

      await api
        .put(`/api/blogs/${mutilatedContent.id}`)
        .send(mutilatedContent)
        .expect(400)
        .expect("Content-Type", new RegExp("application/json"))
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
