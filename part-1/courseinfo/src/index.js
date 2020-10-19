import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  return (
    <h1>{props.course}</h1> 
  )
}


const Part = (part) => {
  return (
    <p>
      {part.part_number} {part.exercises}
    </p>
  )
}


const Content = (props) => {

  const parts = props.parts.map((p, index) => <Part part_number={p.name} exercises={p.exercises} key={index} />)

  return parts
}


const Total = (props) => {

  const total = props.parts.reduce((acc, next) => {return acc + next.exercises}, 0)

  return (
    <p>
      Number of exercises {total}
    </p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))