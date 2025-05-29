interface ApiErrorProps {
  message: string;
  code: number;
}

export class ApiError extends Error {
  message: string;
  code: number;

  constructor({ message, code }: ApiErrorProps) {
    super();
    this.message = message;
    this.code = code;
  }
}
