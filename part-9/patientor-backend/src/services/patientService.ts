import patientData from '../../data/patients';
import { Patient } from '../types';

const getEntries = (): Array<Omit<Patient, "ssn">> => {
  return patientData.map(({ ssn, ...patient }) => patient);
};

export default {
  getEntries
};