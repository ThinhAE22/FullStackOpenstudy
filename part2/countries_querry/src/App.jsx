import { useState, useEffect } from 'react'
import axios from 'axios'
import Display from '../components/Display'

const App = () => {
  const [country, setCountry] = useState('') // Initialize as an empty string
  const [list, setList] = useState({name: [],fulldata: []}) // Initialize as an empty array

  useEffect(() => {
    //fetch country
    if (country) {
      console.log('Fetching countries starting with', country)
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          const filteredCountries = response.data.filter(countryData =>
            countryData.name.common.toLowerCase().startsWith(country.toLowerCase())
          )
          // Extract only the common names of the countries
          console.log(filteredCountries) // this return everything
          const countryNames = filteredCountries.map(countryData => countryData.name.common)
          //this return only the name.common
          setList({name:countryNames,fulldata:filteredCountries})
        })
        .catch(error => {
          console.error('Error fetching countries:', error)
        })
    } else {
      setList({name: [],fulldata: []}) // Reset list to empty when the field is blank
    }
  }, [country])

  const handleChange = (event) => {
    setCountry(event.target.value)
  }

  return (
    <div>
      <form>
        find country: <input value={country} onChange={handleChange} />
      </form>
      <Display name_list={list.name} fulldata={list.fulldata} setList={setList}/>
    </div>
  )
}

export default App
