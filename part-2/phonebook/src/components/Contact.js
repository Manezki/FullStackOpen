import React from "react";

const Contact = ( {name, number} ) => {

  const tdStyling = {
    padding: "5px",
    border: "1px dotted"
  }

  return (
    <tr>
      <td style={tdStyling}>{name}</td>
      <td style={tdStyling}>{number}</td>
    </tr>
  )
}

export default Contact
