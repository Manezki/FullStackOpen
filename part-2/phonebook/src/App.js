import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Contacts from "./components/Contacts";
import NewContactForm from "./components/NewContactForm";

import axios from "axios";

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchState, setSearchState ] = useState('')

  useEffect( () => {
    axios
      .get("http://localhost:3001/persons")
      .then( (response) => {

        // Prevent duplicate entries in the contacts
        const checkUpSet = new Set(persons.map(p => p.name))
        const newPersons = [...persons].concat(response.data.filter(p => !checkUpSet.has(p.name)))
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
      
      setPersons(
        persons.concat([{name: newName, number: newNumber}])
      )
      setNewName("")
      setNewNumber("")
    
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
      <Contacts persons={persons} searchState={searchState}/>
    </div>
  )
}

export default App;
