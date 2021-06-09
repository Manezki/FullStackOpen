import React from 'react';
import Header from "./components/Header"
import Content from "./components/Content"
import Total from "./components/Total"

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseRequiredPart extends CoursePartBase, CourseDescription {
  type: "special";
  requirements: string[];
}

interface CourseNormalPart extends CoursePartBase, CourseDescription {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartBase, CourseDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseDescription extends CoursePartBase {
  description: string;
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseRequiredPart;

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header name={courseName}/>
      <Content courseParts={courseParts}/>
      <Total exerciseCounts={courseParts.map((course) => course.exerciseCount)}/>
    </div>
  );
};

export default App;