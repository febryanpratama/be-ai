import { errors } from "config/errors";
import { Hash } from "crypto";
import { client } from "root/src/db/db";
import IntegrationChatGpt from "root/src/integration/IntegrationChatGpt";
import { ApiError } from "utils/apiError";
import HastUtils from "utils/HastUtils";


class ProfileServices {
    public getMbti = async (body: any, userId: number): Promise<any> => {
        const postData = await IntegrationChatGpt.postMbti(body.prompt);

        if(!postData) {
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }

        const checkProfile = await client().profileUser.findFirst({
            where: {
                userId
            }
        });

        if(checkProfile) {
            const updateMbti = await client().profileUser.findFirst({
                where: {
                    userId: Number(userId)
                }
            })

            return updateMbti;

        }else{
            const storeMbti = await client().profileUser.create({
                data: {
                    userId,
                    gender: body.gender,
                    nama: body.nama,
                    username: body.username || null,
                    foto: body.foto || null,
                    description: postData.response
                }
            })

            const password = await HastUtils.hashPassword(body.password)

            const updateUser = await client().user.update({
                where: {
                    id: userId
                },
                data: {
                    password,
                    username: body.username
                }
            });


            return storeMbti;
        }

    }
}

export default new ProfileServices();