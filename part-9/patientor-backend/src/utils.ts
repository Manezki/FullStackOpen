import { Entry, Gender, HealthCheckRating, Patient, BaseEntry } from "./types";
import {v1 as uuid} from "uuid";

interface patientPostParameters {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown,
  entries: unknown[]
}

interface entryPostParameters {
  type: "Hospital" | "OccupationalHealthcare" | "HealthCheck";
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
  // Hospital specific
  discharge? : {
    date: string;
    criteria: string;
  }
  // Occupational specific
  employerName?: string,
  sickLeave?: {
    startDate: string;
    endDate: string;
  }
  // Healthcheck specific
  healthCheckRating?: HealthCheckRating
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

export const toNewEntry = (
  { type, description, date, specialist, diagnosisCodes, discharge, employerName, sickLeave, healthCheckRating }: entryPostParameters
  ): Entry => {
    const entryBase: BaseEntry = {
      id: uuid(),
      description: parseString(description),
      date: parseDate(date),
      specialist: parseString(specialist),
    };
  
    if (diagnosisCodes) {
      entryBase.diagnosisCodes = parseDiagnosisCodes(diagnosisCodes);
    }

    switch (type) {
      case "Hospital":
        return { ...entryBase, type: type, discharge: parseDischarge(discharge)};
      case "OccupationalHealthcare":
        if (sickLeave) {
          return {
            ...entryBase, type: type, employerName: parseName(employerName), sickLeave: parseSickLeave(sickLeave)
          };
        } else {
          return {
            ...entryBase, type: type, employerName: parseName(employerName)
          };
        }
      case "HealthCheck":
        return { ...entryBase, type: type, healthCheckRating: parseHealthCheckRating(healthCheckRating)};
      default:
        throw new Error("Unknown Entry type: " + type);

    }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (healthCheckRating: any): healthCheckRating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(healthCheckRating);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  
  return name;
};

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error("Incorrect or missing name");
  }
  
  return text;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date of birth: " + date);
  }

  return date;
};

const parseDiagnosisCodes = (diagnoseCodes: unknown): string[] => {
  if (!diagnoseCodes || !isArray(diagnoseCodes)) {
    throw new Error("DiagnoseCodes must be an array: " + diagnoseCodes);
  }

  const validatedDiagnoseCodes = diagnoseCodes.map((code) => {
    if (!code || !isString(code)) {
      throw new Error("A diagnoseCode must be a string: " + code);
    }

    return code;
  });

  return validatedDiagnoseCodes;
};

const parseDischarge = (discharge: unknown): { date: string; criteria: string; } => {
  if (!discharge || !isObject(discharge)){
    throw new Error("Discharge must be an object of type { date: string, criteria: string }: " + discharge);
  }

  if (!discharge.date || !isString(discharge.date) || !isDate(discharge.date)){
    throw new Error("Discharge date must be a string and a valid date: " + discharge.date);
  }

  if (!discharge.criteria || !isString(discharge.criteria)){
    throw new Error("Discharge criteria must be a string: " + discharge.criteria);
  }

  return {
    date: discharge.date,
    criteria: discharge.criteria,
  };
};

const parseSickLeave = (sickLeave: unknown): { startDate: string; endDate: string; } => {
  if (!sickLeave || !isObject(sickLeave)){
    throw new Error("sickLeave must be an object of type { startDate: string, endDate: string }: " + sickLeave);
  }

  if (!sickLeave.startDate || !isString(sickLeave.startDate) || !isDate(sickLeave.startDate)){
    throw new Error("sickLeave startDate must be a string and a valid date: " + sickLeave.startDate);
  }

  if (!sickLeave.endDate || !isString(sickLeave.endDate)){
    throw new Error("sickLeave endDate must be a string: " + sickLeave.endDate);
  }

  return {
    startDate: sickLeave.startDate,
    endDate: sickLeave.endDate,
  };
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (!healthCheckRating || !isHealthCheckRating(healthCheckRating)){
    throw new Error(`healthCheckRating must be either:${Object.values(HealthCheckRating).map((rating) => ` '${rating}'`)} `);
  }

  return healthCheckRating;
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
