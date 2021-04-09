const reducer = (state = "", action) => {
  switch (action.type) {
    case "NOTIFY":
      return `${action.notification}`
    case "RESET-NOTIFICATION":
      return ""
    default:
      return state
  }
}

export const removeNotification = () => {
  return {
    type: "RESET-NOTIFICATION"
  }
}

export const notify = (msg, seconds) => {
  return async (dispatch) => {
    
    setTimeout(() => {
      dispatch(removeNotification())
    }, seconds*1000)
    
    dispatch({
      type: "NOTIFY",
      notification: msg
    })
  }
}

export default reducer