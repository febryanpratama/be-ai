import { client } from "root/src/db/db"
import IntegrationChatGpt from "root/src/integration/IntegrationChatGpt"
import { v4 as uuidv4 } from "uuid";



class CurhatServices {

    public getCurhat = async (userId: number): Promise<any> => {
        const dataCurhat = await client().conversation.findMany({
            where: {
                userId
            },
            include: {
                DetailConversation: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
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
                isUser: true
            }
        })

        const resp = await IntegrationChatGpt.postMbti(body.prompt);

        // Detail Conversation AI
        const storeDetailConverstaionAI = await client().detailConversation.create({
            data: {
                conversationId: setStore.id,
                response: resp.response,
                isUser: false
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
     
        const detailConversation = await client().detailConversation.findMany({
            where: {
                conversationId: body.conversation_id,
                conversation: {
                    userId // Adjust this according to your schema
                }
            },include: {
                conversation: true
            }
        })

        return detailConversation
    }

    public storeDetailCurhat = async (body: any, userId: number): Promise<any> => {
        const storeDetailConverstaion = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: body.prompt,
                isUser: true
            }
        })

        const resp = await IntegrationChatGpt.postMbti(body.prompt);

        const storeDetailConverstaionAI = await client().detailConversation.create({
            data: {
                conversationId: body.conversation_id,
                response: resp.response,
                isUser: false
            }
        })

        const listDetailConversation = await client().detailConversation.findMany({
            where: {
                conversationId: body.conversation_id
            }
        })


        return listDetailConversation;
    }
}

export default new CurhatServices();