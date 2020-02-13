import React from "react";
import { FormFieldHOCProps, FieldProps, FormHelperState } from "./types";
import { FormContext } from "./index";
import retrieveInternalValue from "./utils/retrieveInternalValue";

export default (
  Component: React.ComponentType<FieldProps>,
  multiField: boolean
) =>
  class FormFieldHoc extends React.Component<FormFieldHOCProps> {
    public static contextType = FormContext;

    public context!: React.ContextType<typeof FormContext>;
    public static defaultProps = {
      validateOnChange: true,
      validateOnBlur: true
    };

    public componentDidMount() {
      const { name, validator } = this.props;

      const args: [
        string,
        boolean,
        ((state: Partial<FormHelperState>) => object)?
      ] = [name, multiField];

      if (validator) {
        args.push(validator);
      }
      this.context.attachField(...args);
    }

    public componentDidUpdate(prevProps: FormFieldHOCProps) {
      const { name, validator } = this.props;
      // nned to pipe here too if the validator is a root
      if (prevProps.name !== name || prevProps.validator !== validator) {
        const args: [
          string,
          boolean,
          ((state: Partial<FormHelperState>) => object)?
        ] = [name, multiField];

        if (validator) {
          args.push(validator);
        }
        this.context.attachField(...args);
      }
    }

    public componentWillUnmount() {
      const { name } = this.props;
      const { detachField, removeField } = this.context;
      removeField(name);
      detachField(name);
    }

    public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = event.currentTarget;

      let newValue: string | boolean = value;

      if (type && type === "checkbox") {
        newValue = checked;
      }

      this.context.setFieldValue(name, newValue, () => {
        if (this.props.validateOnChange) {
          this.context.triggerFieldChange$(name, newValue);
        }
      });
    };

    public handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (this.props.validateOnBlur) {
        this.context.triggerFieldBlur$(
          this.props.name,
          this.context.retrieveInternalValue(
            this.context.values,
            this.props.name
          )
        );
      }
    };

    public field = ({
      onChange,
      onBlur,
      ...rest
    }: {
      onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
      onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
    } = {}) => {
      const { values } = this.context;

      const { name } = this.props;

      const value = retrieveInternalValue(values, name);

      return {
        onChange: onChange || this.handleChange,
        onBlur: onBlur || this.handleBlur,
        value,
        name,
        ...rest
      };
    };

    public getFieldState = () => {
      const { name } = this.props;
      const { values, errors, touched } = this.context;

      return {
        value: retrieveInternalValue(values, name),
        errors: retrieveInternalValue(errors, name),
        touched: retrieveInternalValue(touched, name)
      };
    };

    public render() {
      const FieldState = this.getFieldState();
      const field = this.field;

      return (
        <Component
          {...this.props}
          {...this.context}
          field={field}
          FieldState={FieldState}
        />
      );
    }
  };
