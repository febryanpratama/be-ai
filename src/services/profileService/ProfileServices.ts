import { errors } from "config/errors";
import { client } from "root/src/db/db";
import IntegrationChatGpt from "root/src/integration/IntegrationChatGpt";
import { ApiError } from "utils/apiError";
import HastUtils from "utils/HastUtils";


class ProfileServices {
    public getMbti = async (body: any, userId: number): Promise<any> => {
        try {
            const postData = await IntegrationChatGpt.postMbti(body.prompt);

            console.debug(postData);

        if(!postData) {
            console.debug("ERRORRRRR");
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
                    description: postData.response,
                    bahasa: body.bahasa,
                    gayaKomunikasi: body.gaya_komunikasi,
                    durasiKomunikasi: body.durasi_komunikasi
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
            
        } catch (error) {
            console.debug(error);
        }
        

    }
}

export default new ProfileServices();