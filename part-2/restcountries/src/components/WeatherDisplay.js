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

export default WeatherDisplay;
