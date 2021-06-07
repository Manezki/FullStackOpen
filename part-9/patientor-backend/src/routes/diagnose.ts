import express from 'express';
import diagnoseService from "../services/diagnoseService";

const diagnoseRouter = express.Router();

diagnoseRouter.get('/', (_req, res): void => {
  res.json(diagnoseService.getEntries());
});

export default diagnoseRouter;