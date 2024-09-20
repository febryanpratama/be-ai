import { error } from "console";

export const errors = {
  NOT_FOUND: {
    httpCode: 404,
    errorCode: 404000,
    description: "Not found",
  },
  UNAUTHENTICATED: {
    httpCode: 401,
    errorCode: 401000,
    description: "Unauthorized",
  },
  INVALID_EMAIL: {
    httpCode: 400,
    errorCode: 400001,
    description: "Invalid email",
  },
  INVALID_USERNAME: {
    httpCode: 400,
    errorCode: 400002,
    description: "Invalid username",
  },
  INVALID_PASSWORD: {
    httpCode: 400,
    errorCode: 400003,
    description: "Invalid password",
  },
  INVALID_CREATE_USER: {
    httpCode: 400,
    errorCode: 400004,
    description: "Invalid create user",
  },
  INVALID_NAME: {
    httpCode: 400,
    errorCode: 400006,
    description: "Invalid name",
  },
  INVALID_PRICE: {
    httpCode: 400,
    errorCode: 400007,
    description: "Invalid number",
  },
  INVALID_DURATION: {
    httpCode: 400,
    errorCode: 400008,
    description: "Invalid duration",
  },
  INVALID_NUMBER: {
    httpCode: 400,
    errorCode: 400009,
    description: "Invalid number",
  },
  INVALID_STRING: {
    httpCode: 400,
    errorCode: 400010,
    description: "Invalid string",
  },
  USER_NOT_FOUND: {
    httpCode: 400,
    errorCode: 404001,
    description: "User not found",
  },
  USER_ALREADY_EXISTS: {
    httpCode: 400,
    errorCode: 400005,
    description: "User already exists",
  },
  TOKEN_REQUIRED: {
    httpCode: 401,
    errorCode: 401001,
    description: "Token required",
  },
  VALIDATION_ERROR: {
    httpCode: 422,
    errorCode: 422000,
    description: "Validation error",
  },
  INTERNAL_SERVER_ERROR: {
    httpCode: 500,
    errorCode: 500000,
    description: "Internal server error",
  },
  ERROR_ADD_FAVORITE: {
    httpCode: 500,
    errorCode: 500001,
    description: "Error add favorite",
  },
  ERROR_ADD_FAVORITE_ALREADY_EXISTS: {
    httpCode: 400,
    errorCode: 400001,
    description: "Error add favorite, already exists",
  },
  ERROR_DELETE_FAVORITE: {
    httpCode: 500,
    errorCode: 500001,
    description: "Error delete favorite",
  },
  ERROR_LOCKED: {
    httpCode: 423,
    errorCode: 400023,
    description: "Error locked",
  },
  ERROR_PACKAGE : {
    httpCode: 400,
    errorCode: 400024,
    description: "Error PACKAGE"
  },
  OTP_NOT_VALID : {
    httpCode: 400,
    errorCode: 400025,
    description: "OTP not valid"
  },
  INVALID_TYPE_MOOD: {
    httpCode: 400,
    errorCode: 400026,
    description: "Invalid type mood"
  },
  INVALID_TYPE_EMOTICON: {
    httpCode: 400,
    errorCode: 400027,
    description: "Invalid type emoticon"
  },  
}
