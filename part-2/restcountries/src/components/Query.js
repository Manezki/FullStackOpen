const Query = ( { query, setQuery } ) => {
  return (
    <>
    Search for a country: <input onChange={ (e) => setQuery(e.target.value)} value={query}></input>
    </>
  )
}

export default Query;