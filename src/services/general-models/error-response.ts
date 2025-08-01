export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    target?: string;
  };
}
