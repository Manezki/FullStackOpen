const reducer = (state = {}, action) => {
  switch(action.type) {
  case "SET-NOTIFICATION":
    if (state) {
      clearTimeout(state.timeOutID)
    }
    return {
      message: action.message,
      type: action.notificationType,
      timeOutID: action.timeOutID
    }
  case "REMOVE-NOTIFICATION":
    return {}
  default:
    return state
  }
}

export const addNotification = (message, type) => {
  return async dispatch => {
    const timeOutID = setTimeout(() =>
      dispatch(removeNotification()), 5000
    )
    dispatch({
      type: "SET-NOTIFICATION",
      message,
      notificationType: type,
      timeOutID
    })
  }
}

export const removeNotification = () => {
  return {
    type: "REMOVE-NOTIFICATION"
  }
}

export default reducer
