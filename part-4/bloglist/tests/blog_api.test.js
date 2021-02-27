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

  test("returns a blog with known title", async () => {
    let response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))

    response = response.body.map((blog) => blog.title)

    expect(response).toContain("Type wars")
  })
})

afterAll(() => {
  mongoose.connection.close()
})
