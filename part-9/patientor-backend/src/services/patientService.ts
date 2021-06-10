import patientData from '../../data/patients';
import { Patient, PublicPatient } from '../types';

const getPublicEntries = (): Array<PublicPatient> => {
  return patientData.map(({ ssn: _ssn, entries: _entries, ...patient }) => patient);
};

const getPrivateEntry = (id: string): Patient | undefined => {
  return patientData.find((patient) => patient.id === id);
};

const addPatient = (patient: Patient): void => {
  patientData.push(patient);
};

const updatePatient = (patientId: string, newPatient: Patient): Patient => {
  const patientIdx = patientData.findIndex((patient) => patient.id === patientId);
  if (patientIdx === -1) {
    throw new Error(`Patient not found with ID ${patientId}`);
  }
  patientData[patientIdx] = newPatient;
  return patientData[patientIdx];
};

export default {
  getPublicEntries,
  getPrivateEntry,
  addPatient,
  updatePatient
};