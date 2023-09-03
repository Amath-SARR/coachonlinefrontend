export interface CreateAccountFormProps {
  onSubmit: (data: any) => void;
  fields?: string[];
  defaultValues?: any;
  submitLabel?: string;
  labels?: {
    email?: string;
    login?: string;
    password?: string;
    repeatPassword?: string;
    firstName?: string;
    lastName?: string;
    phoneNo?: string;
  };
}

export interface RegisterForm {
  login?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  repeat?: string;
}
