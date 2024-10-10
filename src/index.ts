import "module-alias/register";

import { appLogger } from "config/logger";
import express from "express";
import { postRoutesMiddleware, preRoutesMiddleware } from "middleware";
import { RegisterRoutes } from "root/build/routes";
import { routes } from "routes";
import { AudioController } from "controllers/audio/AudioController";
import { uploadMiddleware } from "middleware/context";
import path from "path";
import cron from "node-cron";
import  ReminderService  from "./services/reminderService/ReminderService";

const app = express();

app.post("/api/audio/convert", uploadMiddleware, async (req, res, next) => {
    try {
        // Memastikan bahwa file ada dalam request
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        // Memanggil controller TSOA
        const audioController = new AudioController();
        const audio = await audioController.convertAudioToText(req.file);

        // Mengirim respons berupa audio file audio
        res.json(audio);
    } catch (error) {
        next(error);
    }
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json({ limit: "50mb" }));
preRoutesMiddleware(app);

RegisterRoutes(app);
app.use("/api", routes);

postRoutesMiddleware(app);

// Task scheduling with node-cron
cron.schedule("* * * * *", () => {
    ReminderService.getNotifReminder();  // Panggil task logic di sini
});


app.listen(process.env.PORT, () => {
    appLogger.info(
        `Server started at ${process.env.NODE_ENV} ${process.env.BASE_URL}:${process.env.PORT}`,
    );
});
