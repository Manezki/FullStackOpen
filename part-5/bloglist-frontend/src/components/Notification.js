import React from "react"

const Notification = ({ type, message }) => {
  return (
    <div className="notification" id={type}>
      <h2>{message}</h2>
    </div>
  )
}

export default Notification