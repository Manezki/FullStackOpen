
interface bmiArguments {
  height: number,
  weight: number,
}

export const calculateBmi = (height: number, weight: number): string => {

  const heightM: number = height/100;
  const bmi: number = weight/(heightM**2);

  if (bmi < 25) {
    return "Normal (healthy weight)";
  } else if (25 <= bmi && bmi < 29) {
    return "Overweight";
  } else if (29 <= bmi ) {
    return "Obese";
  } else {
    throw new Error(`BMI not in the recognized range. BMI: ${bmi}`);
  }
};

export const parseBmiCliArguments = (args: Array<string>): bmiArguments => {
  if (args.length < 4) throw new Error("Too few arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers");
  }
};

export const parseBmiQueryArguments = (args: Array<string>): bmiArguments => {
  if (args.length < 2) throw new Error("Too few arguments");
  if (args.length > 2) throw new Error("Too many arguments");

  if (!isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
    return {
      height: Number(args[0]),
      weight: Number(args[1]),
    };
  } else {
    throw new Error("Provided values were not numbers");
  }
};

try {
  const { height, weight } = parseBmiCliArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (e) {
  if (e instanceof Error) {
    console.log("Error, something bad happened, message: ", e.message);
  } else {
    console.log("Unknown error");
  }
}
