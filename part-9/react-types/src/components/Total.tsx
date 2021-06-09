import React from 'react'

const Total = ({ exerciseCounts }: { exerciseCounts: number[] }): JSX.Element => {
  return <p>
    Number of exercises{" "}
    {exerciseCounts.reduce((total, exercises) => total + exercises, 0)}
  </p>
}

export default Total
