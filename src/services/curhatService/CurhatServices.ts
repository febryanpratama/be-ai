import { client } from "root/src/db/db"
import IntegrationChatGpt from "root/src/integration/IntegrationChatGpt"
import { ApiError } from "utils/apiError";
import { errors } from "config/errors";
import { v4 as uuidv4 } from "uuid";
import integrationChatGpt from "root/src/integration/IntegrationChatGpt";


interface promptInterface {
    role: string;
    content: string;
}

export enum sessionType {
    physical = "physical",
    mental_emotional = "mental_emotional",
    social = "social",
    spiritual = "spiritual",
    financial = "financial",
    bot = "bot",
}


class CurhatServices {

    public getCurhat = async (userId: number, type?: string): Promise<any> => {
        // Ensure type is a valid sessionType or default to 'physical'
        const validType: sessionType =
            (type === "" || !Object.values(sessionType).includes(type as sessionType))
                ? sessionType.bot // Default to 'bot' if type is empty or invalid
                : (type as sessionType); // Cast to sessionType if valid

        console.debug("=======validType========", validType);
        const dataCurhat = await client().conversation.findMany({
            where: {
                userId,
                type: validType, // Use validType here
            },
            orderBy: {
                createdAt: "asc" // Sort by newest date first
            }
        });

        return dataCurhat;
    }

    public storeCurhat = async (body:any, userId:number): Promise<any> => {
        let setStore: any;

        if (body.uuid === "") {
            // Create a new conversation if uuid is empty
            setStore = await this._storeConversation(body, userId);
        } else {
            // Find the existing conversation if uuid is provided
            setStore = await client().conversation.findFirst({
                where: {
                    uuid: body.uuid,
                    userId
                }
            });
        }

        // Detail Conversation User
        const storeDetailConverstaion = await client().detailConversation.create({
            data: {
                conversationId: setStore.id,
                response: body.prompt,
                isUser: true,
                readeble: false,
                roleAi: "user"

            }
        })

        const resp = await IntegrationChatGpt.postMbti(body.prompt);

        // Detail Conversation AI
        const storeDetailConverstaionAI = await client().detailConversation.create({
            data: {
                conversationId: setStore.id,
                response: resp.response,
                isUser: false,
                readeble: true,
                roleAi: "assistant"
            }
        })


        return storeDetailConverstaionAI;

    }


    public _storeConversation = async (body: any, userId: number): Promise<any> => {

        const uuid = uuidv4();
        const storeConversation = await client().conversation.create({
            data: {
                uuid,
                userId,
                type: body.tipe == "" ? "bot" : body.tipe
            }
        })

        return storeConversation;
    }
    
    public detailCurhat = async (body: any, userId: number): Promise<any> => {
     
        // get detail by newest date
        const detailConversation = await client().detailConversation.findMany({
            where: {
                conversationId: body.conversation_id,
                conversation: {
                    userId // Adjust this according to your schema
                },
                readeble: true
            },include: {
                conversation: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        return detailConversation
    }

    public storeDetailCurhat = async (body: any, userId: number): Promise<any> => {
        const storeDetailConverstaion = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: body.prompt,
                isUser: true,
                readeble: true,
                roleAi: "user"
            }
        })

        const getListDetailConversation = await this.getListAllDetailConversation(body.conversation_id);

        const messagePrompt : promptInterface[] = [];

        getListDetailConversation.map(async (item:any) => {
            messagePrompt.push({
                role: item.roleAi,
                content: item.response
            })
        });

        const resp = await IntegrationChatGpt.storeChatgpt(messagePrompt);

        const storeDetailConverstaionAI = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: resp.response,
                isUser: false,
                readeble: true,
                roleAi: "assistant"
            }
        })

        const listDetailConversation = await client().detailConversation.findMany({
            where: {
                conversationId: body.conversation_id,
                readeble: true
            }
        })

        return storeDetailConverstaionAI;
    }

    public storeDetailCurhatChatGpt = async (body: any, userId: number): Promise<any> => {
        const storeDetailConverstaion = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: body.prompt,
                isUser: true,
                readeble: true,
                roleAi: "user"
            }
        })

        const getListDetailConversation = await this.getListAllDetailConversation(body.conversation_id);

        const messagePrompt : promptInterface[] = [];

        getListDetailConversation.map(async (item:any) => {
            messagePrompt.push({
                role: item.roleAi,
                content: item.response
            })
        });

        const resp = await IntegrationChatGpt.storeChatgpt(messagePrompt);

        const storeDetailConverstaionAI = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: resp.response,
                isUser: false,
                readeble: true,
                roleAi: "assistant"
            }
        })

        const listDetailConversation = await client().detailConversation.findMany({
            where: {
                conversationId: body.conversation_id,
                readeble: true
            }
        })

        return storeDetailConverstaionAI;
    }

    public storeSessionCurhat = async (respBody: any, userId: number): Promise<any> => {

        try {
            const profileChatGPT = await client().profileUser.findFirst({
                where: {
                    userId
                }
            })

            if(!profileChatGPT){
                const updateProfile = await client().profileUser.create({
                    data: {
                        userId,
                        nama: "Saya",
                        gender: respBody.jenis_kelamin,
                        gayaKomunikasi: respBody.gaya_bicara,
                        durasiKomunikasi: "Sangat Singkat"
                    }
                })
            }

            let type = "";

            switch (respBody.tipe) {
                case "physical":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being fisik pengguna.";
                    break;
                case "mental_emotional":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being emosi pengguna.";
                    break;
                case "social":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being sosial pengguna.";
                    break;
                case "spiritual":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being rohani pengguna.";
                    break;
                case "financial":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being keuangan pengguna.";
                    break;
                default:
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being pengguna dimulai dari well-being fisik pengguna, lalu lanjutkan well-being rohani pengguna, lalu lanjutkan well-being emosi pengguna, lalu lanjutkan well-being sosial pengguna, lalu lanjutkan well-being keuangan pengguna.";
                    break;
            }

            const prompt = `Sebagai psikolog berpengalaman menangani gender ${respBody.jenis_kelamin === "" ? "Wanita" : respBody.jenis_kelamin}, kamu akan menjadi AI dalam aplikasi yang membantu pengguna meningkatkan well-beingnya. Kamu berkomunikasi langsung dengan pengguna, sehingga tidak perlu merespon command prompt ini dan silakan mulai sapa pengguna dengan sapaan sesuai waktu (pagi, siang, sore, malam), gunakan selalu gaya komunikasi  ${respBody.gaya_bicara === "" ? "Friendly" : respBody.gaya_bicara} dan durasi panjang pendek komunikasi ${respBody.jenis_penyampaian === "" ? "Singkat" : respBody.jenis_penyampaian}, serta tolong berikan respon curhat yang positif. ${type}. Arahkan pembicaraan menjadi positif dan solutif tanpa menghakimi pengguna apabila dalam pembicaraan dengan pengguna muncul respon pengguna yang mengandung unsur Negative Thought Patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar mudah dipahami.`;

            const storeConversation = await this._storeConversation(respBody, userId);

            const body = {
                conversation_id: storeConversation.id,
                prompt : respBody.prompt === "" ? prompt : respBody.prompt,
                roleAi : "system"
            }

            const storeDetailConverstaion = await this.storeDetailCurhatSession(body, userId);

            const getDetailCurhat = await this.detailCurhat(body, userId)

            return getDetailCurhat;
        }catch(e:any){
            console.debug(e);

            throw new ApiError(errors.INTERNAL_SERVER_ERROR)
        }

    }

    public storeSessionBotLogin = async (respBody: any, userId: number): Promise<any> => {

        try {
            const checkProfile = await client().profileUser.findFirst({
                where: {
                    userId
                }
            })

            if(!checkProfile){
                const updateProfile = await client().profileUser.create({
                    data: {
                        userId,
                        nama: "Saya",
                        gender: respBody.jenis_kelamin,
                        gayaKomunikasi: respBody.gaya_bicara,
                        durasiKomunikasi: "Sangat Singkat"
                    }
                })
            }
            const prompt = `Sebagai psikolog berpengalaman menangani gender ${checkProfile ? checkProfile.gender:respBody.jenis_kelamin}, kamu akan menjadi AI dalam aplikasi yang membantu pengguna meningkatkan well-beingnya, silakan sapa pengguna dimulai dengan sapaan sesuai waktu (pagi, siang, sore, malam), gunakan selalu gaya komunikasi  ${checkProfile ? checkProfile.gayaKomunikasi:respBody.jenis_kelamin} dan tingkat panjang pendek komunikasi sangat singkat, serta tolong berikan respon curhat yang positif. Arahkan pembicaraan menjadi positif dan solutif jika dalam pembicaraan terdapat unsur Negative Thought Patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar mudah dipahami.  Apabila pengguna memberi respon yang mengandung unsur Negative Thought Patterns tolong ditanggapi dengan baik, dan Anda harus dapat mengalihkan perlahan-lahan ke pembicaraan yang positif dan solutif.`

            const storeConversation = await this._storeConversation(respBody, userId);

            const body = {
                conversation_id: storeConversation.id,
                prompt : prompt
            }

            const storeDetailConverstaion = await this.storeDetailCurhatSession(body, userId);

            const getDetailCurhat = await this.detailCurhat(body, userId)

            return getDetailCurhat;
        }catch(e:any){
            console.debug(e);

            throw new ApiError(errors.INTERNAL_SERVER_ERROR)
        }

    }


    public getListDetailConversation = async (conversationId: number): Promise<any> => {
        const listDetailConversation = await client().detailConversation.findMany({
            where: {
                conversationId,
                readeble: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        return listDetailConversation
    }

    public storeDetailCurhatSession = async (body: any, userId?: number): Promise<any> => {
        const storeDetailConverstaion = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: body.prompt,
                isUser: true,
                readeble: false,
                roleAi: body.roleAi || "user"
            }
        })

        const resp = await IntegrationChatGpt.postMbti(body.prompt);

        const storeDetailConverstaionAI = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: resp.response,
                isUser: false,
                readeble: true,
                roleAi: "assistant"
            }
        })

        const listDetailConversation = this.getListDetailConversation(body.conversation_id);


        return listDetailConversation;
    }


    public getListAllDetailConversation = async (conversationId: number): Promise<any> => {
        const listDetailConversation = await client().detailConversation.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        return listDetailConversation
    }

    public postSessionOpenApi = async (gender?: string, nama?: string): Promise<any> => {
        const uuid = uuidv4();

        // const CreateSessionOpen = await client().conversation.create({
        //     data: {
        //         uuid: uuid,
        //         userId: null
        //     }
        // });

        const prompt = "Set Prompt disini sesuai dengan tipe chat sosial, mental or etc"

        const reqBody = {
            prompt
        }

        const fetchChatGpt = await integrationChatGpt.postMbti(reqBody.prompt)

        const storeDetailConversation = await this.storeDetailCurhatSession(reqBody)

        return storeDetailConversation; // Return the created session if needed
    }

    public storeGetSessionCurhat = async (userId: number): Promise<any> => {
        const getDetailUser = await client().profileUser.findFirst({
            where: {
                userId
            }
        })

        if (!getDetailUser) {
            throw new ApiError(errors.INVALID_DETAIL_PROFILE);
        }

        const prompt = "Sebagai psikolog berpengalaman yang memahami tipe kepribadian "+getDetailUser.description+" silakan sapa nama "+getDetailUser.nama+" dengan jenis kelamin "+getDetailUser.gender+" yang mau curhat, serta tolong berikan respon curhat yang positif, wise, dan singkat dalam Bahasa Indonesia tanpa mengandung unsur Negative thought patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar memudahkan "+getDetailUser.nama+" memahami.  Apabila "+getDetailUser.nama+" memberi respon yang mengandung unsur Negative thought patterns tolong ditanggapi dengan baik, tanpa menghakimi, tanpa menilai, dan Anda harus dapat mengalihkan ke respon yang solutif."

        const storeConversation = await this._storeConversation({}, userId);

        const body = {
            conversation_id: storeConversation.id,
            prompt : prompt
        }

        const storeDetailConverstaion = await this.storeDetailCurhatSession(body, userId);


        return storeConversation;
    }

    public storeSessionCurhatV2 = async (body: any, userId: number): Promise<any> => {

    }

    public updateRuleSession = async (respBody: any, userId: number): Promise<any> => {
        try {
            let type = "";

            switch (respBody.tipe) {
                case "physical":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being fisik pengguna.";
                    break;
                case "mental_emotional":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being emosi pengguna.";
                    break;
                case "social":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being sosial pengguna.";
                    break;
                case "spiritual":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being rohani pengguna.";
                    break;
                case "financial":
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being keuangan pengguna.";
                    break;
                default:
                    type = "Arahkan pembicaraan menjadi positif dan solutif berkaitan dengan well-being pengguna dimulai dari well-being fisik pengguna, lalu lanjutkan well-being rohani pengguna, lalu lanjutkan well-being emosi pengguna, lalu lanjutkan well-being sosial pengguna, lalu lanjutkan well-being keuangan pengguna.";
                    break;
            }

            const prompt = `Sebagai psikolog berpengalaman menangani gender ${respBody.jenis_kelamin === "" ? "Wanita" : respBody.jenis_kelamin}, kamu akan menjadi AI dalam aplikasi yang membantu pengguna meningkatkan well-beingnya. Kamu berkomunikasi langsung dengan pengguna, sehingga tidak perlu merespon command prompt ini dan silakan mulai sapa pengguna dengan sapaan sesuai waktu (pagi, siang, sore, malam), gunakan selalu gaya komunikasi  ${respBody.gaya_bicara === "" ? "Friendly" : respBody.gaya_bicara} dan durasi panjang pendek komunikasi ${respBody.jenis_penyampaian === "" ? "Singkat" : respBody.jenis_penyampaian}, serta tolong berikan respon curhat yang positif. ${type}. Arahkan pembicaraan menjadi positif dan solutif tanpa menghakimi pengguna apabila dalam pembicaraan dengan pengguna muncul respon pengguna yang mengandung unsur Negative Thought Patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar mudah dipahami.`;


            const getConversationDetail = await client().detailConversation.updateMany({
                where: {
                    conversationId: respBody.conversation_id,
                    roleAi: "system",
                },
                data: {
                    response: prompt
                }
            })

            return getConversationDetail;
        }catch (e) {
        //     err
            throw new ApiError(errors.INTERNAL_SERVER_ERROR);
        }
    }
    
}

export default new CurhatServices();