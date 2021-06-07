
interface exerciseDesciption {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface exerciseArguments {
  exerciseHours: Array<number>,
  targetHours: number,
}

interface postExerciseArgument {
  daily_exercises?: string[] | undefined,
  target?: string | undefined
}

export const calculateExercises = (exerciseHours: Array<number>, targetHours: number): exerciseDesciption => {
  const averageTraining: number = exerciseHours.reduce((col, cur) => col + cur, 0)/exerciseHours.length;
  const [rating, ratingDesc]: [rating: number, ratingDesc: string] = (averageTraining >= targetHours*0.9)
    ? [3, "Fabulous job"]
    : (averageTraining >= targetHours*0.75)
      ? [2, "OK job, but room for improvement"]
      : [1, "Meh, lazy"];
  return {
    periodLength: exerciseHours.length,
    trainingDays: exerciseHours.filter((day) => day !== 0).length,
    success: exerciseHours.reduce((col, cur) => col && (cur >= targetHours), true),
    rating: rating,
    ratingDescription: ratingDesc,
    target: targetHours,
    average: averageTraining,
  };
};

const parseExerciseCliArguments = (args: Array<string>): exerciseArguments => {
  if (args.length < 4) throw new Error("Too few arguments");
  if (!args.slice(2).reduce((col, cur) => col && (!isNaN(Number(cur))), true)) {
    throw new Error("Target hours and exercise hours must be numbers");
  }

  return {
    targetHours: Number(args[3]),
    exerciseHours: args.slice(3).map((hour) => Number(hour)),
  };
};

export const parseExerciseQueryArguments = (postArguments: postExerciseArgument): exerciseArguments => {
  if (!postArguments.daily_exercises) throw new Error("'daily_exercises' of type Array<number> required");
  if (!(postArguments.daily_exercises instanceof Array)) throw new Error("'daily_exercises' of type Array<number> required");
  if (!postArguments.target) throw new Error("'target' of type number required");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (!postArguments.daily_exercises.reduce((col, cur) => col && (!isNaN(Number(cur))), true)) {
    throw new Error("'daily_exercises' values must be numbers");
  }
  if (isNaN(Number(postArguments.target))) throw new Error("'target' must be of type number");

  return {
    targetHours: Number(postArguments.target),
    exerciseHours: postArguments.daily_exercises.map((hour: string) => Number(hour)),
  };
};

try {
  const { exerciseHours, targetHours } = parseExerciseCliArguments(process.argv);
  console.log(calculateExercises(exerciseHours, targetHours));
} catch (e) {
  if (e instanceof Error) {
    console.log("Error, something bad happened, message: ", e.message);
  } else {
    console.log("Unknown error");
  }
}
