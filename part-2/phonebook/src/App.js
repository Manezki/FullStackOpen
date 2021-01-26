import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Contacts from "./components/Contacts";
import NewContactForm from "./components/NewContactForm";
import * as contactService from "./services/contacts";

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchState, setSearchState ] = useState('')

  useEffect( () => {
    contactService
      .getAll()
      .then( (contacts) => {

        // Prevent duplicate entries in the contacts. Priority on serverside contacts
        const checkUpSet = new Set(contacts.map(p => p.name))
        const newPersons = [...contacts].concat(persons.filter(p => !checkUpSet.has(p.name)))
        setPersons(newPersons)
        
      })
    // Run only on first render, so keeping the dependencies empty
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.find( (person) => {
          return person.name === newName
        })
    ) {
    
      alert(`${newName} is already added to phonebook`)
    
    } else {

      contactService
        .create({name: newName, number: newNumber})
        .then( (contact) => {
          setPersons(
            persons.concat([contact])
          )
          setNewName("")
          setNewNumber("")
        })
    
    }
  }

  const handleChange = (setter) => {
    return ( event ) => { setter(event.target.value) }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Search state={searchState} setter={setSearchState}/>
      <h2>Add a new entry</h2>
      <NewContactForm ccName={newName} ccNumber={newNumber}
        handleName={handleChange(setNewName)} handleNumber={handleChange(setNewNumber)}
        handleSubmit={handleSubmit} />
      <Contacts persons={persons} setPersons={setPersons} searchState={searchState}/>
    </div>
  )
}

export default App;
