import { Entry, Gender, Patient } from "./types";
import {v1 as uuid} from "uuid";

interface patientPostParameters {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown,
  entries: unknown[]
}

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation, entries }: patientPostParameters): Patient => {
  return {
    id: uuid(),
    name: parseName(name),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    ssn: parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: parseEntries(entries),
  };
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isArray = (arg: unknown): arg is unknown[] => {
  return Array.isArray(arg);
};

const isObject = (arg: unknown): arg is Record<string, unknown> => {
  return typeof arg === "object";
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const isEntry = (entry: unknown): entry is Entry => {
  return (!entry) || !isObject(entry) || Object.keys(entry).includes("type");
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect or missing date of birth: " + dateOfBirth);
  }

  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }

  return gender;
};

const parseEntries = (entries: unknown[]): Entry[] => {
  if (!entries || !isArray(entries)) {
    throw new Error("Entries argument is missing or not array: " + entries);
  }

  const validatedEntries = entries.map((entry) => {
    if (!entry || !isEntry(entry)){
      throw new Error("Entry has no parameter 'type': " + entries.find((entry) => !isEntry(entry)));
    }

    switch (entry.type) {
      case "Hospital":
        break;
      case "OccupationalHealthcare":
        break;
      case "HealthCheck":
        break;
      default:
        assertNever(entry);
        throw new Error("Unknown entry type: " + entry);
    }

    return entry;
  });

  return validatedEntries;
};
