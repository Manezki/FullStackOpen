import React from "react";
import Contact from "./Contact";
import * as contactService from "../services/contacts";

const Contacts = ( {persons, setPersons, searchState} ) => {
    const slice = searchState.length

    const deleteHandlerFactory = (person) => {
      return ( event ) => {

        if (window.confirm("Remove " + person.name + " from contacts?")) {
            contactService.remove(person.id)
            .then( () => {
              setPersons(persons.filter( (p) => p.id !== person.id))
            })
          }

        }
    }

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
              return <Contact key={person.name} name={person.name} number={person.number} deleteHandler={deleteHandlerFactory(person)} />
            } )}
          </tbody>
        </table>
      </>
    )
  }

export default Contacts
