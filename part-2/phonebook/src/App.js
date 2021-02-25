import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Contacts from "./components/Contacts";
import NewContactForm from "./components/NewContactForm";
import Notification from "./components/Notification";
import * as contactService from "./services/contacts";

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchState, setSearchState ] = useState('')
  const [ notifications, setNotifications ] = useState([])
  const [ notificationTimeOuts, setNotificationTimeOuts ] = useState([])

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

  const notify = (notification) => {

    const timeOutIDs = notifications.concat(notification).reverse()
      .reduce( (collector, lastNotif) => {

        const notificationsToKeep = collector.map( (pair) => pair.notif )
        const timeOutTiming = 5000 - (notification.created - lastNotif.created)

        const timeOut = setTimeout( () => {
          setNotifications(notificationsToKeep)
        }, timeOutTiming)

        return collector.concat({"notif": lastNotif, "timeOut": timeOut})

      }, [] )
      .map( (el) => el.timeOut)

    // Set States
    notificationTimeOuts.map( (timeOutID) => clearTimeout(timeOutID))
    setNotificationTimeOuts(timeOutIDs)
    setNotifications(notifications.concat(notification))

  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.find( (person) => {
          return person.name === newName
        })
      ) {
    
        if (window.confirm(`${newName} is allready in the phonebook. Replace number?`)) {

          const existingContact = persons.find( (person) => {
              return person.name === newName
            })

          contactService
            .update(existingContact.id, {...existingContact, "number": newNumber})
            .then( (updatedContact) => {

              setPersons(
                persons.map( (p) => p.id !== existingContact.id ? p : updatedContact)
              )

              const notification = {
                "type": "success",
                "msg": `Number updated for ${newName}!`,
                "created": Date.now()
              }

              notify(notification)

              setNewName("")
              setNewNumber("")

            })
            .catch( (error) => {

              if (error.response.status === 404) {

                const contactName = JSON.parse(error.response.config.data).name

                const notification = {
                  "type": "error",
                  "msg": `${contactName} was deleted on the server.`,
                  "created": Date.now()
                }
                notify(notification)

                setPersons(persons.filter( (p) => p.name !== contactName))

              } else if (error.response.status === 400) {

                const notification = {
                  "type": "error",
                  "msg": error.response.data.error,
                  "created": Date.now()
                }
                notify(notification)

              }
            })
        }
    
    } else {

      contactService
        .create({name: newName, number: newNumber})
        .then( (contact) => {
          setPersons(
            persons.concat([contact])
          )

          const notification = {
            "type": "success",
            "msg": `${newName} added to phonebook!`,
            "created": Date.now()
          }

          notify(notification)

          setNewName("")
          setNewNumber("")
        })
        .catch( error => {

          if (error.response.status === 400) {

            const notification = {
              "type": "error",
              "msg": error.response.data.error,
              "created": Date.now()
            }
            notify(notification)

          }
        })
    
    }
  }

  const handleChange = (setter) => {
    return ( event ) => { setter(event.target.value) }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notifications.map( (notif) => <Notification notification={notif} key={notif.created}/>)}
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
