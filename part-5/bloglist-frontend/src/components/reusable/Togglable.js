import React, { useState, useImperativeHandle } from 'react'

const Togglable = React.forwardRef(({ buttonLabel, cancelLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

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

export default Togglable
