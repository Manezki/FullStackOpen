import express from 'express';
import patientService from "../services/patientService";
import { Patient } from '../types';
import { toNewEntry, toNewPatient } from '../utils';

const patientRouter = express.Router();

patientRouter.get("/", (_req, res): void => {
  res.json(patientService.getPublicEntries());
});

patientRouter.get("/:id", (req, res): void => {
  const maybePatient: Patient | undefined = patientService.getPrivateEntry(req.params.id);
  if (maybePatient) {
    res.json(maybePatient);
  } else {
    res.status(404).json({
      error: `Patient not found with id: ${req.params.id}`
    });
  }
});

patientRouter.post("/", (req, res): void => {
  try {
    const newPatient = toNewPatient(req.body);
    patientService.addPatient(newPatient);
    res.send(newPatient);
  } catch(error) {
    res.status(400).send(error.message);
  }
});

patientRouter.post("/:id/entries", (req, res): void => {
  try {
    
    const maybePatient: Patient | undefined = patientService.getPrivateEntry(req.params.id);

    if (!maybePatient) {
      throw new Error(`Patient not found with ID ${req.params.id}`);
    }

    const newEntry = toNewEntry(req.body);
    
    patientService.updatePatient(req.params.id, {...maybePatient, entries: maybePatient.entries.concat(newEntry)});
    res.send(newEntry);
  } catch(error) {
    res.status(400).send(error.message);
  }
});


export default patientRouter;