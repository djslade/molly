interface ErrorObject {
  code: number;
  message?: string;
  details?: string;
}

export const isErrorObject = (error: object | string): error is ErrorObject => {
  if (typeof error === 'string') return false;
  if (!error['code']) return false;
  if (typeof error['code'] !== 'number') return false;
  return true;
};
