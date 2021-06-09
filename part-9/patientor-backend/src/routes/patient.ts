import express from 'express';
import patientService from "../services/patientService";
import { Patient } from '../types';
import { toNewPatient } from '../utils';

const patientRouter = express.Router();

patientRouter.get("/", (_req, res): void => {
  res.json(patientService.getPublicEntries());
});

patientRouter.get("/:id", (req, res): void => {
  const maybePatient: Patient | undefined = patientService.getPrivateEntry(req.params.id);
  console.log(maybePatient);
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
    res.send(toNewPatient(req.body));
  } catch(error) {
    res.status(400).send(error.message);
  }
});



export default patientRouter;