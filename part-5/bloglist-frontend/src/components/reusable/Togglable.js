import React, { useState, useImperativeHandle } from "react"
import PropTypes from "prop-types"

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
        <button onClick={toggleVisibility}>{cancelLabel}</button>
      </>
    )
  } else {
    return (
      <button onClick={toggleVisibility}>{buttonLabel}</button>
    )
  }
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
}

export default Togglable
