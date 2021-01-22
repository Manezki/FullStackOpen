import React, {useState, useEffect} from "react";

import axios from "axios";

import WeatherDisplay from "./WeatherDisplay";

const CountryDisplay = ( {country} ) => {

  const [weather, setWeather] = useState({})

  useEffect( () => {

    let isMounted = true
    const api_key = process.env.REACT_APP_API_KEY

    axios
      .get("http://api.weatherstack.com/current", {
        params: {
          access_key: api_key,
          query: country.capital,
          units: "m"
        }
      }).then( (response) => {
        if (isMounted) setWeather(response.data);
    })

    return () => {isMounted = false}

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

export default CountryDisplay;
