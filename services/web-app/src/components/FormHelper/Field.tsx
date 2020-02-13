import React from "react";
import FormFieldHOC from "./FormFieldHOC";
import { FieldProps } from "./types";

const Field: React.FunctionComponent<FieldProps> = props => {
  const {
    FieldState: { value, errors, touched },
    field
  } = props;

  return props.children({ field, value, errors, touched });
};

export default FormFieldHOC(Field, false);
