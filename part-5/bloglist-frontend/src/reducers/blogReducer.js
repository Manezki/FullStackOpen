import blogService from "../services/blogs"
import commentService from "../services/comment"
import { addNotification } from "./notificationReducer"

const reducer = (state = [], action) => {
  switch (action.type) {
  case "CREATE":
    return state.concat(action.blog)
  case "INIT-BLOGS":
    return [].concat(action.blogs)
  case "UPDATE-BLOG":
    return state.map((blog) => (blog.id === action.blogID) ? action.updatedBlog : blog)
  case "DELETE-BLOG":
    return state.filter((blog) => (blog.id) !== action.blogID)
  default:
    return state
  }
}

export const createBlog = ({ title, author, url }) => {
  // BUG: New blogs are not deletable.
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create({ title, author, url })
      dispatch({
        type: "CREATE",
        blog: newBlog
      })
      dispatch(addNotification(
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
        "success"
      ))
    } catch (error) {
      dispatch(addNotification(
        error.message,
        "error"
      ))
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })
      dispatch({
        type: "UPDATE-BLOG",
        blogID: updatedBlog.id,
        updatedBlog: updatedBlog
      })
    } catch (error) {
      null
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id)
      dispatch({
        type: "DELETE-BLOG",
        blogID: blog.id
      })
      dispatch(addNotification(
        `Succesfully deleted ${blog.title}`,
        "success"
      ))
    } catch (error) {
      dispatch(addNotification(
        `Could not delete ${blog.title}, reason: ${error.message}`,
        "error"
      ))
    }
  }
}

export const commentBlog = (blog, commentText) => {
  return async (dispatch) => {
    try {

      const comment = await commentService.create({ id: blog.id, text: commentText })

      const updatedBlog = { ...blog, comments: [...blog.comments, comment] }

      dispatch({
        type: "UPDATE-BLOG",
        blogID: blog.id,
        updatedBlog: updatedBlog
      })
    } catch (error) {
      dispatch(addNotification(
        `Could not comment on ${blog.title}, reason: ${error.message}`,
        "error"
      ))
    }
  }
}

export const initBlogs = () => {
  return async (dispatch, getState ) => {

    const { blogs } = getState()
    if (blogs.length !== 0) {
      return
    }

    try {
      const blogs = await blogService.getAll()
      dispatch({
        type: "INIT-BLOGS",
        blogs: blogs
      })
    } catch (error) {
      setTimeout(() => dispatch(initBlogs()), 5000)
    }
  }
}

export default reducer
