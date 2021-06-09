import patientData from '../../data/patients';
import { Patient, PublicPatient } from '../types';

const getPublicEntries = (): Array<PublicPatient> => {
  return patientData.map(({ ssn: _ssn, entries: _entries, ...patient }) => patient);
};

const getPrivateEntry = (id: string): Patient | undefined => {
  return patientData.find((patient) => patient.id === id);
};

export default {
  getPublicEntries,
  getPrivateEntry
};