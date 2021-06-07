import express from 'express';
import patientService from "../services/patientService";
import { toNewPatient } from '../utils';

const patientRouter = express.Router();

patientRouter.get("/", (_req, res): void => {
  res.json(patientService.getEntries());
});

patientRouter.post("/", (req, res): void => {
  try {
    console.log(req)
    res.send(toNewPatient(req.body))
  } catch(error) {
    res.status(400).send(error.message)
  }
});

export default patientRouter;