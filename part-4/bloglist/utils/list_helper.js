const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const reducer = (sum, item) => sum + item.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const highest = blogs.reduce((h, elem) => ((h.likes >= elem.likes) ? h : elem), { likes: -1 })
  return highest
}

const mostBlogs = (blogs) => {
  const authorGroupBy = _.groupBy(blogs, "author")
  const authorBlogs = _.map(authorGroupBy, (elem, key) => ({ author: key, blogs: elem.length }))
  return authorBlogs.reduce((h, auth) => ((h.blogs >= auth.blogs) ? h : auth), { blogs: -1 })
}

const mostLikes = (blogs) => {
  const authorGroupBy = _.groupBy(blogs, "author")
  const authorBlogs = _.map(authorGroupBy, (elems, key) => {
    const authorLikes = elems.reduce((likes, blog) => likes + blog.likes, 0)
    return { author: key, likes: authorLikes }
  })
  return authorBlogs.reduce((h, auth) => ((h.likes >= auth.likes) ? h : auth), { blogs: -1 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
