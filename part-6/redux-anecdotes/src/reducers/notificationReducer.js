const reducer = (state = { message: "", timeOutID: null }, action) => {
  switch (action.type) {
    case "NOTIFY":
      if (state.timeOutID) {
        clearTimeout(state.timeOutID)
      }

      return {
        message: `${action.notification}`,
        timeOutID: action.timeOutID
      }
    case "RESET-NOTIFICATION":
      return {
        message: "",
        timeOutID: null
      }
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
    
    const timeOutID = setTimeout(() => {
      dispatch(removeNotification())
    }, seconds*1000)
    
    dispatch({
      type: "NOTIFY",
      notification: msg,
      timeOutID
    })
  }
}

export default reducer