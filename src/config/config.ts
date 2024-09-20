import * as dotenv from "dotenv";

dotenv.config();

// import joi from 'joi';

// const envVarsSchema = joi
//   .object()
//   .keys({
//     BASE_URL: joi.string().uri(),
//     // DATABASE_URL: joi.string().required(),
//     JWT_PUBLIC_KEY: joi.string().required(),
//     LOG_LEVEL: joi
//       .string()
//       .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
//       .description('Server log level')
//       .required(),
//     NODE_ENV: joi
//       .string()
//       .valid('production', 'development', 'test')
//       .required(),
//     PORT: joi.number().required(),
//     ENVIRONMENT: joi.string(),
//   })
//   .unknown();

// const { error } = envVarsSchema
//   .prefs({ errors: { label: 'key' } })
//   .validate(process.env);

// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

// const BASE_SERVER = process.env.BASE_SERVER || '';

export const isDevelopment = process.env.NODE_ENV === "development";

export const isDebugging = process.env.LOG_LEVEL === "debug";

