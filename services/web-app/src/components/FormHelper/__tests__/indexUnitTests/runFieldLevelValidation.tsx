import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

describe("tests field validaiton", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("returns null if there is no error", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.fields.test = {
      validator: (val: any) => ({}),
      multiField: false
    };

    instance.runFieldLevelValidation("test", "any").then(result => {
      expect(result).toBeNull();
    });
  });

  test("returns the error message as one of the field errors if async validation fails", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.fields.test = {
      validator: (val: any) => {
        throw new Error("Error message");
      },
      multiField: false
    };
    instance.runFieldLevelValidation("test", "any").then(result => {
      expect(result).toEqual(
        expect.objectContaining({
          validation_function_error_key: "Error message"
        })
      );
    });
  });

  test("just returns the error if validation works as expected", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.fields.test = {
      validator: (val: any) => ({ any: "error" }),
      multiField: false
    };
    instance.runFieldLevelValidation("test", "any").then(result => {
      expect(result).toEqual(expect.objectContaining({ any: "error" }));
    });
  });
});
