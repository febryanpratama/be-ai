export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginV2Request {
    email: string;
}

export interface PasswordV2Request {
    email: string;
    password?: string;
    otp?: number;
}

export interface LoginResponse {
    token: string;
    user: {
        username: string;
        email: string;
        name: string;
        avatar: string;
        address: string;
        phone: string;
        active: boolean;
    }
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface CheckRequest {
    key: string;
    value: string;
}


export interface MbtiRequest {
    nama:string,
    gender: string,
    username: string,
    password: string,
    foto: string,
    prompt: string;
    bahasa: string;
    gaya_komunikasi: string;
    durasi_komunikasi: string;
}

export interface MoodRequest {
    emoticon: string;
    description: string;
    type: string;
}

export interface CurhatRequest {
    prompt: string;
    uuid?: string;
}

export interface DetailCurhatRequest {
    conversation_id: number;
}

export interface DetailPostCurhatRequest{
    conversation_id: number;
    prompt: string;
}

export interface PostTextSpeechRequest {
    text: string;
}

export interface PostSessionCurhatOpenRequest {
    nama?: string;
    gender?: string;
}

export interface PackageRequest {
    price: string;
    total_people: string;
    type: string;
}

export interface UpdatePackageRequest {
    package_id: number;
    price: string;
    total_people: string;
    type: string;
}

export interface DetailPackageRequest {
    package_id: number;
}