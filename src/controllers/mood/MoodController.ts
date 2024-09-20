import { Body, Controller, Get, Post, Request, Route, Security } from "tsoa";
import { ScopeRole } from "root/src/enum/ScopeRoleEnum";
import { MoodRequest } from "entity/AuthEntity";
import { Context } from "middleware/context";
import MoodServices from "services/moodService/MoodServices";
import { createResponse } from "config/ResponseData";
import { validateStoreMoodFields } from "root/src/validator/AuthValidator";

@Route("api/mood")
export class MoodController extends Controller {

    @Get("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async getMood(@Request() request: Context): Promise<any> {
        const id = request.user.id

        const resp = await MoodServices.getMood(Number(id));

        this.setStatus(200);
        return createResponse(resp);
    }

    @Post("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeMood(@Body() body: MoodRequest,@Request() request: Context): Promise<any> {
        validateStoreMoodFields(body);
        const id = request.user.id

        const resp = await MoodServices.storeMood(body, Number(id));

        this.setStatus(200);
        return createResponse(resp);
    }
}