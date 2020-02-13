import React from "react";
import FormHelper from "../../index";

import { shallow } from "enzyme";

describe("tests to make sure the change validation stream is created as expected", () => {
  test("makes sure we start with a default value so we can treat observables as pairwise", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);

    const instance = wrapper.instance() as FormHelper;

    instance.createOnChange$().subscribe(output => {
      try {
        expect(output[0]).toMatchObject({ name: "any string" });
        expect(output[1]).toMatchObject({
          name: "test",
          value: "test"
        });
        done();
      } catch (error) {
        done.fail(error);
      }
    });

    instance.triggerFieldChange$("test", "test");
  });
});
