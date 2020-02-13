import React from "react";
import FormHelper from "../FormHelper";
import Field from "../FormHelper/Field";

const initialValues = {
  a: "some string",
  b: "other string"
};

export default () => {
  return (
    <FormHelper initialValues={initialValues}>
      {({ retrieveInternalValue, values }) => {
        return (
          <div>
            <Field name="a">
              {({ field }) => <input type="checkbox" {...field()} />}
            </Field>
            {retrieveInternalValue(values, "a") === "b" ? (
              <Field name="b">
                {({ field }) => <input type="checkbox" {...field()} />}
              </Field>
            ) : null}
          </div>
        );
      }}
    </FormHelper>
  );
};
