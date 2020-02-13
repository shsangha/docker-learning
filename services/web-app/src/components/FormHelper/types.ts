import { ElementType } from "react";

export interface IndexSignatureObject {
  [key: string]: any;
}

export const ValidationErrorKey = "validation_function_error_key";

export interface FormHelperState {
  values: object;
  touched: object;
  errors: object;
  isValidating: boolean;
  isSubmitting: boolean;
}

export interface FormHelperContext {
  addField: (name: string, value: any) => void;
  attachField: (
    name: string,
    multiField: boolean,
    validator?: (state: Partial<FormHelperState>) => object
  ) => void;
  detachField: (name: string) => void;
  removeField: (name: string) => void;
  setTouched: (val: boolean, ...names: any[]) => void;
  handleSubmit: () => void;
  values: object;
  touched: object;
  errors: object;
  isValidating: boolean;
  isSubmitting: boolean;
  resetForm: () => void;
  triggerFieldChange$: (name: string, value: any) => void;
  triggerFieldBlur$: (name: string, value: any) => void;
  retrieveInternalValue: (object: object, name: string) => any;
  triggerSubmission$: () => void;
  triggerFormValidation$: () => void;
  setFieldValue: (field: string, value: any, callback?: () => void) => void;
  setFormState: (stateChange: StateChange, callback?: () => void) => void;
}

export interface FormHelperProps {
  initialValues: object;
  onSubmit: (input: null | Partial<FormHelperState>) => void;
  children: (input: FormHelperContext) => React.ReactNode;
  rootValidators: {
    [key: string]: (state: Partial<FormHelperState>) => object;
  };
}

type StateUpdater = (state: FormHelperState) => object;
type StateObj = object;

export type StateChange = StateUpdater | StateObj;

export interface FormFieldHOCProps {
  name: string;
  validateOnChange: boolean;
  validateOnBlur: boolean;
  validator?: (state: object) => object;
  children: ({

  }: {
    field: Field;
    value: any;
    errors: object;
    touched: boolean;
  }) => React.ReactElement;
}

export type ChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;
export type BlurHandler = (event: React.FocusEvent<HTMLInputElement>) => void;

type Field = (
  ...args: any[]
) => {
  onChange: ChangeHandler;
  onBlur: BlurHandler;
  value: any;
  name: string;
};

export interface FieldProps {
  FieldState: {
    value: any;
    errors: object;
    touched: boolean;
  };
  field: Field;
  children: ({

  }: {
    field: Field;
    value: any;
    errors: object;
    touched: boolean;
    [key: string]: any;
  }) => React.ReactElement;
  addField: (name: string, value: any) => void;
  attachField: (
    name: string,
    multiField: boolean,
    validator?: (state: Partial<FormHelperState>) => object
  ) => void;
  detachField: (name: string) => void;
  removeField: (name: string) => void;
  setTouched: (val: boolean, ...names: any[]) => void;
  handleSubmit: () => void;
  values: object;
  touched: object;
  name: string;
  errors: object;
  isValidating: boolean;
  isSubmitting: boolean;
  resetForm: () => void;
  triggerFieldChange$: (name: string, value: any) => void;
  triggerFieldBlur$: (name: string, value: any) => void;
  retrieveInternalValue: (object: object, name: string) => any;
  triggerSubmission$: () => void;
  triggerFormValidation$: () => void;
  setFieldValue: (field: string, value: any, callback?: () => void) => void;
  setFormState: (stateChange: StateChange, callback?: () => void) => void;
}

export interface WithDataProps<T> {
  data: T;
}
