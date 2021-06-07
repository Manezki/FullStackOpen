import express from "express";
import cors from "cors";

import diagnoseRouter from "./routes/diagnose";
import patientRouter from "./routes/patient";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.listen(3001, () => {
  console.log("Server started @ http://www.localhost:3001");
});
