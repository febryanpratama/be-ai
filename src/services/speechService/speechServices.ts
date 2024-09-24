import integrationVoiceRss from "root/src/integration/integrationVoiceRss";

class SpeechServices {
    // 
    public async textToSpeech(body: any) {
        // 
        const resp = await integrationVoiceRss.fetchApiTextToSpeech(body.text);

        const respBody = {
            file: resp,
        }

        console.debug("RESPONSE BLOB", respBody);
        return respBody;
    }
}

export default new SpeechServices();