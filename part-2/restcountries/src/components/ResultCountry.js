import React, {useState} from "react";

import CountryDisplay from "./CountryDisplay"

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

export default ResultCountry;
