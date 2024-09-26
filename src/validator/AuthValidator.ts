import { LoginRequest, LoginV2Request, PasswordV2Request, RegisterRequest } from "root/src/entity/AuthEntity";
import { validator } from "root/src/validator/Validator";

export const validateLoginFields = (fields: LoginRequest) => {
    validator.username(fields.username);
};

export const validateLoginV2Fields = (fields: LoginV2Request) => {
    validator.username(fields.email);
}

export const validatePasswordV2Fields = (fields: PasswordV2Request) => {
    validator.email(fields.email);
}


export const validateRegisterFields = (fields: RegisterRequest) => {
    validator.username(fields.username);
    validator.email(fields.email);
    validator.password(fields.password);
}

export const validateCheckFields = (fields: any) => {
    validator.username(fields.key)
    validator.username(fields.value)
}

export const validateMbtiFields = (fields: any) => {
    validator.string(fields.nama)
    validator.string(fields.gender)
    validator.string(fields.username)
    validator.string(fields.password)
    validator.string(fields.foto)
    validator.string(fields.prompt)
    validator.string(fields.bahasa)
    validator.string(fields.gaya_komunikasi)
    validator.string(fields.durasi_komunikasi)
}


export const validateStoreMoodFields = (fields: any) => {
    validator.typeEmoticon(fields.emoticon)
    validator.string(fields.description)
    validator.typeMood(fields.type)
}

export const validateStoreCurhatFields = (fields: any) => {
    validator.string(fields.prompt)
    validator.string(fields.uuid)
}

export const validateDetailCurhatFields = (fields: any) => {
    validator.number(fields.conversation_id)
}

export const validatePostDetailCurhatFields = (fields: any) => {
    validator.number(fields.conversation_id)
    validator.string(fields.prompt)
}

export const validatePostSessionCurhatFields = (fields: any) => {
    validator.string(fields.gender)
    validator.string(fields.nama)
}

export const validateSessionCurhatFields = (fields: any) => {
    validator.string(fields.jenis_kelamin)
    validator.string(fields.gaya_bicara)
    validator.string(fields.jenis_penyampaian)
}