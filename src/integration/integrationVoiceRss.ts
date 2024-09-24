import * as dotenv from "dotenv";
import axios from "axios";
import { ApiError } from "utils/apiError";
import { errors } from "config/errors";

dotenv.config();
const BASE_SERVER_VOICERSS = process.env.BASE_SERVER_VOICERSS || "";
const TOKEN_VOICERSS = process.env.TOKEN_VOICERSS || "";

class IntegrationVoiceRss {
    public fetchApiTextToSpeech = async (text: string): Promise<string> => {
        try {
            console.debug("FETCHING DATA FROM SERVER", BASE_SERVER_VOICERSS);
            const url = `${BASE_SERVER_VOICERSS}/?key=${TOKEN_VOICERSS}&hl=id-id&c=MP3&src=${encodeURIComponent(text)}`;

            console.debug("URL", url);

            // Fetching the audio as binary data (ArrayBuffer)
            const response = await axios.get(url, { responseType: "arraybuffer" });

            // Convert the response data (ArrayBuffer) to Base64
            const base64String = Buffer.from(response.data, "binary").toString("base64");

            // Prefixing with data URL format for audio
            const dataUrl = `data:audio/mp3;base64,${base64String}`;

            console.debug("AUDIO BASE64 STRING CREATED", dataUrl);

            return dataUrl; // Return the Base64 data URL

        } catch (error: any) {
            console.error(error);
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new IntegrationVoiceRss();
