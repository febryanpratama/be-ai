import {client} from "root/src/db/db";
import {ApiError} from "utils/apiError";
import {errors} from "config/errors";
import integrationChatGpt from "root/src/integration/IntegrationChatGpt";
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from "uuid";
import path from 'path';

class ReminderDetailService {
    public get = async (reminderId: number): Promise<any> => {
        const dataReminderDetail = await client().reminderDetail.findMany({
            where : {
                reminderId
            },
            include : {
                reminder: true
            }
        })

        return dataReminderDetail;
    }

    public postReminderDetail = async (body: any, reminderId: number, userId: number): Promise<any> => {

        try {
            // Decode Base64 image
            const base64Data = body.foto.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');

            // Generate unique file name using uuid
            const fileExtension = 'png'; // Default to png, adjust dynamically if needed
            const uniqueFileName = `${uuidv4()}.${fileExtension}`;

            // Define the upload directory and file path
            const uploadDir = './uploads';
            const filePath = path.join(uploadDir, uniqueFileName);

            // Ensure the upload directory exists
            await mkdir(uploadDir, { recursive: true });

            // Save file to the system
            await writeFile(filePath, buffer);


            const storeReminderDetail = await client().reminderDetail.create({
                data: {
                    reminderId,
                    tanggapan: body.tanggapan,
                    foto: filePath,
                    isUser: true
                }
            })

            // create reponse tanggapan dari ai
            const profileChatGPT = await client().profileUser.findFirst({
                where: {
                    userId
                }
            })

            const type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being fisik pengguna."; // physical
            var promptAi = `Sebagai psikolog berpengalaman menangani gender Perempuan, kamu akan menjadi AI dalam aplikasi yang membantu pengguna meningkatkan well-beingnya. Kamu berkomunikasi langsung dengan pengguna, sehingga tidak perlu merespon command prompt ini dan silakan mulai sapa pengguna dengan sapaan sesuai waktu (pagi, siang, sore, malam), gunakan selalu gaya komunikasi  Ramah dan panjangnya balasan chat Anda kepada pengguna Singkat, serta tolong berikan respon curhat yang positif. ${type}. Arahkan pembicaraan menjadi positif dan solutif tanpa menghakimi pengguna apabila dalam pembicaraan dengan pengguna muncul respon pengguna yang mengandung unsur Negative Thought Patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar mudah dipahami. Berikan semua jawaban dalam format HTML, menggunakan tag seperti <p>, <br>, dll.`;
            if (profileChatGPT) {
                promptAi = `Sebagai psikolog berpengalaman menangani gender ${profileChatGPT.gender === "" ? "Perempuan" : profileChatGPT.gender}, kamu akan menjadi AI dalam aplikasi yang membantu pengguna meningkatkan well-beingnya. Kamu berkomunikasi langsung dengan pengguna, sehingga tidak perlu merespon command promptAi ini dan silakan mulai sapa pengguna dengan sapaan sesuai waktu (pagi, siang, sore, malam), gunakan selalu gaya komunikasi  ${profileChatGPT.gayaKomunikasi === "" ? "Ramah" : profileChatGPT.gayaKomunikasi} dan panjangnya balasan chat Anda kepada pengguna ${profileChatGPT.durasiKomunikasi === "" ? "Singkat" : profileChatGPT.durasiKomunikasi}, serta tolong berikan respon curhat yang positif. ${type}. Arahkan pembicaraan menjadi positif dan solutif tanpa menghakimi pengguna apabila dalam pembicaraan dengan pengguna muncul respon pengguna yang mengandung unsur Negative Thought Patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar mudah dipahami. Berikan semua jawaban dalam format HTML, menggunakan tag seperti <p>, <br>, dll.`;
            }

            
            const messagePrompt = ([
                {
                    role: 'user',
                    content: promptAi
                },
                { 
                    role: 'user', 
                    content: body.tanggapan 
                },
            ]);

            const resp = await integrationChatGpt.storeChatgpt(messagePrompt);

            const storeReminderDetailAi = await client().reminderDetail.create({
                data: {
                    reminderId,
                    tanggapan: resp.response, // result tanggapan dari ai
                    foto: null,
                    isUser: false
                }
            })

            const reminderDetail = await client().reminderDetail.findMany({
                where: {
                    reminderId
                }
            })


            return reminderDetail;
        } catch (e:any) {
        //     err data
            console.debug("Catch ERROR ========================")
            console.debug(e)
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
        
        
    }
}

export default new ReminderDetailService();