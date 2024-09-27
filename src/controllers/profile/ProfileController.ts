import { MbtiRequest } from "entity/AuthEntity";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";

import {Context} from "middleware/context";
import {Body, Controller, Hidden, Post, Request, Route, Security} from "tsoa";
import {createResponse, ResponseData} from "config/ResponseData";
import httpStatus from "http-status";
import { validateCheckFields, validateMbtiFields } from "root/src/validator/AuthValidator";
import ProfileServices from "services/profileService/ProfileServices";
@Route("api/profile")
export class ProfileController extends Controller {
    @Post("/mbti")
    @Security("bearerAuth", [ScopeRole.USER])
    public async getProfile(@Body() body: MbtiRequest,@Request() request: Context): Promise<ResponseData<any>> {
        validateMbtiFields(body);
        const id = request.user.id;
        console.debug(body)
        console.debug(id);
        const resp = await ProfileServices.getMbti(body, Number(id));
        console.debug(resp);
        this.setStatus(httpStatus.OK);
        return createResponse(resp);
    }
}