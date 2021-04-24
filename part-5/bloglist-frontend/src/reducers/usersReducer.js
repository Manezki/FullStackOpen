import userService from "../services/users"

const reducer = (state = [], action) => {
  switch (action.type) {
  case "INIT-USERS":
    return [].concat(action.users)
  default:
    return state
  }
}

export const initUsers = () => {
  return async (dispatch, getState) => {

    const { users } = getState()
    if (users.length !== 0) {
      return
    }

    try {
      const users = await userService.getAll()
      dispatch({
        type: "INIT-USERS",
        users: users
      })
    } catch (error) {
      setTimeout(() => dispatch(initUsers()), 5000)
    }
  }
}

export default reducer
