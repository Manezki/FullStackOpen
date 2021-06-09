import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action = PatientListAction | PatientAction | DiagnosesListAction;

export interface PatientListAction {
  type: "SET_PATIENT_LIST";
  payload: Patient[];
}

export interface PatientAction {
  type: "ADD_PATIENT" | "UPDATE_PATIENT";
  payload: Patient;
}

export interface DiagnosesListAction {
  type: "SET_DIAGNOSES_LIST";
  payload: Map<string, Diagnosis>;
}

export const setPatientsList = (patients: Patient[]): PatientListAction => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patients,
  };
};

export const setDiagnosesList = (diagnoses: Diagnosis[]): DiagnosesListAction => {
  const groupedDiagnoses = diagnoses.reduce((groupBy, diagnosis) => {
    groupBy.set(diagnosis["code"], diagnosis);
    return groupBy;
  }, new Map<string, Diagnosis>());
  return {
    type: "SET_DIAGNOSES_LIST",
    payload: groupedDiagnoses
  };
};

export const addPatient = (patient: Patient): PatientAction => {
  return {
    type: "ADD_PATIENT",
    payload: patient,
  };
};

export const updatePatient = (patient: Patient): PatientAction => {
  return {
    type: "UPDATE_PATIENT",
    payload: patient,
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "UPDATE_PATIENT":
        return {
          ...state,
          patients: {
            ...state.patients,
            [action.payload.id]: action.payload
          }
        };
    case "SET_DIAGNOSES_LIST":
      return {
        ...state,
        diagnoses: action.payload
      };
    default:
      return state;
  }
};
