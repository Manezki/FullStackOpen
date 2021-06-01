import React from "react"

import Alert from "react-bootstrap/Alert"

const Notification = ({ type, message }) => {

  const bootstrap_variant = (type === "success" ? "success" : "danger")

  return (
    <Alert variant={bootstrap_variant}>
      {message}
    </Alert>
  )
}

export default Notification