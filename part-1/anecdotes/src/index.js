import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(props.anecdotes.length))

  const randomAnecdoteIndex = () => {
    const candidate = Math.floor(Math.random() * props.anecdotes.length)

    if (candidate === selected) {
      return randomAnecdoteIndex()
    } else {
      return candidate
    }
  }

  const handleVote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1

    setPoints(newPoints)
  }

  const maxVoteIndex = () => {
    const maxVote = points.reduce( (acc, cur) => acc >= cur ? acc : cur )

    return points.findIndex( (element) => element === maxVote )
  }

  return (
    <div>
      <div>
        <h1>{props.anecdotes[selected]}</h1>
        <p> This anecdote has {points[selected]} votes</p>
      </div>
      <div>
        <button onClick={ handleVote }> Vote this anecdote </button>
        <button onClick={ () => setSelected(randomAnecdoteIndex())}> Another anecdote, please! </button>
      </div>
      <div>
        <h2>Anecdote with the most votes</h2>
        <p>{props.anecdotes[maxVoteIndex()]}</p>
      </div>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <React.StrictMode>
    <App anecdotes={anecdotes}/>
  </React.StrictMode>,
  document.getElementById('root')
);
