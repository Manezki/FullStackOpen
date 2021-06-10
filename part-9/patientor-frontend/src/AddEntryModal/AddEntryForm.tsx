import React from "react";
import { Grid, Button, DropdownProps, Dropdown } from "semantic-ui-react";
import { Field, Formik, Form, isString, ErrorMessage, FormikProps } from "formik";
import { Form as SuiForm } from "semantic-ui-react";

import { TextField, DiagnosisSelection } from "./FormField";
import { HealthCheckRating } from "../types";
import { useStateValue } from "../state";
import { isDate, isNumber } from "../utils";
// import { assertNever } from "../utils";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValues = {
  type: "Hospital" | "OccupationalHealthcare" | "HealthCheck";
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: string[];
  // Hospital specific
  discharge: {
    date: string;
    criteria: string;
  }
  // Occupational specific
  employerName: string,
  sickLeave: {
    startDate: string;
    endDate: string;
  }
  // Healthcheck specific
  healthCheckRating: HealthCheckRating
};

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

// const entryTypeOptions: EntryTypeOption[] = [
//   { value: "Hospital", label: "Hospital" }
// ];

const additionalFields = (
    entryType: string,
    setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"],
    setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"],
  ): JSX.Element => {
  switch (entryType) {
    case "Hospital":
      return (
        <div style={{marginLeft: "6%"}}>
          <Field
            label="Discharge date"
            placeholder="YYYY-MM-DD"
            name="discharge.date"
            component={TextField}
          />
          <Field
            label="Discharge criteria"
            placeholder="Discharge criteria"
            name="discharge.criteria"
            component={TextField}
          />
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={{marginLeft: "6%"}}>
          <Field
            label="Employer name"
            placeholder="Employer name"
            name="employerName"
            component={TextField}
          />
          <Field
            label="Sickleave start"
            placeholder="YYYY-MM-DD"
            name="sickLeave.startDate"
            component={TextField}
          />
          <Field
            label="Sickleave end"
            placeholder="YYYY-MM-DD"
            name="sickLeave.endDate"
            component={TextField}
          />
        </div>
      );
      case "HealthCheck":
        return (
          <div style={{marginLeft: "6%"}}>
            <SuiForm.Field>
              <label>Health rating</label>
              <Dropdown
                fluid
                search
                selection
                options={
                  Object.keys(HealthCheckRating)
                    .filter((rating) => !isNumber(rating) )
                    .map( (key) =>  {
                      const enforcedKey: string = key;
                      return {
                        key: key,
                        value: HealthCheckRating[enforcedKey as keyof typeof HealthCheckRating] as number,
                        text: key};
                    })
                  }
                onChange={(
                  _event: React.SyntheticEvent<HTMLElement, Event>,
                  data: DropdownProps,
                  ) => {
                  if (data && data.value && isNumber(data.value)){
                    setFieldTouched("healthCheckRating", true);
                    setFieldValue("healthCheckRating", data.value);
                  }
                }}
              />
              <ErrorMessage name={"type"} />
            </SuiForm.Field>
          </div>
        );
    default:
      return <></>;
  }
};

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        type: "Hospital",
        diagnosisCodes: [],
        discharge: {
          date: "",
          criteria: ""
        },
        healthCheckRating: -1,
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string | { [subField: string]: string } } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        } else {
          if (!isDate(values.date)) {
            errors.date = `'${values.date}' is not a valid date`;
          }
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        
        switch (values.type) {
          case "Hospital":
            const hospitalErrors: { date?: string, criteria?: string } = {};
            if (!values.discharge.date) {
              hospitalErrors.date = requiredError;
            }
            if (!values.discharge.criteria) {
              hospitalErrors.criteria = requiredError;
            }
            
            if (Object.keys(hospitalErrors).length !== 0) {
              errors.discharge = hospitalErrors;
            }
            break;
          case "HealthCheck":
            if (!values.healthCheckRating) {
              errors.healthCheckRating = requiredError;
            }
            if (!Object.values(HealthCheckRating).includes(values.healthCheckRating)) {
              errors.healthCheckRating = `Health rating must be in: ${Object.values(HealthCheckRating).map((val) => `${val}`).join(" ")}`;
            }
            break;
          case "OccupationalHealthcare":
            if (!values.employerName) {
              errors.employerName = requiredError;
            }

            const occupationalErrors: { startDate?: string, endDate?: string } = {};
            if (values.sickLeave.startDate || values.sickLeave.endDate) {
              if (!values.sickLeave.startDate) {
                occupationalErrors.startDate = requiredError;
              }
              if (!values.sickLeave.endDate) {
                occupationalErrors.endDate = requiredError;
              }
            }
            
            if (!isDate(values.sickLeave.startDate)) {
              occupationalErrors.startDate = "Start date must be a valid date";
            }

            if (!isDate(values.sickLeave.endDate)) {
              occupationalErrors.endDate = "End date must be a valid date";
            }

            if (Object.keys(occupationalErrors).length !== 0) {
              errors.sickLeave = occupationalErrors;
            }
            break;
          default:
            break;
        }

        return errors;
      }}
    >
      {({ isValid, dirty, values, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <SuiForm.Field>
              <label>Entry type</label>
              <Dropdown
                fluid
                search
                selection
                options={["Hospital", "OccupationalHealthcare", "HealthCheck"].map(type => ({
                  key: type,
                  text: `${type}`,
                  value: type
                }))}
                onChange={(
                  _event: React.SyntheticEvent<HTMLElement, Event>,
                  data: DropdownProps,
                  ) => {
                  if (data && data.value && isString(data.value)){
                    setFieldTouched("type", true);
                    setFieldValue("type", data.value);
                  }
                }}
              />
              <ErrorMessage name={"type"} />
              {/* <Field as="select" name={"type"} className="ui dropdown" onChange={}>
                {["Hospital", "OccupationalHealthcare", "HealthCheck"].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field> */}
            </SuiForm.Field>
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Array.from(diagnoses.values())}
            />
            {additionalFields(values.type, setFieldValue, setFieldTouched )}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
