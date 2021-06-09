import React, { useEffect } from "react";
import axios from "axios";
import { Container, Icon, Table } from "semantic-ui-react";

import { Diagnosis, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { updatePatient, setDiagnosesList, useStateValue } from "../state";
import { useParams } from "react-router";
import HealthRatingBar from "../components/HealthRatingBar";
import EntryView from "./EntryView";

const PatientListPage = () => {
  const { id } = useParams<{ id: string }>();

  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const patient: Patient | undefined = Object.values(patients).find((patient) => patient.id === id);

  useEffect(() => {

    if (patient && patient.entries && patient.ssn) {
      return;
    }

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();
  }, []);

  useEffect(() => {

    if (diagnoses.size !== 0) {
      return;
    }

    const fetchDiagnoses = async () => {
      try {
        const { data: diagnosesFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch((setDiagnosesList(diagnosesFromApi)));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoses();
  }, []);

  // console.log(patient);
  // console.log(diagnoses);

  if (!patient) {
    return (<div className="App">
      <Container textAlign="center">
        <h3>404: Patient not found</h3>
      </Container>
    </div>);
  }

  const generateRowId = (rowContent: string): string => {
    return `patient.id+${rowContent}`;
  };

  const capitalize = (text: string): string => {
    return `${text[0].toUpperCase()}${text.slice(1)}`;
  };

  return (
    <div className="App">
      <Container textAlign="center">
        <h2>{patient.name}<Icon name={
          (patient.gender === "male")
          ? "mars"
          : (patient.gender === "female")
            ? "venus"
            : "transgender"
        } /></h2>
      </Container>
      <Table>
        <Table.Body>
          <Table.Row key={generateRowId("healt")}>
            <Table.Cell>Health</Table.Cell>
            <Table.Cell><HealthRatingBar showText={false} rating={1} /></Table.Cell>
          </Table.Row>
          <Table.Row key={generateRowId(patient.occupation)}>
            <Table.Cell>Occupation</Table.Cell>
            <Table.Cell>{capitalize(patient.occupation)}</Table.Cell>
          </Table.Row>
          <Table.Row key={generateRowId("ssn")}>
            <Table.Cell>SSN</Table.Cell>
            <Table.Cell>{patient.ssn || "Loading..."}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Container textAlign="center">
        <h2>Patient entries</h2>
      </Container>
      {(patient.entries)
        ? patient.entries.map((entry) => {
            return <EntryView key={entry.id} entry={entry}/>;
          })
        : "Loading..."}
    </div>
  );
};

export default PatientListPage;
