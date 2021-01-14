import React from "react";

const Search = ( {state, setter} ) => {

    return (
      <div>
        <p>Filter numbers</p>
        <input onChange={ (event) => setter(event.target.value)} value={state}/>
      </div>
    )
  }

export default Search