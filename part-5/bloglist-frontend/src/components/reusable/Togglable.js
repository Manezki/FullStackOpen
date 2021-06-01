import React, { useState, useImperativeHandle } from "react"
import PropTypes from "prop-types"

import Button from "react-bootstrap/Button"

const Togglable = React.forwardRef(({ buttonLabel, cancelLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  if (visible) {
    return (
      <>
        {children}
        <Button onClick={toggleVisibility} variant="outline-dark">{cancelLabel}</Button>
      </>
    )
  } else {
    return (
      <Button onClick={toggleVisibility} variant="primary">{buttonLabel}</Button>
    )
  }
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
}

export default Togglable
