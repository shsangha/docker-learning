import React from "react";
import { shallow } from "enzyme";
import { of } from "rxjs";
import FormHelper from "../../index";

describe("test the submission stream validation observable", () => {
  jest.useFakeTimers();

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("sets validating state to true and sets all fields to touched", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    const fakeInput = of("");

    const setStateSpy = jest.spyOn(instance, "setState");
    const touchedSpy = jest.spyOn(instance, "setTouched");
    instance.manageFormValidation$(fakeInput).subscribe({
      complete() {
        try {
          expect(setStateSpy).toHaveBeenCalledWith({ isValidating: true });
          expect(touchedSpy).toHaveBeenCalledWith(true, []);
          done();
        } catch (error) {
          done.fail(error);
        }
      },
      error(err) {
        done.fail(err);
      }
    });
  });

  test("returns the merged result of field and formlevel validations", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;

    jest.spyOn(instance, "runAllFieldLevelValidations").mockImplementation(
      () =>
        new Promise(resolve =>
          resolve({
            someField: { some: "error" },
            otherField: { other: "error" }
          })
        )
    );

    jest.spyOn(instance, "runFormLevelValidation").mockImplementation(
      () =>
        new Promise(resolve =>
          resolve({
            someField: { formLevel: "error" },
            otherField: { formLevel: "error" }
          })
        )
    );

    instance.manageFormValidation$(of("")).subscribe({
      next(result) {
        try {
          expect(result).toEqual(
            expect.objectContaining({
              otherField: { formLevel: "error", other: "error" },
              someField: { formLevel: "error", some: "error" }
            })
          );
          done();
        } catch (error) {
          done.fail(error);
        }
      }
    });
  });
});
