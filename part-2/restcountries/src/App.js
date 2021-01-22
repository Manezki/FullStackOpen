import React, {useState, useEffect} from "react";

import axios from "axios";

import Query from "./components/Query";
import CountryDisplay from "./components/CountryDisplay";
import ResultDisplay from "./components/ResultDisplay";


const displaySwitch = ( filteredCountries ) => {
  if (filteredCountries.length === 0) {
    return ("No country names matched the filter")
  } else if (filteredCountries.length === 1) {
    return <CountryDisplay country={filteredCountries[0]} />
  } else if (filteredCountries.length < 10) {
    return <ResultDisplay countries={filteredCountries} />
  } else {
    return ("Too many matches, specify country name above ^^")
  }
}

const App = () => {
  
  const [query, setQuery] = useState("")
  const [countries, setCountries] = useState([])

  useEffect( () => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then( (response) => {
        setCountries(response.data)
      })
  }, [])

  const filteredCountries = countries.filter( (c) => c.name.toLowerCase().includes(query.toLocaleLowerCase()))

  return (
    <>
      <Query query={query} setQuery={setQuery} />
      <div>
        {displaySwitch(filteredCountries)}
      </div>
    </>
  );
}

export default App;
