import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

test("sets value as expected", () => {
  const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
  const instance = wrapper.instance() as FormHelper;

  const cb = jest.fn();

  instance.setFieldValue("key", "value", cb);
  wrapper.update();
  expect(wrapper.state("values")).toMatchObject({
    key: "value"
  });
  expect(cb).toHaveBeenCalled();
});
