import React from 'react'
import { connect } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

const Filter = ({ setFilter }) => {
  return (
    <label>Filter:
      <input
        type="text"
        name="filter"
        onChange={(event) => setFilter(event.target.value)}
        />
    </label>
  )
}

const mapDispatchToProps = {
  setFilter
}

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter)

export default ConnectedFilter