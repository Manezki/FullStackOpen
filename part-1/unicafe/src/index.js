import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Button = (props) => {
  
  const { onClick, text } = props

  return (
    <>
      <button onClick={onClick}>
        {text}
      </button>
    </>
  )
}


const Statistic = (props) => {
  const { title, value } = props

  return (
    <tr>
      <td>{ title }</td>
      <td>{ value }</td>
    </tr>
  )
}


const Statistics = (props) => {
  const { good, neutral, bad } = props

  const total = good + neutral + bad

  if (total === 0) {
    return (
      <>
        No feedback given
      </>
    )
  } else {
    return (
      <table>
        <colgroup>
          <col></col>
          <col style={{"backgroundColor": "#eee"}}></col>
        </colgroup>
        <tbody>
          <Statistic title="good" value={good} />
          <Statistic title="neutral" value={neutral} />
          <Statistic title="bad" value={bad} />
          <Statistic title="all" value={ total } />
          <Statistic title="average" value={ (total === 0) ? 0 : (good*1 + bad*(-1))/total } />
          <Statistic title="positive" value={ (total === 0) ? "0 %" : (good/total)*100 + "%" } />
        </tbody>
      </table>
    )
  }
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (setter, value) => () => {
    setter(value + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleClick(setGood, good)} text="good" />
      <Button onClick={handleClick(setNeutral, neutral)} text="neutral" />
      <Button onClick={handleClick(setBad, bad)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />      
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
