import { Body, Controller, Get, Hidden, Post, Request, Route, Security } from "tsoa";
import { ScopeRole } from "root/src/enum/ScopeRoleEnum";
import { Context } from "middleware/context";
import {CurhatRequest, DetailCurhatRequest, DetailPostCurhatRequest, SessionCurhatRequest} from "entity/AuthEntity";
import {
    validateDetailCurhatFields,
    validatePostDetailCurhatFields, validateSessionCurhatFields, validateStoreCurhatFields

} from "root/src/validator/AuthValidator";
import { createResponse } from "config/ResponseData";

import httpStatus from "http-status";
import CurhatServices from "services/curhatService/CurhatServices";


@Route("api/curhat")
export class CurhatController extends Controller {
    // @Get("/")

    @Get("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async getCurhat(@Request() request: Context): Promise<any> {
        const id = request.user.id;

        const resp = await CurhatServices.getCurhat(Number(id));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);

    }

    @Post("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeCurhat(@Body() body: CurhatRequest, @Request() request:Context): Promise<any> {
        validateStoreCurhatFields(body);

        const id = request.user.id;
        const resp = await CurhatServices.storeCurhat(body, Number(id));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("/detail")
    @Security("bearerAuth", [ScopeRole.USER])
    public async detailCurhat(@Body() body: DetailCurhatRequest, @Request() request: Context): Promise<any> {
        validateDetailCurhatFields(body);
        const id = request.user.id;
        const resp = await CurhatServices.detailCurhat(body, Number(id));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("store-detail")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeDetailCurhat(@Body() body: DetailPostCurhatRequest, @Request() request: Context): Promise<any> {
        validatePostDetailCurhatFields(body);
        const id = request.user.id;
        const resp = await CurhatServices.storeDetailCurhat(body, Number(id));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("create-session-curhat")
    @Security("bearerAuth", [ScopeRole.USER])
    public async createSessionCurhat(@Body() body: SessionCurhatRequest, @Request() request: Context): Promise<any>{
        validateSessionCurhatFields(body)
        const id = request.user.id;
        const resp = await CurhatServices.storeSessionCurhat(body, Number(id));

        this.setStatus(httpStatus.OK)
        return createResponse(resp)
    }

}