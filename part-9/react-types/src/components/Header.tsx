import React from 'react'

const Header = ({ name }: { name: string }): JSX.Element => {
  return <h2>
    {name}
  </h2>
}

export default Header
