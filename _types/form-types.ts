export interface SelectOption {
  value: string;
  label: string;
}

export interface FormInputBaseProps {
  id: string;
  name: string;
  required?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
}

export interface FormInputTextProps extends FormInputBaseProps {
  placeholder: string;
  type?: string;
}

export interface FormInputEmailProps extends FormInputBaseProps {
  placeholder: string;
}

export interface FormInputNumberProps extends FormInputBaseProps {
  placeholder: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormInputTelProps extends FormInputBaseProps {
  placeholder: string;
}

export interface FormInputTextareaProps extends FormInputBaseProps {
  placeholder: string;
  rows?: number;
  maxLength?: number;
}

export interface FormInputPasswordProps extends FormInputBaseProps {
  placeholder: string;
  autoComplete?: string;
  description?: string;
}

export interface FormInputSelectProps extends FormInputBaseProps {
  options: SelectOption[];
  placeholder?: string;
}

export interface FormInputCheckboxProps extends Omit<FormInputBaseProps, 'placeholder'> {
  checked?: boolean;
  children?: React.ReactNode;
}

export interface FormInputFileProps extends FormInputBaseProps {
  description?: string;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  progressiveUpload?: boolean;
}
