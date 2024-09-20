import {Body, Post, Route, Controller} from "tsoa";
import {CheckRequest, LoginRequest, LoginResponse, LoginV2Request, PasswordV2Request, RegisterRequest} from "root/src/entity/AuthEntity";
import {validateCheckFields, validateLoginFields, validateLoginV2Fields, validatePasswordV2Fields, validateRegisterFields} from "root/src/validator/AuthValidator";
import AuthServices from "services/auth/AuthServices";
import httpStatus from "http-status";
import {createResponse, ResponseData} from "config/ResponseData";

@Route("api/auth")
export class AuthController extends Controller {
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

  @Post("/check")
  public async check(@Body() body: CheckRequest): Promise<ResponseData<any>> {
    validateCheckFields(body);
    const resp = await AuthServices.checkValue(body.key, body.value);

    this.setStatus(httpStatus.OK);
    return createResponse(resp);
  }

  @Post("/login-v2")
  public async loginV2(@Body() body: LoginV2Request): Promise<ResponseData<LoginResponse>> {
    validateLoginV2Fields(body);
    const resp = await AuthServices.loginV2(body);
    this.setStatus(httpStatus.OK);
    return createResponse(resp);
  }

  @Post("/password-v2")
  public async passwordV2(@Body() body: PasswordV2Request): Promise<ResponseData<any>> {
    validatePasswordV2Fields(body);
    const resp = await AuthServices.passwordV2(body);
    this.setStatus(httpStatus.OK);
    return createResponse(resp);
  }
}
