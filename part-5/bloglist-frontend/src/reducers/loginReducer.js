import blogService from "../services/blogs"
import { addNotification } from "./notificationReducer"

const reducer = (state = {}, action) => {
  switch(action.type) {
  case "SET-USER":
    window.localStorage.setItem("loggedInUser", JSON.stringify(action.loggedInUser))
    blogService.setToken(action.loggedInUser.token)
    return action.loggedInUser
  case "REMOVE-USER":
    window.localStorage.removeItem("loggedInUser")
    return {}
  default:
    return state
  }
}

export const loginUser = (user) => {
  return async (dispatch) => {
    dispatch({
      type: "SET-USER",
      loggedInUser: user
    })
    dispatch(addNotification(
      `Logged in as ${user.username}`,
      "success"
    ))
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({
      type: "REMOVE-USER"
    })
  }
}

export const restoreLogin = () => {
  return async (dispatch) => {
    let maybeUser = window.localStorage.getItem("loggedInUser")
    if (maybeUser) {
      maybeUser = JSON.parse(maybeUser)
      if (maybeUser.token && maybeUser.username && maybeUser.name && maybeUser.id) {
        dispatch({
          type: "SET-USER",
          loggedInUser: maybeUser
        })
      }
    }
  }
}


export default reducer
