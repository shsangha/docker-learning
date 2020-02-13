import React from "react";
import { shallow } from "enzyme";
import FormHelper from "../../index";

test("removes field from relevant pieces of state", () => {
  const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
  const instance = wrapper.instance() as FormHelper;

  wrapper.setState(
    {
      values: {
        first: {
          second: {
            third: "any"
          }
        }
      },
      errors: {
        first: {
          second: {
            third: {}
          }
        }
      },
      touched: {
        first: {
          second: {
            third: true
          }
        }
      }
    },
    () => {
      instance.removeField("first.second.third");
      wrapper.update();
      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          touched: {
            first: {
              second: {}
            }
          },
          errors: {
            first: {
              second: {}
            }
          },
          values: {
            first: {
              second: {}
            }
          }
        })
      );
    }
  );
});
