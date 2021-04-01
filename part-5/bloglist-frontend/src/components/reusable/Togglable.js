import React, { useState, useImperativeHandle } from "react"
import PropTypes from "prop-types"

const Togglable = React.forwardRef(({ buttonLabel, cancelLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const setVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      setVisibility
    }
  })

  if (visible) {
    return (
      <>
        {children}
        <button onClick={setVisibility}>{cancelLabel}</button>
      </>
    )
  } else {
    return (
      <button onClick={setVisibility}>{buttonLabel}</button>
    )
  }
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
}

export default Togglable
