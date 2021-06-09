import React from 'react'
import { CoursePart } from "../App"
import { assertNever } from "../utils"

const Part = ({ coursePart }: { coursePart: CoursePart }): JSX.Element => {
  switch (coursePart.type) {
    case "normal":
      return (
        <table style={{ marginLeft: 20 }}>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{coursePart.name}</td>
            </tr>
            <tr>
              <td>ExerciseCount:</td>
              <td>{coursePart.exerciseCount}</td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>{coursePart.description}</td>
            </tr>
          </tbody>
        </table>
      )
    case "groupProject":
      return (
        <table style={{ marginLeft: 20 }}>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{coursePart.name}</td>
            </tr>
            <tr>
              <td>ExerciseCount:</td>
              <td>{coursePart.exerciseCount}</td>
            </tr>
            <tr>
              <td>Group Project Count:</td>
              <td>{coursePart.groupProjectCount}</td>
            </tr>
          </tbody>
        </table>
      )
    case "submission":
      return (
        <table style={{ marginLeft: 20 }}>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{coursePart.name}</td>
            </tr>
            <tr>
              <td>ExerciseCount:</td>
              <td>{coursePart.exerciseCount}</td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>{coursePart.description}</td>
            </tr>
            <tr>
              <td>Exercise Submission Link:</td>
              <td>{coursePart.exerciseSubmissionLink}</td>
            </tr>
          </tbody>
        </table>
      )
    case "special":
      return (
        <table style={{ marginLeft: 20 }}>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{coursePart.name}</td>
            </tr>
            <tr>
              <td>ExerciseCount:</td>
              <td>{coursePart.exerciseCount}</td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>{coursePart.description}</td>
            </tr>
            <tr>
              <td>Requirements:</td>
              <td>{coursePart.requirements[0]}{coursePart.requirements.slice(1).map((req) => {
                return `, ${req}`
              })}</td>
            </tr>
          </tbody>
        </table>
      )
    default:
      assertNever(coursePart);
      return <></>
  }
}

export default Part
