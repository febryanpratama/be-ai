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


class CurhatServices {

    public getCurhat = async (userId: number): Promise<any> => {
        const dataCurhat = await client().conversation.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "asc" // Sort by newest date first
            }
        })

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
                userId
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

        return listDetailConversation;
    }

    public storeSessionCurhat = async (respBody: any, userId: number): Promise<any> => {

        try {
            const prompt = `Sebagai psikolog berpengalaman dengan gender ${respBody.jenis_kelamin}, silakan sapa SAYA dengan gaya komunikasi ${respBody.gaya_bicara} dan tingkat panjang pendek komunikasi ${respBody.jenis_penyampaian}, serta tolong berikan respon curhat yang positif. Arahkan pembicaraan menjadi positif dan solutif jika dalam pembicaraan terdapat unsur Negative Thought Patterns seperti All-or-Nothing Thinking (Black-and-White Thinking), Overgeneralization, Mental Filtering that only Focusing solely on the negative aspects, Disqualifying the Positive, Jumping to Conclusions, Catastrophizing (Magnifying or Minimizing), Emotional Reasoning: Believing that feelings reflect reality, Should Statements, Labeling and Mislabeling, Personalization: Taking things too personally, Blaming Others,  Fallacy of Fairness, Perfectionism, Comparison, Mind Reading, Fortune Telling. Apabila respon Anda cukup panjang maka tolong pisahkan dengan spasi antar baris agar mudah dipahami.  Apabila $name memberi respon yang mengandung unsur Negative thought patterns tolong ditanggapi dengan baik, dan Anda harus dapat mengalihkan perlahan-lahan ke pembicaraan yang positif dan solutif.`


            const storeConversation = await this._storeConversation({}, userId);

            console.debug("============================")
            console.debug(storeConversation)

            const body = {
                conversation_id: storeConversation.id,
                prompt : prompt
            }

            const storeDetailConverstaion = await this.storeDetailCurhatSession(body, userId);

            const getDetailCurhat = await this.detailCurhat(body, userId)

            console.debug("============================")
            console.debug(storeDetailConverstaion)


            return getDetailCurhat;
        }catch(e:any){
            console.debug(e);

            throw new ApiError(errors.UNAUTHENTICATED)
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
                roleAi: "user"
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
    
}

export default new CurhatServices();