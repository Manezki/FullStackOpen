import React from "react";

const Notification = ( {notification} ) => {

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }

  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }

  return (
    <>
      {notification.type === "success"
        ?<div style={successStyle} key={notification.msg}>{notification.msg}</div>
        : <div style={errorStyle} key={notification.msg}>{notification.msg}</div>}
    </>
  )
}

export default Notification
