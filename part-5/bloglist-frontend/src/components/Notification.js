import React from "react"

const Notification = ({ type, message }) => {
  return (
    <div className={`notification ${type}`}>
      <h2>{message}</h2>
    </div>
  )
}

export default Notification