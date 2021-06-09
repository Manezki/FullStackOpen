import React from 'react'
import { CoursePart } from '../App'
import Part from "./Part"

const Content = ({ courseParts }: { courseParts: CoursePart[] }): JSX.Element => {
  return <>
    {courseParts.map((course) => <p key={course.name}>{course.name} {course.exerciseCount} <Part coursePart={course}/></p>)}
  </>
}

export default Content
