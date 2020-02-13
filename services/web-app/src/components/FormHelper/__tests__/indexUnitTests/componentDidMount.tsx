import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

describe("tests the setup in cdm is done as expected", () => {
  test("makes sure the subscriptions are open", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.componentDidMount();

    expect(instance.formValidationSubscription!.closed).toBe(false);
    expect(instance.validationSubscription!.closed).toBe(false);
    expect(instance.submissionSubscription!.closed).toBe(false);
  });
});
