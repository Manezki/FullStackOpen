import React, { useState } from "react";
import Search from "./components/Search";
import Contacts from "./components/Contacts";
import NewContactForm from "./components/NewContactForm";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchState, setSearchState ] = useState('')

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
