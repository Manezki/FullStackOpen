import express from "express";
import { parseBmiQueryArguments, calculateBmi } from "./bmiCalculator";
import { parseExerciseQueryArguments, calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  try {
    const { height, weight } = parseBmiQueryArguments([String(req.query.height), String(req.query.weight)]);
    res.send({
      height: height,
      weight: weight,
      bmi: calculateBmi(height, weight)
    });
  } catch (error) {
    let errorResponse: string;

    if (error instanceof Error) {
      errorResponse = `Error, something bad happened, message: ${error.message}`;
    } else {
      errorResponse = `Unknown error`;
    }
    
    res.send({
      error: errorResponse
    });
  }
});

app.post("/exercises", (req, res) => {
  try {
    const { exerciseHours, targetHours } = parseExerciseQueryArguments(req.body);
    res.send(calculateExercises(exerciseHours, targetHours));
  } catch (error) {
    let errorResponse: string;

    if (error instanceof Error) {
      errorResponse = `Error, something bad happened, message: ${error.message}`;
    } else {
      errorResponse = `Unknown error`;
    }
    
    res.send({
      error: errorResponse
    });
  }
});

app.listen(3003, () => {
  console.log("Server running @ http://localhost:3003");
});