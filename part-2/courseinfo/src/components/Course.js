import React from 'react';

const Header = ({ name }) => {
    return (
      <h1>{name}</h1>
    )
  }
  
  const Total = ({ exercises }) => {
    const sum = exercises.reduce( (agg, elem) => {
      return agg + elem
    }, 0)
    return(
      <p><b>Number of exercises {sum}</b></p>
    ) 
  }
  
  const Part = ({ part }) => {
    return (
      <p>
        {part.name} {part.exercises}
      </p>    
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map( (part) => {
          return <Part part={part} key={part.id} />
        })}
      </div>
    )
  }  
  
  const Course = ({ course }) => {
  
    return (
      <>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total exercises={course.parts.map( (part) => {
          return part.exercises
        })}/>
      </>
    )
  }

export default Course
