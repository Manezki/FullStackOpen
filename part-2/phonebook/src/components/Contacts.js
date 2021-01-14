import React from "react";
import Contact from "./Contact";

const Contacts = ( {persons, searchState} ) => {
    const slice = searchState.length
  
    const filteredPersons = (slice !== 0)
      ? persons.filter( (person) => {
          return person.name.toLowerCase().includes(searchState.toLowerCase())
        } )
      : persons
    
    return (
      <>
        <table>
          <thead>
            <tr>
              <th colSpan="2"><h2>Contacts</h2></th>
            </tr>
          </thead>
          <tbody>
            {filteredPersons.map( (person) => {
              return <Contact key={person.name} name={person.name} number={person.number} />
            } )}
          </tbody>
        </table>
      </>
    )
  }

export default Contacts
