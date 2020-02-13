import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

test("takes in a list of names and sets their state to given touched value", () => {
  const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
  const instance = wrapper.instance() as FormHelper;

  instance.setTouched(true, "a.a", "a.b", "c");
  wrapper.update();
  expect(wrapper.state("touched")).toMatchObject({
    a: {
      a: true,
      b: true
    },
    c: true
  });
});
