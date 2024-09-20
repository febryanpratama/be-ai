import {isDebugging} from "config/config";
import {errors} from "config/errors";
import {appLogger} from "config/logger";
import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status";
import {ValidateError} from "tsoa";
import {ApiError} from "utils/apiError";

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;
  if (error instanceof ValidateError) {
    error = new ApiError(errors.VALIDATION_ERROR, true, err.fields);
  } else if (!(error instanceof ApiError)) {
    error = new ApiError(errors.INTERNAL_SERVER_ERROR, false, null, err.stack);
  }
  next(error);
};

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
   
  next: NextFunction,
) => {
  let {message} = err;
  const {httpCode} = err;
  if (!err.isOperational) {
    message = message || httpStatus.INTERNAL_SERVER_ERROR.toString();
  }

  const response = {
    errorCode: err.errorCode,
    message,
    additionalInfo: err.additionalInfo,
    ...(isDebugging && {stack: err.stack}),
  };

  if (isDebugging) {
    appLogger.error(err.stack);
    appLogger.info(JSON.stringify(response));
  }

  res.status(httpCode).send(response);
};
