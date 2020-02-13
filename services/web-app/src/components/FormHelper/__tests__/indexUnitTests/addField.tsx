import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

test("sets a new value at given name", () => {
  const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
  const instance = wrapper.instance() as FormHelper;

  instance.addField("newKey.level1", "value");
  expect(wrapper.state("values")).toEqual(
    expect.objectContaining({
      newKey: {
        level1: "value"
      }
    })
  );
});
