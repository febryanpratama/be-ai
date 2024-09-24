import {Body, Post, Route, Controller} from "tsoa";
import httpStatus from "http-status";
import {createResponse, ResponseData} from "config/ResponseData";
import { PostTextSpeechRequest } from "entity/AuthEntity";
import speechServices from "services/speechService/speechServices";

@Route("api/speech")
export class SpeechController extends Controller {
  // @Post("login")
  // public async login(@Body() body: LoginRequest): Promise<ResponseData<LoginResponse>> {
  //   validateLoginFields(body);
  //   const resp = await AuthServices.login(body);
  //   this.setStatus(httpStatus.OK);
  //   return createResponse(resp);
  // }

  // @Post("register")
  // public async register(@Body() body: RegisterRequest): Promise<ResponseData<LoginResponse>> {
  //   validateRegisterFields(body)
  //   const resp = await AuthServices.register(body);
  //   this.setStatus(httpStatus.OK);
  //   return createResponse(resp);
  // }

  @Post("text-to-speech")
  public async textToSpeech(@Body() body: PostTextSpeechRequest): Promise<ResponseData<any>> {
    const resp = await speechServices.textToSpeech(body);

    this.setStatus(httpStatus.OK);
    return createResponse(resp);

  }
}
