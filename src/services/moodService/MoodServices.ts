import IntegrationChatGpt from "root/src/integration/IntegrationChatGpt"
import { client } from "root/src/db/db"
import { ApiError } from "utils/apiError";
import { errors } from "config/errors";



class MoodServices {
    public getMood = async (userId: number): Promise<any> => {
        // 
        const dataMoodUser = await client().moodUser.findMany({
            where: {
                userId
            }
        })

        return dataMoodUser
    }

    public storeMood = async (body: any, userId: number): Promise<any> => {
        // 

        try {
            
            const prompt = `Saat ini kamu merasa ${body.emoticon}, saya memiliki curhatan ${body.description}. Apakah kamu ingin saya memberikan saran?`
            const resp = await IntegrationChatGpt.postMbti(prompt);

            console.debug("RESPONSE AI", resp);
            console.debug("RESPONSE AI KEY", resp.response);
    
            const addMood = await client().moodUser.create({
                data: {
                    emoticon: body.emoticon,
                    description: body.description,
                    type: body.type,
                    date: new Date(),
                    responseAi: resp.response,
                    userId
                }
            })
    
            return addMood
        } catch (error) {
            console.debug("error", error)
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new MoodServices();