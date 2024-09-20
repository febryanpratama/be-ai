import "module-alias/register";

import { appLogger } from "config/logger";
import express from "express";
import { postRoutesMiddleware, preRoutesMiddleware } from "middleware";
import { RegisterRoutes } from "root/build/routes";
import { routes } from "routes";

const app = express();

preRoutesMiddleware(app);

RegisterRoutes(app);
app.use("/api", routes);

postRoutesMiddleware(app);


app.listen(process.env.PORT, () => {
    appLogger.info(
        `Server started at ${process.env.NODE_ENV} ${process.env.BASE_URL}:${process.env.PORT}`,
    );
});
