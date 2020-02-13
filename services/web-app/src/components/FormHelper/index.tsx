import React, { Component } from "react";
import {
  FormHelperProps,
  FormHelperState,
  FormHelperContext,
  ValidationErrorKey,
  IndexSignatureObject,
  StateChange
} from "./types";
import { merge as deepmerge, toPath } from "lodash";
import { Observable, merge, of, zip, Observer, Subscription } from "rxjs";
import {
  filter,
  switchMap,
  mergeMap,
  debounceTime,
  tap,
  pairwise,
  startWith,
  map,
  share,
  takeUntil
} from "rxjs/operators";
import set from "./utils/set";
const { setInternalValue, setInternalError, setInternalTouched } = set;
import isEmptyObj from "./utils/isEmptyObj";
import removeInternalValue from "./utils/removeInternalValue";
import combineFieldValidationResults from "./utils/combineFieldValidationResults";
import retrieveInternalValue from "./utils/retrieveInternalValue";

export const FormContext = React.createContext({} as FormHelperContext);

export default class FormHelper extends Component<
  FormHelperProps,
  FormHelperState
> {
  public static defaultProps = {
    initialValues: {},
    onSubmit: () => {
      return;
    },
    rootValidators: {}
  };

  public fields: IndexSignatureObject = {};
  public triggerFieldChange$: (name: string, value: any) => void = () => {
    return;
  };
  public triggerFieldBlur$: (name: string, value: any) => void = () => {
    return;
  };
  public triggerFormValidation$: () => void = () => {
    return;
  };
  public triggerSubmission$: () => void = () => {
    return;
  };
  public validationSubscription?: Subscription;
  public submissionSubscription?: Subscription;
  public formValidationSubscription?: Subscription;

  constructor(props: FormHelperProps) {
    super(props);

    const { initialValues: values } = this.props;

    this.state = {
      values,
      touched: {},
      errors: {},
      isValidating: false,
      isSubmitting: false
    };
  }

  public createOnChange$ = (): Observable<any> =>
    Observable.create((observer: Observer<any>) => {
      this.triggerFieldChange$ = (name: string, value: any) => {
        observer.next({ name, value });
      };
    }).pipe(
      startWith({ name: "any string" }),
      pairwise(),
      share()
    );

  public createOnBlur$ = (): Observable<any> =>
    Observable.create((observer: Observer<any>) => {
      this.triggerFieldBlur$ = (name: string, value: any) => {
        observer.next({ name, value });
      };
    }).pipe(share());

  public createFormValidation$ = (): Observable<any> =>
    Observable.create((observer: Observer<any>) => {
      this.triggerFormValidation$ = () => {
        observer.next("");
      };
    }).pipe(share());

  public createOnSubmit$ = (): Observable<any> =>
    Observable.create((observer: Observer<any>) => {
      this.triggerSubmission$ = () => {
        observer.next("");
      };
    }).pipe(share());

  public manageOnChange$ = (
    onChange$: Observable<any>,
    onBlur$: Observable<any>
  ) =>
    merge(
      onChange$.pipe(
        filter(
          ([prev, current]: [
            { name: string; value?: object },
            { name: string; value: object }
          ]) => prev.name === current.name
        ),

        debounceTime(300),
        switchMap(([_, { name, value }]) =>
          zip(this.runFieldLevelValidation(name, value), of(name)).pipe(
            takeUntil(onBlur$)
          )
        )
      ),
      onChange$.pipe(
        filter(
          ([prev, current]: [
            { name: string; value?: object },
            { name: string; value: object }
          ]) => prev.name !== current.name
        ),
        mergeMap(([_, { name, value }]) =>
          zip(this.runFieldLevelValidation(name, value), of(name)).pipe(
            takeUntil(onBlur$)
          
        )
      )
    ).pipe(
      map(([error, name]) =>
        setInternalError(
          this.state.errors,
          this.fields[name].multiField
            ? `${name}.${toPath(name).slice(-1)[0]}`
            : name,
          error
        )
      )
    ));

  public manageOnBlur$ = (
    onBlur$: Observable<any>,
    onSubmit$: Observable<any>
  ) =>
    onBlur$.pipe(
      tap(({ name }: { name: string; value: object }) => {
        if (!retrieveInternalValue(this.state.touched, name)) {
          this.setTouched(true, name);
        }
      }),
      mergeMap(({ name, value }) =>
        zip(
          zip(this.runFieldLevelValidation(name, value), of(name)),
          this.runFormLevelValidation()
        ).pipe(takeUntil(onSubmit$))
      ),
      map(([[fieldError, name], rootErrors]) => {
        const fieldName = this.fields[name].multiField
          ? `${name}.${toPath(name).slice(-1)[0]}`
          : name;
        if (fieldError) {
          return deepmerge(
            setInternalError(this.state.errors, fieldName, fieldError),
            rootErrors
          );
        } else {
          return deepmerge(
            removeInternalValue(this.state.errors, fieldName),
            rootErrors
          );
        }
      })
    );

  public manageFormValidation$ = (input$: Observable<any>) =>
    input$.pipe(
      tap(() => this.setState({ isValidating: true })),
      tap(() =>
        this.setTouched(
          true,
          Object.keys(this.fields).filter(name => this.fields[name].validator)
        )
      ),
      switchMap(() =>
        zip(this.runAllFieldLevelValidations(), this.runFormLevelValidation())
      ),
      map(([fieldErrors, formErrors]) => deepmerge(fieldErrors, formErrors))
    );

  public componentDidMount() {
    const changeValidation$ = this.createOnChange$();
    const blurValidation$ = this.createOnBlur$();
    const submitValidation$ = this.createOnSubmit$();
    const formValidation$ = this.createFormValidation$();

    this.validationSubscription = merge(
      this.manageOnChange$(changeValidation$, blurValidation$),
      this.manageOnBlur$(
        blurValidation$,
        merge(submitValidation$, formValidation$)
      )
    ).subscribe(validationResults => {
      this.setState({ errors: validationResults });
    });

    this.submissionSubscription = this.manageFormValidation$(
      submitValidation$
    ).subscribe(errors => {
      this.setState(
        {
          isValidating: false,
          errors
        },
        () => {
          if (isEmptyObj(errors)) {
            this.props.onSubmit(this.state.values);
          }
        }
      );
    });

    this.formValidationSubscription = this.manageFormValidation$(
      formValidation$
    ).subscribe(errors => {
      this.setState({ errors });
    });

    this.forceUpdate();
  }
  public componentWillUnmount() {
    if (this.submissionSubscription) {
      this.submissionSubscription.unsubscribe();
    }
    if (this.validationSubscription) {
      this.validationSubscription.unsubscribe();
    }
    if (this.formValidationSubscription) {
      this.formValidationSubscription.unsubscribe();
    }
  }

  public attachField = (
    name: string,
    multiField: boolean,
    validator?: (state: Partial<FormHelperState>) => object
  ) => {
    if (validator) {
      this.fields[name] = {
        multiField,
        validator
      };
    } else {
      this.fields[name] = {
        multiField
      };
    }
  };

  public detachField = (name: string) => {
    delete this.fields[name];
  };

  public runFieldLevelValidation = (name: string, value: any) => {
    return new Promise(resolve => resolve(this.fields[name].validator(value)))
      .then(result => (isEmptyObj(result) ? null : result))
      .catch(error => ({
        [ValidationErrorKey]: error.message || "Error with validation try again"
      }));
  };

  public runAllFieldLevelValidations = () => {
    const validatorKeys = Object.keys(this.fields);

    return Promise.all(
      validatorKeys.reduce((result: Array<Promise<any>>, name) => {
        if (this.fields[name].validator) {
          result.push(
            this.runFieldLevelValidation(
              name,
              retrieveInternalValue(this.state.values, name)
            ).then(validationResult =>
              this.fields[name] && this.fields[name].multiField
                ? { [`${toPath(name).slice(-1)[0]}`]: validationResult }
                : validationResult
            )
          );
        }
        return result;
      }, [])
    ).then(errors => combineFieldValidationResults(validatorKeys, errors));
  };

  public runFormLevelValidation = () => {
    const { rootValidators } = this.props;
    const { values } = this.state;

    const keysArray = Object.keys(rootValidators);

    return Promise.all(
      keysArray.map(key =>
        new Promise(res => res(rootValidators[key](values)))
          .then(result => (isEmptyObj(result) ? null : result))
          .catch(error => ({
            [ValidationErrorKey]: error.message || "Validation failed try again"
          }))
          .then(validationResult => {
            return this.fields[key] && this.fields[key].multiField
              ? { [`${toPath(key).slice(-1)[0]}`]: validationResult }
              : validationResult;
          })
      )
    ).then(errorsArray => {
      return combineFieldValidationResults(keysArray, errorsArray);
    });
  };

  public handleSubmit = () => {
    if (this.triggerSubmission$) {
      this.triggerSubmission$();
    }
  };

  public resetForm = () => {
    this.setState({
      values: this.props.initialValues,
      errors: {},
      touched: {},
      isValidating: false,
      isSubmitting: false
    });
  };

  public addField = (name: string, value: any) => {
    this.setState(prevState => ({
      values: setInternalValue(prevState.values, name, value)
    }));
  };

  public removeField = (name: string) => {
    this.setState((prevState: FormHelperState) => ({
      values: removeInternalValue(prevState.values, name),
      errors: removeInternalValue(prevState.errors, name),
      touched: removeInternalValue(prevState.touched, name)
    }));
  };

  public setTouched = (val: boolean, ...names: any[]) => {
    this.setState(prevState => ({
      touched: names.reduce(
        (result, currentName) => setInternalTouched(result, currentName, val),
        prevState.touched
      )
    }));
  };

  public setFormState = (
    stateChange: StateChange,
    callback: () => void = () => {
      return;
    }
  ): void => {
    this.setState(stateChange, callback);
  };

  public setFieldValue = (
    field: string,
    value: any,
    callback?: (input?: any) => void
  ) => {
    this.setState(
      prevState => ({
        ...prevState,
        values: setInternalValue(prevState.values, field, value)
      }),
      () => {
        if (callback) {
          callback();
        }
      }
    );
  };

  public getStateAndHelpers = () => {
    const {
      addField,
      attachField,
      detachField,
      removeField,
      setTouched,
      handleSubmit,
      state,
      resetForm,
      triggerFieldChange$,
      triggerFieldBlur$,
      triggerSubmission$,
      triggerFormValidation$,
      setFieldValue,
      setFormState
    } = this;

    return {
      addField,
      attachField,
      detachField,
      removeField,
      setTouched,
      handleSubmit,
      ...state,
      resetForm,
      triggerFieldChange$,
      triggerFieldBlur$,
      triggerSubmission$,
      triggerFormValidation$,
      retrieveInternalValue,
      setFieldValue,
      setFormState
    };
  };
  public render() {
    const { children } = this.props;
    return (
      <FormContext.Provider value={{ ...this.getStateAndHelpers() }}>
        {children({ ...this.getStateAndHelpers() })}
      </FormContext.Provider>
    );
  }
}
