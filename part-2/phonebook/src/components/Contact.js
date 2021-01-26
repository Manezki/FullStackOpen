import React from "react";

const Contact = ( {name, number, deleteHandler} ) => {

  const tdStyling = {
    padding: "5px",
    border: "1px dotted"
  }

  return (
    <tr>
      <td style={tdStyling}>{name}</td>
      <td style={tdStyling}>{number}</td>
      <td style={tdStyling}>
        <button onClick={deleteHandler}>Delete</button>
      </td>
    </tr>
  )
}

export default Contact
