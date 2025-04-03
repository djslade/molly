interface ErrorObject {
  code: number;
  message?: string;
  details?: string;
}

export const isErrorObject = (error: any): error is ErrorObject => {
  return error.code !== undefined;
};
