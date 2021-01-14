import React from "react";

const NewContactForm = ( {ccName, ccNumber, handleName, handleNumber, handleSubmit} ) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input 
          value={ccName}
          onChange={handleName}
        />
      </div>
      <div>
        number: <input 
          value={ccNumber}
          onChange={handleNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default NewContactForm
