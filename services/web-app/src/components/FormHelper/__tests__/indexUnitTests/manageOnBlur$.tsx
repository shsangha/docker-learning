import React from "react";
import { shallow } from "enzyme";
import { VirtualTimeScheduler, from, NEVER } from "rxjs";
import { delay } from "rxjs/operators";
import FormHelper from "../../index";
import { FormHelperState } from "../../types";

describe("tests the blur stream behaves as expected", () => {
  jest.useFakeTimers();

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("validation is interupted when submission is triggered", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;
    instance.fields = {
      type1: {
        multiField: true
      },
      type2: {
        multiField: false
      }
    };

    const scheduler = new VirtualTimeScheduler();

    const fakeBlur$ = from([{ name: "any", value: "any" }]);
    const fakeSubmit$ = from([1]).pipe(delay(100, scheduler));

    jest.spyOn(instance, "runFieldLevelValidation").mockImplementation(
      (a: string, b: Partial<FormHelperState>) =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({});
          }, 500);
        })
    );

    const calledSpy = jest.fn();

    instance.manageOnBlur$(fakeBlur$, fakeSubmit$).subscribe({
      next() {
        calledSpy();
      },
      error(error) {
        done.fail(error);
      },
      complete() {
        try {
          expect(calledSpy).not.toHaveBeenCalled();
          done();
        } catch (e) {
          done.fail(e);
        }
      }
    });
    scheduler.flush();
  });
  test("calls fn to set touched if not already touched", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);

    const instance = wrapper.instance() as FormHelper;
    instance.fields = {
      type1: {
        multiField: true
      },
      type2: {
        multiField: false
      }
    };

    const fakeBlur$ = from([{ name: "type2", value: "any" }]);
    const fakeSubmit$ = NEVER;
    const setTouchedSpy = jest
      .spyOn(instance, "setTouched")
      .mockImplementation((val: boolean, name: string[]) => {
        return undefined;
      });

    instance.manageOnBlur$(fakeBlur$, fakeSubmit$).subscribe({
      error(error) {
        done.fail(error);
      },
      complete() {
        try {
          expect(setTouchedSpy).toHaveBeenCalled();
          done();
        } catch (error) {
          done.fail(error);
        }
      }
    });
  });
  test("adds field error to error state if present and merges with root errors", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;
    instance.fields = {
      type1: {
        multiField: true
      },
      type2: {
        multiField: false
      }
    };

    const fakeBlur$ = from([{ name: "type1", value: "any" }]);
    const fakeSubmit$ = NEVER;

    jest.spyOn(instance, "runFieldLevelValidation").mockImplementation(
      () =>
        new Promise(resolve =>
          resolve({
            field: "error"
          })
        )
    );

    jest.spyOn(instance, "runFormLevelValidation").mockImplementation(
      () =>
        new Promise(resolve =>
          resolve({
            root: "errors"
          })
        )
    );

    expect(instance.state.errors).toMatchObject({});

    instance.manageOnBlur$(fakeBlur$, fakeSubmit$).subscribe({
      next(output) {
        try {
          expect(output).toMatchObject({
            root: "errors",
            type1: { type1: { field: "error" } }
          });
          done();
        } catch (error) {
          done.fail(error);
        }
      },
      error(e) {
        done.fail(e);
      }
    });
  });
  test("removes field error from error state if non existent", done => {
    const wrapper = shallow(<FormHelper>{() => <div />}</FormHelper>);
    const instance = wrapper.instance() as FormHelper;
    instance.fields = {
      type1: {
        multiField: true
      },
      type2: {
        multiField: false
      }
    };
    const fakeBlur$ = from([{ name: "type2", value: "any" }]);
    const fakeSubmit$ = NEVER;

    jest
      .spyOn(instance, "runFieldLevelValidation")
      .mockImplementation(
        (name: string, value: Partial<FormHelperState>) =>
          new Promise(resolve => resolve(null))
      );

    wrapper.setState(
      {
        errors: {
          type2: "should go away"
        }
      },
      () => {
        instance.manageOnBlur$(fakeBlur$, fakeSubmit$).subscribe({
          next(output) {
            try {
              expect(output).toMatchObject({});
              expect(Object.keys(output).length).toEqual(0);
              done();
            } catch (error) {
              done.fail(error);
            }
          }
        });
      }
    );
  });
});
