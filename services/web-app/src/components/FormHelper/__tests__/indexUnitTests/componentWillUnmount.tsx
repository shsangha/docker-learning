import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

describe("tests the cleanup in component will unmount is done as expected", () => {
  test("makes sure the subscriptions are open", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.componentWillUnmount();

    expect(instance.formValidationSubscription!.closed).toBe(true);
    expect(instance.validationSubscription!.closed).toBe(true);
    expect(instance.submissionSubscription!.closed).toBe(true);
  });
});
