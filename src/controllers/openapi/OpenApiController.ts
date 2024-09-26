import {Body, Controller, Route, Get, Request, Security, Post, Hidden} from "tsoa";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import {Context} from "middleware/context";
import CurhatServices from "services/curhatService/CurhatServices";
import httpStatus from "http-status";
import {createResponse} from "config/ResponseData";
import {validatePostSessionCurhatFields} from "root/src/validator/AuthValidator";
import {PostSessionCurhatOpenRequest} from "root/src/entity/AuthEntity";

@Route("api/open-api")
export class OpenApiController extends Controller {
    @Post("create-session-chat")
    @Hidden()
    public async createSessionCurhat(@Body() body: PostSessionCurhatOpenRequest): Promise<any> {
        validatePostSessionCurhatFields(body)
        const resp = await CurhatServices.postSessionOpenApi(body.gender, body.nama);

        this.setStatus(httpStatus.OK);
        return createResponse(resp);
    }
}

