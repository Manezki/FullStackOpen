const reducer = (state = "", action) => {
  switch (action.type) {
    case "CREATE":
      return `Created: ${action.content}`
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

export const notify = (msg) => {
  return {
    type: "NOTIFY",
    notification: msg
  }
}

export default reducer