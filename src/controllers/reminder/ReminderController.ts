import {Body, Controller, Get, Route, Request, Security, Post, Put, Delete} from "tsoa";
import {Context} from "middleware/context";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import ReminderService from "services/reminderService/ReminderService";
import httpStatus from "http-status";
import {createResponse} from "config/ResponseData";
import {ReminderRequest, ReminderUpdateRequest} from "root/src/entity/ReminderEntity";
import {validateReminder} from "root/src/validator/ReminderValidator";

@Route("api/reminder")
export class ReminderController extends Controller {
    @Get("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async getReminderList(@Request() request: Context): Promise<any> {
    //
        const userId = request.user.id;

        const resp = await ReminderService.get(Number(userId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }
    @Post("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeReminder(@Body() body: ReminderRequest,@Request() request: Context): Promise<any> {
        validateReminder(body)
        const userId = request.user.id;
        const resp = await ReminderService.postReminder(body, Number(userId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Get("/{reminderId}")
    @Security("bearerAuth", [ScopeRole.USER])
    public async detailReminder(reminderId: number,@Request() request: Context): Promise<any> {

        const userId = request.user.id
        const resp = await ReminderService.detailReminder(reminderId, Number(userId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Put("/update")
    @Security("bearerAuth", [ScopeRole.USER])
    public async updateReminder(@Body() body: ReminderUpdateRequest,@Request() request: Context): Promise<any> {
        validateReminder(body)
        const userId = request.user.id;
        const resp = await ReminderService.updateReminder(body, Number(userId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Delete("/destroy/{reminderId}")
    @Security("bearerAuth", [ScopeRole.USER])
    public async deleteReminder(reminderId:number,@Request() request:Context): Promise<any> {
        const userId = request.user.id;
        const resp = await ReminderService.deleteReminder(reminderId, Number(userId));

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }
}
