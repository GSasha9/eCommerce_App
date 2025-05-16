export type CommercetoolsApiError = Error & {
  body: ApiErrors;
};
export type ApiErrors = {
  statusCode: number;
  errors: ApiError[];
};
export type ApiError = {
  code: string;
  message: string;
};
