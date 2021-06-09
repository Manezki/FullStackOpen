import React from "react";
import { Icon } from "semantic-ui-react";
import HealthRatingBar from "../components/HealthRatingBar";
import { Entry } from "../types";
import { assertNever } from "../utils";

const additionalEntryTypeInfo = (entry: Entry): [JSX.Element, JSX.Element] => {
  switch (entry.type) {
    case "Hospital":
      return [
        // eslint-disable-next-line react/jsx-key
        <Icon name="hospital"/>,
        <></>];
    case "OccupationalHealthcare":
      return [
        // eslint-disable-next-line react/jsx-key
        <Icon name="first aid"/>,
        <></>];
    case "HealthCheck":
      return [
        // eslint-disable-next-line react/jsx-key
        <Icon name="doctor"/>,
        // eslint-disable-next-line react/jsx-key
        <HealthRatingBar showText={false} rating={entry.healthCheckRating} />];
    default:
      assertNever(entry);
      return [
        <></>,
        <></>];
  }
};

const EntryView = ({ entry }: { entry: Entry }): JSX.Element => {

  const [ entryIcon, healthRating ] = additionalEntryTypeInfo(entry);

  return (<div style={{borderWidth: 1, borderColor: "black", borderStyle: "dotted", margin: "4px 0px 4px 0px", padding: "4px 8px 4px 8px"}}>
    <h3>{entry.date} {entryIcon}</h3>
    <p>{entry.description}</p>
    {healthRating}
  </div>);
};

export default EntryView;
