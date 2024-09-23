import * as dotenv from "dotenv";
import https from "https";
import axios from "axios";
import { ApiError } from "utils/apiError";
import { errors } from "config/errors";



dotenv.config();
const BASE_SERVER_CHATGPT = process.env.BASE_SERVER_CHATGPT || "";
const endpointGenerateUser = "/api/generate/text"
const endpointGenerateAssistant = "/api/generate/text-assistant"

class IntegrationChatGpt {
    public postMbti = async (prompt: string): Promise<any> => {
        try {
            console.debug("FETCHING DATA FROM SERVER POST MBTI", endpointGenerateUser);
            const response = await axios.post(BASE_SERVER_CHATGPT + endpointGenerateUser, {
                prompt
            })
            console.debug("RESPONSE POST MBTI", response.data);
            return response.data.result;

        }catch (error : any) {
            console.error(error);
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
    }

    public storeChatgpt = async (prompt: any): Promise<any> => {
        try {
            const response = await axios.post(BASE_SERVER_CHATGPT + endpointGenerateAssistant, {
                prompt
            })
            return response.data.result;

        }catch (error : any) {
            console.error(error);
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new IntegrationChatGpt();