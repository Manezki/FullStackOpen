import React, {useState, useEffect} from "react";

import axios from "axios";

const Query = ( { query, setQuery } ) => {
  return (
    <>
    Search for a country: <input onChange={ (e) => setQuery(e.target.value)} value={query}></input>
    </>
  )
}

const WeatherDisplay = ( {weather} ) => {

  if (Object.keys(weather).length === 0) {
    return (
      <>
      </>
    )
  }

  return (
    <>
      <h2>Weather in {weather.location.name}</h2>
      <p><b>Temperature</b>: {weather.current.temperature} Celcius</p>
      <img src={weather.current.weather_icons[0]} alt={weather.current.weather_descriptions[0]} width="240" height="240"></img>
      <p><b>Wind</b>: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
    </>
  )
}

const CountryDisplay = ( {country} ) => {

  const [weather, setWeather] = useState({})

  useEffect( () => {

    const api_key = process.env.REACT_APP_API_KEY

    axios
      .get("http://api.weatherstack.com/current", {
        params: {
          access_key: api_key,
          query: country.capital,
          units: "m"
        }
      }).then( (response) => {
        setWeather(response.data)
    })

    // Api key not changing during runtime
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h1>{country.name}</h1>
      
      <div>
        <div>
          Capital: {country.capital}
        </div>
        <div>
          Population: {country.population}
        </div>
      </div>
      
      <h2>Languages:</h2>
      <ul>
        {country.languages.map( (l) => {
            return <li key={l.name}>{l.name}</li>
          })}
      </ul>

      <img src={country.flag} alt={"Flag of " + country.name} width="360" height="240"></img>
      <WeatherDisplay weather={weather} />
    </>
  )
}

const ResultCountry = ( { country } ) => {

  const [countryShown, setCountryShown] = useState(false)

  return (
    <>
      <p>{country.name}
        <button onClick={(e) => {
          setCountryShown(!countryShown)
        }}>{(countryShown) ? "Hide" : "Show"}</button>
      </p>
      {(countryShown) ? <CountryDisplay country={country} /> : <></>}
    </>
  )
}

const ResultDisplay = ( { countries } ) => {
  return (
    <>
      {
        countries
          .map( (c) => {
            return <ResultCountry key={c.name} country={c} />
          })
      }
    </>
  )
}

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
