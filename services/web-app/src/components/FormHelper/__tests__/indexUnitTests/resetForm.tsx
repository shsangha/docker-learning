import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

test("sets the form state back to the default", () => {
  const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
  const instance = wrapper.instance() as FormHelper;

  wrapper.setState(
    {
      values: {
        not: {
          the: {
            initial: "values"
          }
        }
      },
      errors: { some: "errors" },
      touched: { key1: true },
      isValidating: true,
      isSubmitting: true
    },
    () => {
      instance.resetForm();
      wrapper.update();
      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          values: {},
          errors: {},
          touched: {},
          isValidating: false,
          isSubmitting: false
        })
      );
    }
  );
});
