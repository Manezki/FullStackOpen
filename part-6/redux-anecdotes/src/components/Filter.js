import React from 'react'
import { useDispatch } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

const Filter = () => {
  const dispatch = useDispatch()

  return (
    <label>Filter:
      <input
        type="text"
        name="filter"
        onChange={(event) => dispatch(setFilter(event.target.value))}
        />
    </label>
  )
}

export default Filter