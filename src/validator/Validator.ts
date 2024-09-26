import { isEmail } from "class-validator";
import { errors } from "config/errors";
import { ApiError } from "utils/apiError";

const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
enum TypeMood {
    career = "career", 
    family = "family", 
    love = "love",
    friends = "friends"
}

enum TypeEmoticon {
    indifferent = "indifferent",
    confused = "confused",
    happy = "happy",
    sad = "sad",
    angry = "angry",
}
const email = (value: string) => {
    if (!isEmail(value)) {
        throw new ApiError(errors.INVALID_EMAIL);
    }
};
const username = (value: string) => {
    if(value.length < 3) {
        throw new ApiError(errors.INVALID_USERNAME);
    }
}

const typeMood = (value: string) => {
    if(!Object.values(TypeMood).includes(value as TypeMood)) {
        throw new ApiError(errors.INVALID_TYPE_MOOD);
    }
}

const typeEmoticon = (value: string) => {
    if(!Object.values(TypeEmoticon).includes(value as TypeEmoticon)) {
        throw new ApiError(errors.INVALID_TYPE_EMOTICON);
    }
}


const password = (value: string) => {
    if (!re.test(value)) {
        throw new ApiError(errors.INVALID_PASSWORD);
    }
};

const name = (value: string) => {
    if(value.length < 3) {
        throw new ApiError(errors.INVALID_NAME);
    }
}

const price = (value: number) => {
    if(value < 0) {
        throw new ApiError(errors.INVALID_PRICE);
    }
}

const duration = (value: number) => {
    if(value < 0) {
        throw new ApiError(errors.INVALID_DURATION);
    }
}

const number = (value: number) => {
    if(value < 0) {
        throw new ApiError(errors.INVALID_NUMBER);
    }
}

const string = (value: string) => {
    if(value.length < 1){
        throw new ApiError(errors.INVALID_STRING)
    }
}

export const validator = {
    email,
    password,
    username,
    name,
    price,
    duration,
    number,
    string,
    typeMood,
    typeEmoticon
}
