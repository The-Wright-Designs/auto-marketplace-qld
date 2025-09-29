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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export interface FormInputTextProps extends FormInputBaseProps {
  placeholder: string;
}

export interface FormInputEmailProps extends FormInputBaseProps {
  placeholder: string;
}

export interface FormInputNumberProps extends FormInputBaseProps {
  placeholder: string;
  min?: number;
  max?: number;
}

export interface FormInputTelProps extends FormInputBaseProps {
  placeholder: string;
}

export interface FormInputSelectProps extends FormInputBaseProps {
  options: SelectOption[];
  placeholder?: string;
}

export interface FormInputFileProps extends FormInputBaseProps {
  description?: string;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  progressiveUpload?: boolean;
}