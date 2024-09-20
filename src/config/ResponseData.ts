export interface ResponseData<T> {
  errorCode: number,
  message: string,
  result: T
}

export function createResponse<T>(result: T): ResponseData<T> {
  return {
    errorCode: Number("00"),
    message: "Success",
    result: result,
  };
}
