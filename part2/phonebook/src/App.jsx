import { useState, useEffect } from 'react'
import DisplayName from '../components/DisplayName'
import Filter from '../components/Filter'
import Form from '../components/Form'
import BEndComm from '../services/persons'
import Notification from '../components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [ServerMessage, setServerMessage] = useState({ message: '', type: '' })

  //get server data
  useEffect(() => {
    BEndComm
      .getAll()
      .then(PersonList => {
        console.log('promise fulfilled')
        setPersons(PersonList)
      })
  }, [])


  // Helper function to generate unique ID
  const generateUniqueId = () => {
    const maxId = persons.reduce((max, person) => Math.max(max, parseInt(person.id)), 0);
    return (maxId + 1).toString(); // Increment the highest ID by 1 and return it as a string
  };

  const addName = (event) => {
    event.preventDefault()

    // Check if the name already exists
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      const confirmationNU = window.confirm(`${newName} is already added to phonebook, replace old number with new one?`);
    
      if (confirmationNU) {
        // Update the number for the existing person
        const updatedPerson = {
          ...existingPerson, // Spread the existing person object
          number: newNumber,  // Update the number with the new one
        };

        BEndComm
        .updateNumber(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id === returnedPerson.id ? returnedPerson : person
          ));
          setNewName('');
          setNewNumber('');
          setServerMessage({message: `Updated ${updatedPerson.name} number`, type: 'success'})
          setTimeout(() => {
            setServerMessage({ message: '', type: '' });
          }, 5000);
        })
        .catch(error => {
          setServerMessage({ message: `${error.response.data.error}`, type: 'error' })
          setTimeout(() => {
            setServerMessage({ message: '', type: '' });
          }, 5000);

          //Re update the server
          BEndComm
            .getAll()
            .then(updatedList => {
              setPersons(updatedList);
          });
        })
      }
      return;
    }

    const newId = generateUniqueId(); // Generate a unique ID

    // Add the new person with both name and number
    const personObject = {
      name: newName,
      number: newNumber,
      id: newId, // Convert to string
    };

    BEndComm
    .create(personObject)
    .then(returnPerson => {
      setPersons(persons.concat(returnPerson))
      setNewName('')
      setNewNumber('')
      setServerMessage({message: `Added ${personObject.name}`, type: 'success'})
      setTimeout(() => {
        setServerMessage({ message: '', type: '' });
      }, 5000);
    })
    .catch(error => {
      setServerMessage({ message: `${error.response.data.error}`, type: 'error' })
      setTimeout(() => {
        setServerMessage({ message: '', type: '' });
      }, 5000);
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
  ? persons.filter(person =>
      person.name.toLowerCase().startsWith(filter.toLowerCase()) // Match names that start with the filter
    )
  : persons;

  
  // Delete contact
  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`);

    if (confirmDelete) {
      BEndComm
        .deleteEntry(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
      });
    }
  };

  


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={ServerMessage.message} type={ServerMessage.type} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add New Contact</h2>
      <Form onSubmit={addName} value_name={newName} onChange_name={handleNameChange} 
      value_number = {newNumber} onChange_number = {handleNumberChange} />
      <h2>Numbers</h2>
      <DisplayName persons_list={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
