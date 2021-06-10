export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const isString = (text: unknown): text is string => {
  return (typeof text === "string" || text instanceof String);
};

export const isNumber = (value: unknown): value is number => {
  return !isNaN(Number(value));
};

export const isDate = (date: unknown): boolean => {
  if (!date) {
    return false;
  }
  return (isString(date) && Boolean(Date.parse(date)));
};
