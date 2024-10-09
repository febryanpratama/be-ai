import {Body, Controller, Get, Route, Request, Security, Post, Put, Delete, Tags} from "tsoa";
import {Context} from "middleware/context";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import ReminderDetailService from "services/reminderService/ReminderDetailService";
import httpStatus from "http-status";
import {createResponse} from "config/ResponseData";
import {ReminderDetailRequest} from "root/src/entity/ReminderEntity";
import {validateReminderDetail} from "root/src/validator/ReminderValidator";

@Route("api/reminder/{reminderId}/detail")
@Tags("Reminder Detail")
export class ReminderDetailController extends Controller {
    @Get("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async getReminderDetail(reminderId:number): Promise<any> {
    //

        const resp = await ReminderDetailService.get(Number(reminderId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeReminderDetail(@Body() body: ReminderDetailRequest,@Request() request: Context, reminderId:number): Promise<any> {
        validateReminderDetail(body)
        const userId = request.user.id;
        const resp = await ReminderDetailService.postReminderDetail(body, reminderId, Number(userId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }
}
