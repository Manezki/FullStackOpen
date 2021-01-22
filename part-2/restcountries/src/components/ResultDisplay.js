import ResultCountry from "./ResultCountry";

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

export default ResultDisplay;