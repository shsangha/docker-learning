import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

describe("tests function that runs all form level validations and returns the result", () => {
  test("ignores validators that return no errors", () => {
    const rootValidators = {
      show: () => ({ error: true }),
      hide: () => ({})
    };

    const wrapper = shallow(
      <FormHelper rootValidators={rootValidators}>{() => <div />}</FormHelper>
    );
    const instance = wrapper.instance() as FormHelper;

    instance.runFormLevelValidation().then(error => {
      expect(error.hide).toBeUndefined();
    });
  });
  test("returns the error message as an error on the field being validated", () => {
    const rootValidators = {
      returnError: () => {
        throw new Error("error message");
      }
    };
    const wrapper = shallow(
      <FormHelper rootValidators={rootValidators}>{() => <div />}</FormHelper>
    );
    const instance = wrapper.instance() as FormHelper;
    instance.runFormLevelValidation().then(error => {
      expect(error).toEqual(
        expect.objectContaining({
          returnError: {
            validation_function_error_key: "error message"
          }
        })
      );
    });
  });
  test("combines validation results as expected and works with nested fields in any order", () => {
    const rootValidators = {
      "a.b[0]": () => ({ any: "error" }),
      "a.b": () => ({ any: "error" }),
      "a.c.d": () => ({ any: "error" }),
      "a.b[1].a": () => ({ any: "error" })
    };
    const wrapper = shallow(
      <FormHelper rootValidators={rootValidators}>{() => <div />}</FormHelper>
    );
    const instance = wrapper.instance() as FormHelper;
    instance.fields = {
      "a.b": {
        multiField: true
      }
    };
    instance.runFormLevelValidation().then(error => {
      expect(error).toEqual(
        expect.objectContaining({
          a: {
            b: {
              "0": { any: "error" },
              "1": { a: { any: "error" } },
              b: { any: "error" }
            },
            c: { d: { any: "error" } }
          }
        })
      );
    });
  });
});
