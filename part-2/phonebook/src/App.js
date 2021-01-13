import React, { useState } from "react";

const Search = ( {state, setter} ) => {

  return (
    <div>
      <p>Filter numbers</p>
      <input onChange={ (event) => setter(event.target.value)} value={state}/>
    </div>
  )
}

const Results = ( {persons, searchState} ) => {
  const slice = searchState.length

  var filteredPersons = (slice !== 0)
    ? persons.filter( (person) => {
        return person.name.toLowerCase().includes(searchState.toLowerCase())
      } )
    : persons

  return (
    <>
      <h2>Numbers</h2>
      {filteredPersons.map( (person) => {
        return <p key={person.name}>{person.name}: {person.number}</p>
      } )}
    </>
  )
}


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
      <form onSubmit={handleSubmit}>
        <div>
          name: <input 
            value={newName}
            onChange={handleChange(setNewName)}
          />
        </div>
        <div>
          number: <input 
            value={newNumber}
            onChange={handleChange(setNewNumber)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <div>debug: {newName}</div>
      <Results persons={persons} searchState={searchState}/>
    </div>
  )
}

export default App;
