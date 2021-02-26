const listHelper = require("../utils/list_helper")
const Blog = require("../models/blog")

describe("dummy", () => {
  test("returns one", () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe("total likes", () => {
  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test("when list has only one blog equals the likes of that", () => {
    const blog = new Blog({
      title: "String",
      author: "String",
      url: "String",
      likes: 42,
    })

    expect(listHelper.totalLikes([blog])).toBe(42)
  })

  test("of a bigger list is calculated right", () => {
    const blog1 = new Blog({
      title: "String",
      author: "String",
      url: "String",
      likes: 42,
    })
    const blog2 = new Blog({
      title: "",
      author: "",
      url: "",
      likes: 42,
    })

    expect(listHelper.totalLikes([blog1, blog2])).toBe(84)
  })
})

describe("favorite blog", () => {
  const blogWithZeroLikes = new Blog({
    title: "",
    author: "",
    url: "",
    likes: 0,
  })
  const blogWithManyLikes = new Blog({
    title: "String",
    author: "String",
    url: "String",
    likes: 42,
  })

  test("of single blog is the blog", () => {
    expect(listHelper.favoriteBlog([blogWithZeroLikes])).toEqual(blogWithZeroLikes)
  })

  test("of multiple blogs, is selected correctly", () => {
    expect(
      listHelper.favoriteBlog([blogWithManyLikes, blogWithZeroLikes]),
    ).toEqual(blogWithManyLikes)
  })
})

describe("most blogs", () => {
  const realBlogs = [{
    _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0,
  }, {
    _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0,
  }, {
    _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0,
  }, {
    _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0,
  }, {
    _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0,
  }, {
    _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0,
  },
  ]

  const blogWithManyLikes = new Blog({
    title: "String",
    author: "String",
    url: "String",
    likes: 42,
  })

  test("of a single author is the author", () => {
    expect(listHelper.mostBlogs([blogWithManyLikes])).toEqual({ author: "String", blogs: 1 })
  })

  test("of multiple blogs is selected correctly", () => {
    expect(listHelper.mostBlogs(realBlogs)).toEqual({ author: "Robert C. Martin", blogs: 3 })
  })
})

describe("most likes", () => {
  const realBlogs = [{
    _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0,
  }, {
    _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0,
  }, {
    _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0,
  }, {
    _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0,
  }, {
    _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0,
  }, {
    _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0,
  },
  ]

  const blogWithManyLikes = new Blog({
    title: "String",
    author: "String",
    url: "String",
    likes: 42,
  })

  test("of a single blog is the author of the blog", () => {
    expect(listHelper.mostLikes([blogWithManyLikes])).toEqual({ author: "String", likes: 42 })
  })

  test("of multiple blogs is selected correctly", () => {
    expect(listHelper.mostLikes(realBlogs)).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
  })
})
