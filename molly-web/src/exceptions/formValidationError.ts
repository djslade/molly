export class FormValidationError extends Error {
  message: string;

  constructor({ message }: FormValidationErrorProps) {
    super();
    this.message = message;
  }
}

interface FormValidationErrorProps {
  message: string;
}
