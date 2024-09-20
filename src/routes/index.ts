import {Request, Response, Router} from "express";
import swaggerUi from "swagger-ui-express";
import {ApiError} from "utils/apiError";
import {errors} from "config/errors";

export const routes = Router();

routes.get("/api", (_req: Request, res: Response) =>
  res.send("<a href=\"/docs\">See the API docs!</a>"),
);

routes.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) =>
  res.send(swaggerUi.generateHTML(await import("../../build/swagger.json"))),
);

 
routes.use("*", (req, res, next) => {
  throw new ApiError(errors.NOT_FOUND, false, `${req.originalUrl} not found`);
});
