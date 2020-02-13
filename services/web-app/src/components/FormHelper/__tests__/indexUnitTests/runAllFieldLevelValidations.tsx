import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

describe("tests that all field validations work together", () => {
  test("works as expected when multifield validation is used", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.fields = {
      "test[0]": {
        validator: () => ({ errors: true }),
        multiField: false
      },
      test: {
        validator: () => ({ errors: true }),
        multiField: true
      },
      "test[1]": {
        validator: () => ({ errors: true }),
        multiField: false
      }
    };

    instance.runAllFieldLevelValidations().then(res => {
      expect(res).toEqual(
        expect.objectContaining({
          test: {
            "0": {
              errors: true
            },
            "1": {
              errors: true
            },
            test: {
              errors: true
            }
          }
        })
      );
    });
  });
});
