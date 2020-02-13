import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

describe("makes sure fields get atached properly", () => {
  test("overwrites existing field when called again", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    instance.fields = {
      someField: {
        multiField: true
      }
    };

    instance.attachField("someField", false, () => ({}));

    expect(instance.fields.someField.multiField).toEqual(false);
  });

  test("doesnt break when no validator is attached", () => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;
    instance.attachField("someField", false);

    expect(instance.fields.someField.multiField).toEqual(false);
  });
});
